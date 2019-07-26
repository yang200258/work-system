<template>
    <div>
        <bluetooth-and-wifi :type="1" :head="head" :option="option" :formItem="formItem"></bluetooth-and-wifi>
    </div>
</template>

<script>
import BluetoothAndWifi from '@/components/device/BluetoothAndWifi'
export default {
    data() {
        return {
            formItem: [
                {type:'input',inputType:'text',size:'small',prop:'type',placeholder: '',label: '设备类型',disable:true},
                {type:'input',inputType:'text',size:'small',prop:'name',placeholder: '',label: '设备编号',disable:true},
                {type:'input',inputType:'text',size:'small',prop:'manufacturer',placeholder: '',label: '设备厂商',disable:true},
                {type:'input',inputType:'text',size:'small',prop:'model',placeholder: '',label: '设备型号',disable:true},
                {type:'input',inputType:'text',size:'small',prop:'mac',placeholder: '',label: 'mac',disable:true},
                {type:'select',prop:'officeId',label:'考勤地点',placeholder:'请选择',collapseTags:false,multiple:false,options: []},
            ],
            option:[{name: '查看',type:1,event: 'chooseTable'},{name: '编辑',type:1,event: 'editTable'},{name:'停用',type:2,event: 'delTable'},{name:'启用',type:1,event: 'delTable'}],
            head:[{key: 'type',name:'设备类型'},{key: 'name',name:'设备编号'},{key: 'manufacturer',name:'设备厂商'},{key: 'mac',name:'Mac'},{key: 'lastComm',name:'最近通信'},
                    {key: 'operator',name:'最新编辑'},{key: 'office',name:'关联考勤地点'},{key: 'state',name:'设备状态'}],
        }
    },
    mounted() {
        //获取设备管理中对应考勤地点选项
        this.getOffice()
    },
    components: {BluetoothAndWifi},
    methods: {
        async getOffice() {
            try {
                let res = await this.$axios({url:'/es/devices/getOffice',method:'get'})
                console.log('成功获取考勤地点列表',res)
                if(res) {
                    let index = this._.findIndex(this.formItem,item => item.prop === 'officeId')
                    this.formItem[index].options = res 
                }
            }catch(err) {
                console.log(err)
            }
        }
    }
}
</script>

