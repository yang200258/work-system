<template>
    <div class="bluetooth-manage">
        <device :searchInfo="bluetoothInfo" :table="{head,content,loadong,total}" @searchDevice="searchBluetooth" @editTable="editBluetooth" @delTable="delBluetooth" @chooseTable="chooseBluetooth"></device>
    </div>
</template>

<script>
import Device from '@/components/device/device'
export default {
    data() {
        return {
            bluetoothInfo: {},
            head:[{key: 'type',name:'设备类型'},{key: 'no',name:'设备编号'},{key: 'tel',name:'最近通信'},{key: 'edit',name:'最新编辑'},{key: 'site',name:'关联考勤地点'},
                    {key: 'memo',name:'备注'},{key: 'status',name:'设备状态'}],
            content: [{type: '蓝牙设备',no: '0000000',memo: '加工厂',mac: '123456',tel: '2222-02-02 08:30',edit: 'yqq',site: '海南大厦',status: '可用'},
                        {type: '蓝牙设备',no: '0000000',memo: '加工厂',mac: '123456',tel: '2222-02-02 08:30',edit: 'yqq',site: '海南大厦',status: '可用'},
                        {type: '蓝牙设备',no: '0000000',memo: '加工厂',mac: '123456',tel: '2222-02-02 08:30',edit: 'yqq',site: '海南大厦',status: '停用'}],
            total: 0,
            loadong: false,
            option:[{name: '查看',type:'success',event: 'chooseTable'},{name: '编辑',type:'primary',event: 'editTable'},{name:'停用',type:'danger',event: 'delTable'}],
        }
    },
    components: {
        Device
        },
    methods: {
        searchBluetooth: function() {
            
        },
        currentChange: function() {
            
        },
        editBluetooth: function() {

        },
        delBluetooth: function() {

        },
        chooseBluetooth: function() {

        }
    }
}
</script>

<style lang="scss" scoped>
    .bluetooth-manage {

    }
</style>

