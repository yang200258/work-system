<template>
    <div class="wifi-manage">
        <device :searchInfo="wifiInfo" :table="{head,content,loadong,total}" @searchDevice="searchWIFI" @editTable="editWIFI" @delTable="delWIFI" @chooseTable="chooseWIFI"></device>
    </div>
</template>

<script>
import Device from '@/components/device/device'
export default {
    data() {
        return {
            wifiInfo: {},
            head:[{key: 'type',name:'设备类型'},{key: 'no',name:'设备编号'},{key: 'factory',name:'设备厂商'},{key: 'mac',name:'Mac'},{key: 'tel',name:'最近通信'},
                    {key: 'edit',name:'最新编辑'},{key: 'site',name:'关联考勤地点'},{key: 'status',name:'设备状态'}],
            content: [{type: 'WIFI设备',no: '0000000',factory: '加工厂',mac: '123456',tel: '2222-02-02 08:30',edit: 'yqq',site: '海南大厦',status: '可用'},
                        {type: 'WIFI设备',no: '0000000',factory: '加工厂',mac: '123456',tel: '2222-02-02 08:30',edit: 'yqq',site: '海南大厦',status: '可用'},
                        {type: 'WIFI设备',no: '0000000',factory: '加工厂',mac: '123456',tel: '2222-02-02 08:30',edit: 'yqq',site: '海南大厦',status: '停用'}],
            total: 0,
            loadong: false,
            option:[{name: '查看',type:'success',event: 'chooseTable'},{name: '编辑',type:'primary',event: 'editTable'},{name:'停用',type:'danger',event: 'delTable'}],
        }
    },
    components: {
        Device
        },
    methods: {
        searchWIFI: function() {
            
        },
        currentChange: function() {

        },
        editWIFI: function() {

        },
        delWIFI: function() {

        },
        chooseWIFI: function() {
            
        }
    }
}
</script>

<style lang="scss" scoped>
    .wifi-manage {

    }
</style>

