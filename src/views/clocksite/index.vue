<template>
    <div class="clocksite-container">
        <clock-site :searchInfo="searchInfo" :siteInfo="siteInfo" :sitehead="sitehead" :option="option" @delSite="delSite" @querySite="querySite" @chooseSite="chooseSite" @nextPage="nextPage"
        @createSite="createSite"></clock-site>
    </div>
</template>
<script>
import ClockSite from '@/components/site/ClockSite'
export default {
    data() {
        return {
            //搜索地点信息（包括地点名称和城市）
            searchInfo:{},
            siteInfo: {
                content:[],total: 0},
            sitehead: [{key: 'city',name: '城市'},{key: 'name',name: '地点名称'},{key: 'style',name: '打卡设备'},{key: 'group',name: '应用考勤组'}],
            option:[{name: '查看',type:'success',event: 'chooseTable'},{name:'删除',type:'danger',event: 'delTable'},{name: '编辑',type:'primary',event: 'editTable'}],
        }
    },
    components: {
       ClockSite 
    },
    mounted() {
        this.querySite()
    },
    methods: {
        //获取考勤地点
        querySite: function(page=0,size=20) {
            this.$axios({
                url: `/es/offices?page=${page}&size=${size}`,
                method: 'get',
            }).then(res=> {
                console.log('获取考勤地点数据',res);
                if(res) {
                    let {content,total} = res 
                    this.siteInfo = {content,total}
                }
            }).catch(err=> {
                this.$message.error(err)
            })
        },
        // 查看考勤地点
        chooseSite: function() {

        },
        //删除考勤地点
        delSite: function() {

        },
        //翻页
        nextPage: function(val) {
            this.querySite(val,20)
        },
        //创建考勤地点
        createSite: function() {
            this.$router.push('create_clock_site')
        }
    }
}
</script>

<style lang="scss" scoped>
    .clocksite-container{
        margin: 0 20px;
    }
</style>
