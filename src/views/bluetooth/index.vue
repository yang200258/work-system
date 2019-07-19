<template>
    <div class="bluetooth-manage">
        <bluetooth-and-wifi :type="0" :head="head" :option="option" :formItem="formItem"></bluetooth-and-wifi>
    </div>
</template>

<script>
import BluetoothAndWifi from '@/components/device/BluetoothAndWifi'
export default {
    data() {
        return {
            head:[{key: 'type',name:'设备类型'},{key: 'name',name:'设备编号'},{key: 'lastComm',name:'最近通信'},{key: 'operator',name:'最新编辑'},{key: 'office',name:'关联考勤地点'},
                    {key: 'memo',name:'备注'},{key: 'state',name:'设备状态'}],
            option:[{name: '查看',type:1,event: 'chooseTable'},{name: '编辑',type:1,event: 'editTable'},{name:'停用',type:2,event: 'delTable'},{name:'启用',type:1,event: 'delTable'},{name:'运行记录',type:1,event: 'runRecord'}],
            formItem: [
                {type:'input',inputType:'text',size:'small',prop:'type',placeholder: '',label: '设备类型',disable: true},
                {type:'input',inputType:'text',size:'small',prop:'name',placeholder: '',label: '设备编号',disable: true},
                {type:'input',inputType:'text',size:'small',prop:'manufacturer',placeholder: '',label: '设备厂商',disable: true},
                {type:'input',inputType:'text',size:'small',prop:'model',placeholder: '',label: '设备型号',disable: true},
                {type:'select',prop:'officeId',label:'考勤地点',placeholder:'请选择',collapseTags:false,multiple:false,options: []},
                {type:'input',inputType:'text',size:'small',prop:'memo',placeholder: '',label: '备注'},
            ],
        }
    },
    components: {BluetoothAndWifi},
}
</script>

