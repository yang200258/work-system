<template>
    <div class="wifi-manage">
        <device :searchInfo="wifiInfo" :table="{head,content,loading,total}" @searchDevice="searchWIFI" @editTable="editWIFI" @delTable="delWIFI" @chooseTable="chooseWIFI"
        :infoSet="infoSet" :form="form" :formItem="formItem" :isShowInfo="isShowInfo" @confirm="confirm" @cancel="cancel" @close="close"></device>
    </div>
</template>

<script>
import Device from '@/components/device/device'
export default {
    data() {
        return {
            wifiInfo: {},
            infoSet: {title:'设备信息',width:'500px',confirmText: '关闭',isCancel:false,cancelText:''},
            isShowInfo: false,
            form: {},
            formItem: [
                {type:'input',inputType:'text',size:'small',prop:'type',placeholder: '',label: '设备类型'},
                {type:'input',inputType:'text',size:'small',prop:'name',placeholder: '',label: '设备编号'},
                {type:'input',inputType:'text',size:'small',prop:'manufacturer',placeholder: '',label: '设备厂商'},
                {type:'input',inputType:'text',size:'small',prop:'model',placeholder: '',label: '设备型号'},
                {type:'input',inputType:'text',size:'small',prop:'mac',placeholder: '',label: 'mac'},
                {type:'input',inputType:'text',size:'small',prop:'officeName',placeholder: '',label: '考勤地点'},
            ],
            head:[{key: 'type',name:'设备类型'},{key: 'name',name:'设备编号'},{key: 'manufacturer',name:'设备厂商'},{key: 'mac',name:'Mac'},{key: 'lastComm',name:'最近通信'},
                    {key: 'operator',name:'最新编辑'},{key: 'officeName',name:'关联考勤地点'},{key: 'state',name:'设备状态'}],
            content: [],
            total: 0,
            loading: false,
        }
    },
    components: {Device},
    mounted() {
        this.getWIFI(this.wifiInfo.name,this.showAbnormal)
    },
    methods: {
        searchWIFI: function() {
            this.getWIFI(this.wifiInfo.name,this.showAbnormal)
        },
        currentChange: function(val) {
            this.getWIFI(this.wifiInfo.name,this.showAbnormal,val)
        },
        editWIFI: function(scope) {
            this.infoSet = {title:'设备信息',width:'500px',confirmText: '保存',isCancel:true,cancelText:'取消'}
            this.form = Object.assign({},scope.row)
            this.isShowInfo = true
        },
        //查看时关闭，编辑时保存
        confirm: function() {
            if(!this.infoSet.cancelText) return this.isShowInfo = false
            this.$axios({
                url: '/es/devices/editDevice',
                method: 'post',
                data: this.form
            }).then(res=> {
                if(res) {
                    this.$message.success(res)
                    this.isShowInfo = false
                    this.getWIFI(this.wifiInfo.name,this.showAbnormal)
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
        //启用、停用设备
        delWIFI: function(scope) {
            let deviceId = scope.row.id
            this.$axios({
                url: `/es/devices/changeState?deviceId =${deviceId }`,
                method: 'post',
            }).then(res=> {
                if(res) {
                    this.$message.success(res)
                    this.getWIFI(this.wifiInfo.name,this.showAbnormal)
                }
            }).catch(err=> {
                console.log(err)
            })
        },
        //查看
        chooseWIFI: function(scope) {
            this.infoSet = {title:'设备信息',width:'500px',confirmText: '关闭',isCancel:false,cancelText:''}
            this.form = Object.assign({},scope.row)
            this.isShowInfo = true
        },
        //获取设备列表
        getWIFI: function(name,showAbnormal,page=1,size=20,type=1) {
            this.loading = true
            this.$axios({
                url: `/es/devices/searchDevice?page=${page}&size=${size}`,
                method: 'post',
                data: {name,type,showAbnormal}
            }).then(res=> {
                console.log('成功获取设备',res)
                if(res) {
                    this.content = res.content
                    this.total = res.total
                    this.loading = false
                }
            }).catch(err=> {
                console.log(err)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .wifi-manage {

    }
</style>

