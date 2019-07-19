<template>
    <div>
        <device :searchInfo="searchInfo" :table="{head,content,loading,total,option}" @searchDevice="searchDevice" @editTable="editDevice" @delTable="delDevice" 
            @chooseTable="chooseDevice" :infoSet="infoSet" :form="form" :formItem="formItem" @confirm="confirm" @cancel="cancel" @close="close" :isShowInfo="isShowInfo"
            @runRecord="runRecord" @currentChange="currentChange"></device>
        <my-dialog :title="'运行信息记录'" :show="isShowRecord" @confirm="closeRecord" @close="closeRecord" :width="'800px'" :isOption="false">
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
    props:{
        head: {type:Array,default:()=> []},
        option: {type:Array,default:()=> []},
        type: {type:Number,default:0},
        formItem: {type:Array,default:()=> []},
    },
    data() {
        return {
            searchInfo: {},
            content: [],
            total: 0,
            loading: false,
            infoSet: {title:'设备信息',width:'500px',confirmText: '关闭',isCancel:false,cancelText:''},
            isShowInfo: false,
            form: {},
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
        // TODO: 抽离蓝牙和WIFI接口
        this.getDevice('',false,this.type)
    },
    components: {Device,TableData,MyDialog},
    methods: {
        //搜索设备
        searchDevice: function() {
            let {name,showAbnormal} = this.searchInfo
            let type = this.type
            this.getDevice(name,showAbnormal,type)
        },
        currentChange: function(val) {
            let {name,showAbnormal} = this.searchInfo
            let type = this.type
            this.getDevice(name,showAbnormal,type,val,20)
        },
        //编辑设备信息
        editDevice: function(scope) {
            this.infoSet = {title:'设备信息',width:'500px',confirmText: '保存',isCancel:true,cancelText:'取消'}
            let {id,mac,manufacturer,memo,model,name,office,type} = scope.row
            let officeId = office.id
            this.form = Object.assign({},{id,mac,manufacturer,memo,model,name,type,officeId})
            this.isShowInfo = true
        },
        //启用、禁用设备
        async delDevice(scope) {
            let deviceId = scope.row.id
            try {
                let res = await this.$axios({url: `/es/devices/changeState?deviceId=${deviceId }`,method: 'post',})
                if(res) {
                    this.$message.success(res)
                    this.searchDevice()
                }
            } catch(err) {
                console.log(err)
            }
        },
        //查看设备信息
        chooseDevice: function(scope) {
            this.infoSet = {title:'设备信息',width:'500px',confirmText: '关闭',isCancel:false,cancelText:''}
            let {id,mac,manufacturer,memo,model,name,office,type} = scope.row
            let officeId = office.id
            this.form = Object.assign({},{id,mac,manufacturer,memo,model,name,type,officeId})
            this.isShowInfo = true
        },
        //查看时关闭，编辑时保存
        async confirm() {
            if(!this.infoSet.isCancel) return this.isShowInfo = false
            try {
                let res = await this.$axios({url: '/es/devices/editDevice',method: 'post',data: this.form})
                if(res) {
                    this.$message.success(res)
                    this.isShowInfo = false
                    this.searchDevice()
                }
            } catch(err) {
                console.log(err)
            }
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
        async getDevice(name='',showAbnormal=false,type=0,page=1,size=20) {
            this.loading = true
            try {
                let res = await this.$axios({url: `/es/devices/searchDevice?page=${page}&size=${size}`,method: 'post',data: {name,type,showAbnormal}})
                console.log('成功获取设备',res)
                if(res) {
                    this.content = res.content
                    this.total = res.recordCount
                    this.loading = false
                }
            } catch(err) {
                console.log(err)
                this.loading = false
            }
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
        async deviceRecord(deviceId,startDate='',endDate='',page=1,size=20) {
            this.recordLoading = true
            try {
                let res = await this.$axios({url: `/es/devices/deviceLog?page=${page}&size=${size}`,method: 'post',data: {deviceId,endDate,startDate}})
                if(res) {
                    this.recordData = res.content
                    this.recordLoading = false
                }
            } catch(err) {
                console.log(err)
            }
        },
    }
}
</script>

