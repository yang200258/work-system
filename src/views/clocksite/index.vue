<template>
    <div class="clocksite-container">
        <clock-site :searchInfo="searchInfo" :siteInfo="siteInfo" :sitehead="sitehead" :option="option" @delSite="delSite" @querySite="querySite" @chooseSite="chooseSite"></clock-site>
    </div>
</template>

<script>
import ClockSite from '@/components/common/ClockSite'
export default {
    data() {
        return {
            //搜索地点信息（包括地点名称和城市）
            searchInfo:{},
            siteInfo: {
                content:[{id:0,city: '海口',sitename: '海南大厦1',style: 'GPS',group: '产品中心考勤组'},{id:1,city: '海口',sitename: '海南大厦2',style: 'GPS',group: '产品中心考勤组'},
                            {id:2,city: '海口',sitename: '海南大厦3',style: 'GPS',group: '产品中心考勤组'},{id:3,city: '海口',sitename: '海南大厦4',style: 'GPS',group: '产品中心考勤组'}],total: 0},
            sitehead: [{key: 'city',name: '城市'},{key: 'sitename',name: '地点名称'},{key: 'style',name: '打卡设备'},{key: 'group',name: '应用考勤组'}],
            option:{isOption: true,edit:{isEdit:true,editName: '查看',editType:'primary'},del: {isDel: true,delName:'删除',delType:'danger'},choose:{isChoose: true,chooseName: '选择',chooseType:'success'}},
        }
    },
    components: {
       ClockSite 
    },
    methods: {
        delSite: function() {

        },
        querySite: function() {

        },
        chooseSite: function() {

        },
    }
}
</script>

<style lang="scss" scoped>
    .clocksite-container{
        margin: 0 20px;
    }
</style>
