<template>
    <div class="device-manage">
        <device :searchInfo="deviceInfo" :table="{head,content,loading,total}" @searchDevice="searchDevice" @editTable="editDevice" @delTable="delDevice" @chooseTable="chooseDevice"
        :infoSet="infoSet" :form="form" :formItem="formItem" :isShowInfo="isShowInfo" @confirm="confirm" @cancel="cancel" @close="close" :mutiItem="mutiItem" @addDevice="addDevice"
        @runRecord="runRecord"></device>
        <my-dialog :title="'运行信息记录'" :show="isShowRecord" :confirmText="'关闭'" @confirm="closeRecord" @close="closeRecord">
            <template slot="dialog-content">
                <table-data :head="recordHead" :tableData="recordData" :tableLoading="recordLoading" :isSelected="false" :isOption="false" :tableSort="tableSort" @currentChange="changeRecord"
                :data="searchRecord" :formData="recordItem" @btnClick="filterRecord"></table-data>
            </template>
        </my-dialog>
    </div>
</template>

<script>
import device from '@/components/device/device'
import TableData from '@/components/common/TableData'
import MyDialog from '@/components/common/MyDialog'
export default {
    data() {
        return {
            deviceInfo: {},
            mutiItem: {right:[{nameText:'导入',className:'iconfont icon-iconfontzhizuobiaozhun023146',event:'input'},{nameText:'添加',className:'el-icon-circle-plus-outline',event:'addDevice'}]},
            formData: [{type: 'input',placeholder: '设备编号',label: 'name'},{type: 'checkbox',nameText: '只显示通信异常设备（最近5天没有通信）',label: 'isException'},
                            {type:'button',nameText: '搜索'}],
            head:[{key: 'type',name:'设备类型'},{key: 'no',name:'设备编号'},{key: 'tel',name:'最近通信'},{key: 'edit',name:'最新编辑'},{key: 'site',name:'关联考勤地点'},
                    {key: 'memo',name:'备注'},{key: 'status',name:'设备状态'}],
            option:[{name: '查看',type:1,event: 'chooseTable'},{name: '编辑',type:1,event: 'editTable'},{name:'停用',type:2,event: 'delTable'},{name:'运行记录',type:1,event: 'runRecord'}],
            content: [],
            total: 0,
            loading: false,
            infoSet: {title:'设备信息',width:'500px',confirmText: '关闭',isCancel:false,cancelText:''},
            form: {},
            formItem: [
                {type:'input',inputType:'text',prop:'type',placeholder: '请输入设备类型',label: '设备类型'},
                {type:'input',inputType:'text',prop:'name',placeholder: '请输入设备编号',label: '设备编号'},
                {type:'input',inputType:'text',prop:'manufacturer',placeholder: '请输入设备厂商',label: '设备厂商'},
                {type:'input',inputType:'text',prop:'model',placeholder: '请输入设备型号',label: '设备型号'},
                {type:'mutiSelect',prop:'tenantId',nameText:'所属租户',options: []},
                {type:'input',inputType:'text',prop:'mac',placeholder: '请输入Mac',label: 'Mac'},
                {type:'input',inputType:'text',prop:'uuid',placeholder: '请输入UUID',label: 'UUID'},
                {type:'input',inputType:'text',prop:'major',placeholder: '请输入Major',label: 'Major'},
                {type:'input',inputType:'text',prop:'minor',placeholder: '请输入Minor',label: 'Minor'},
                {type:'input',inputType:'text',prop:'admin',placeholder: '请输入管理员',label: '管理员'},
                {type:'input',inputType:'text',prop:'officeName',placeholder: '请输入考勤地点',label: '考勤地点'},
                {type:'input',inputType:'text',prop:'memo',placeholder: '请输入备注',label: '备注'},
            ],
            isShowInfo:false,
            //设备运行记录数据**************************
            isShowRecord: false,
            recordHead: [{key: 'date',name:'日期'},{key: 'time',name:'时间'},{key: 'user',name:'用户'},{key: 'gps',name:'记录GPS'},{key: 'scope',name:'地点与设备间距'}],
            tableSort:{},
            recordData: [],
            recordLoading: false,
            recordId: '',
            searchRecord: {},
            recordItem: [{type:'date',dateType:'daterange',label:'date',startPlaceholder:'开始日期',endPlaceholder:'结束日期'},{type:'button',btnType:'primary',nameText:'筛选'}],
        }
    },
    mounted() {
        this.getDevice(this.deviceInfo)
    },
    components: {device,TableData,MyDialog},
    methods: {
        searchDevice: function() {
            this.getDevice(this.deviceInfo)
        },
        currentChange: function(val) {
            this.getDevice(this.deviceInfo,val)
        },
        editDevice: function() {

        },
        //启用、停用设备
        delDevice: function(scope) {
            let deviceId = scope.row.id
            this.$axios({
                url: `/sys/devices/changeState?deviceId =${deviceId }`,
                method: 'post',
            }).then(res=> {
                if(res) {
                    this.$message.success(res)
                    this.getDevice(this.deviceInfo)
                }
            }).catch(err=> {
                console.log(err)
            })
        },
        //查看设备
        chooseDevice: function(scope) {
            this.form = Object.assign({},scope.row)
            this.infoSet = {title:'设备信息',width:'500px',confirmText: '关闭',isCancel:false,cancelText:''}
            this.isShowInfo = true
        },
        addDevice: function() {
            this.form = {}
            this.infoSet = {title:'添加设备',width:'500px',confirmText: '保存',isCancel:true,cancelText:'取消'}
            this.isShowInfo = true
        },
        //关闭查看、、保存编辑
        confirm: function() {
            if(!this.infoSet.isCancel) return this.isShowInfo = false
            this.$axios({
                url: '/sys/devices/saveBluetooth',
                method: 'post',
                data: this.form
            }).then(res=> {
                if(res) {
                    this.$message.success(res)
                    this.isShowInfo = false
                    this.getDevice(this.deviceInfo)
                }
            }).catch(err=> {
                console.log(err)
            })
        },
        //取消编辑
        cancel: function() {
            this.isShowInfo = false
        },
        //关闭弹窗
        close: function() {
            this.isShowInfo = false
        },
        //获取设备列表
        getDevice: function(info,page=1,size=20) {
            this.loading = true
            this.$axios({
                url: `/sys/devices/searchBluetooth?page=${page}&size=${size}`,
                method: 'post',
                data: info
            }).then(res=> {
                console.log('获取到设备数据',res)
                if(res) {
                    this.deviceData = res.content
                    this.total = res.total
                    this.loading = false
                }
            }).catch(err=> {
                console.log(err)
            })
        },
        //*****************设备运行记录************************************* */
        //点击运行记录显示
        runRecord: function(scope) {
            this.isShowRecord = true
            this.recordId = scope.row.id
            this.deviceRecord(this.recordId)
        },
        closeRecord: function() {
            this.isShowRecord = false
        },  
        //翻页
        changeRecord: function(val) {
            this.deviceRecord(this.recordId,this.searchRecord.date[0],this.searchRecord.date[1],val)
        },
        //筛选运行记录
        filterRecord: function() {
            this.deviceRecord(this.recordId,this.searchRecord.date[0],this.searchRecord.date[1])
        },
        //设备运行记录
        deviceRecord: function(deviceId,starDate='',endDate='',page=1,size=20) {
            this.recordLoading = true
            this.$axios({
                url: `/es/devices/deviceLog?page=${page}size=${size}`,
                method: 'post',
                data: {deviceId,endDate,starDate}
            }).then(res=> {
                if(res) {
                    this.recordData = res.content
                    this.recordLoading = false
                }
            }).catch(err=> {
                console.log(err)
            })
        },
    }
}
</script>

<style lang="scss" scoped>
    .bluetooth-manage {

    }
</style>

