<template>
    <div class="bluetooth-manage">
        <device :searchInfo="bluetoothInfo" :table="{head,content,loading,total,option}" @searchDevice="searchBluetooth" @editTable="editBluetooth" @delTable="delBluetooth" 
            @chooseTable="chooseBluetooth" :infoSet="infoSet" :form="form" :formItem="formItem" @confirm="confirm" @cancel="cancel" @close="close" :isShowInfo="isShowInfo"
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
import Device from '@/components/device/device'
import TableData from '@/components/common/TableData'
import MyDialog from '@/components/common/MyDialog'
export default {
    data() {
        return {
            bluetoothInfo: {},
            head:[{key: 'type',name:'设备类型'},{key: 'name',name:'设备编号'},{key: 'lastComm',name:'最近通信'},{key: 'operator',name:'最新编辑'},{key: 'officeName',name:'关联考勤地点'},
                    {key: 'memo',name:'备注'},{key: 'state',name:'设备状态'}],
            option:[{name: '查看',type:1,event: 'chooseTable'},{name: '编辑',type:1,event: 'editTable'},{name:'停用',type:2,event: 'delTable'},{name:'启用',type:1,event: 'delTable'},{name:'运行记录',type:1,event: 'runRecord'}],
            content: [],
            total: 0,
            loading: false,
            infoSet: {title:'设备信息',width:'500px',confirmText: '关闭',isCancel:false,cancelText:''},
            isShowInfo: false,
            form: {},
            formItem: [
                {type:'input',inputType:'text',size:'small',prop:'type',placeholder: '',label: '设备类型',read: true},
                {type:'input',inputType:'text',size:'small',prop:'name',placeholder: '',label: '设备编号',read: true},
                {type:'input',inputType:'text',size:'small',prop:'manufacturer',placeholder: '',label: '设备厂商',read: true},
                {type:'input',inputType:'text',size:'small',prop:'model',placeholder: '',label: '设备型号',read: true},
                // {type:'input',inputType:'text',size:'small',prop:'officeName',placeholder: '',label: '考勤地点',read: true},
                {type:'input',inputType:'text',size:'small',prop:'memo',placeholder: '',label: '备注',read: true},
            ],
            //设备运行记录数据**************************
            isShowRecord: false,
            recordHead: [{key: 'date',name:'日期'},{key: 'time',name:'时间'},{key: 'user',name:'用户'},{key: 'gps',name:'记录GPS'},{key: 'scope',name:'地点与设备间距'}],
            tableSort:{},
            recordData: [],
            recordLoading: false,
            recordId: '',
            searchRecord: {},
            recordItem: [{type:'date',dateType:'daterange',label:'date',startPlaceholder:'开始日期',endPlaceholder:'结束日期',valueFormat:'yyyy-MM-dd'},{type:'button',btnType:'primary',nameText:'筛选'}],

        }
    },
    mounted() {
        this.getBlooth(this.bluetoothInfo.name,this.bluetoothInfo.showAbnormal)
    },
    components: {Device,TableData,MyDialog},
    methods: {
        //搜索设备
        searchBluetooth: function() {
            this.getBlooth(this.bluetoothInfo.name,this.bluetoothInfo.showAbnormal)
        },
        currentChange: function(val) {
            this.getBlooth(this.bluetoothInfo.name,this.bluetoothInfo.showAbnormal,val,20)
        },
        editBluetooth: function(scope) {
            this.infoSet = {title:'设备信息',width:'500px',confirmText: '保存',isCancel:true,cancelText:'取消'}
            this.form = Object.assign({},scope.row)
            this.isShowInfo = true
        },
        //启用、禁用设备
        delBluetooth: function(scope) {
            let deviceId = scope.row.id
            this.$axios({
                url: `/es/devices/changeState?deviceId=${deviceId }`,
                method: 'post',
            }).then(res=> {
                if(res) {
                    this.$message.success(res)
                    this.getBlooth(this.bluetoothInfo.name,this.bluetoothInfo.showAbnormal)
                }
            }).catch(err=> {
                console.log(err)
            })
        },
        //查看设备信息
        chooseBluetooth: function(scope) {
            this.infoSet = {title:'设备信息',width:'500px',confirmText: '关闭',isCancel:false,cancelText:''}
            this.form = Object.assign({},scope.row)
            this.isShowInfo = true
        },
        //查看时关闭，编辑时保存
        confirm: function() {
            if(!this.infoSet.isCancel) return this.isShowInfo = false
            this.$axios({
                url: '/es/devices/editDevice',
                method: 'post',
                data: this.form
            }).then(res=> {
                if(res) {
                    this.$message.success(res)
                    this.isShowInfo = false
                }
            }).catch(err=> {
                console.log(err)
            })
        },
        //取消操作---编辑时用
        cancel: function() {
            this.isShowInfo = false
        },
        //关闭弹窗---编辑、取消时公用
        close: function() {
            this.isShowInfo = false
        },
        //获取设备列表
        getBlooth: function(name,showAbnormal,page=1,size=20,type=0) {
            this.loading = true
            this.$axios({
                url: `/es/devices/searchDevice?page=${page}&size=${size}`,
                method: 'post',
                data: {name,type,showAbnormal}
            }).then(res=> {
                console.log('成功获取蓝牙设备',res)
                if(res) {
                    this.content = res.content
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
            let startDate = this.searchRecord.date ? this.searchRecord.date[0] : ''
            let endDate = this.searchRecord.date ? this.searchRecord.date[1] : ''
            this.deviceRecord(this.recordId,startDate,endDate,val)
        },
        //筛选运行记录
        filterRecord: function() {
            let startDate = this.searchRecord.date ? this.searchRecord.date[0] : ''
            let endDate = this.searchRecord.date ? this.searchRecord.date[1] : ''
            this.deviceRecord(this.recordId,startDate,endDate)
        },
        //设备运行记录
        deviceRecord: function(deviceId,startDate='',endDate='',page=1,size=20) {
            this.recordLoading = true
            this.$axios({
                url: `/es/devices/deviceLog?page=${page}&size=${size}`,
                method: 'post',
                data: {deviceId,endDate,startDate}
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

