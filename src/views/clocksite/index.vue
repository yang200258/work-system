<template>
    <div class="clocksite-container">
        <clock-site :searchInfo="searchInfo" :siteInfo="siteInfo" :sitehead="sitehead" :option="option" @delTable="delSite" @querySite="querySite" @chooseTable="chooseSite" @nextPage="nextPage"
            @createSite="createSite" @searchSite="searchSite" @editTable="editSite">
        </clock-site>
        <look-site :show="isShowSite" @close="closeSite" @cancel="closeSite" @confirm="goEditSite"></look-site>
    </div>
</template>
<script>
import ClockSite from '@/components/site/ClockSite'
import LookSite from '@/components/site/lookSite'
import {mapMutations} from 'vuex'
export default {
    data() {
        return {
            //搜索地点信息（包括地点名称和城市）
            searchInfo:{},
            //获取到的地点信息
            siteInfo: {content:[],recordCount: 0},
            //表头
            sitehead: [{key: 'city',name: '城市'},{key: 'name',name: '地点名称'},{key: 'clockType',name: '打卡设备'},{key: 'clockGroup',name: '应用考勤组'}],
            //操作配置
            option:[{name: '查看',type:1,event: 'chooseTable'},{name: '编辑',type:1,event: 'editTable'},{name:'删除',type:2,event: 'delTable'}],
            isShowSite: false,
            // ******************查看考勤地点*****************
            //查看考勤组时的设备
            // device: [],
            //查看考勤组时的应用考勤组
            // clockGroup: [],
        }
    },
    components: {
       ClockSite,LookSite
    },
    mounted() {
        this.querySite()
    },
    methods: {
        ...mapMutations({
            setSiteInfo: 'site/setSiteInfo'
        }),
        //获取考勤地点
        querySite: function(page=0,size=20,city='',name='') {
            this.$axios({
                url: `/es/offices/_search?page=${page}&size=${size}`,
                method: 'post',
                data: {city,name}
            }).then(res=> {
                console.log('获取考勤地点数据',res);
                if(res) {
                    let {content,recordCount} = res 
                    this.siteInfo = {content,recordCount}
                }
            }).catch(err=> {
                console.log(err)
            })
        },
        searchSite: function(page=1,size=20) {
            let {city,name} = this.searchInfo
            this.$axios({
                url: `/es/offices/_search?page=${page}&size=${size}`,
                method: 'post',
                data: {city,name}
            }).then(res=> {
                console.log('查询到的考勤地点',res)
                if(res) {
                    this.siteInfo = res
                }
            }).catch(err=> {
                console.log(err)
            })
        },
        //*******************查看考勤地点信息********************* 
        // 查看考勤地点
        chooseSite: function(scope) {
            this.setSiteInfo(scope.row)
            this.isShowSite = true 
        },
        //关闭查看弹框 + 关闭按钮关闭查看弹框
        closeSite: function() {
            this.isShowSite = false
            this.setSiteInfo({})
        },
        //******************删除考勤地点信息************************** */
        //删除考勤地点
        delSite: function(scope) {
            let officeId  = scope.row.id
            this.$axios({
                url:`/es/offices/delete?officeId=${officeId}`,
                method: 'post',
                // data: {officeId}
            }).then(res=> {
                if(res) {
                    this.$message.success(res)
                    this.querySite()
                }
            }).catch(err=> {
                console.log(err)
            })
        },
        //******************编辑考勤地点信息************************** */
        editSite: function(scope) {
            this.setSite(scope.row)
            this.$router.push({
                name: 'edit_clock_site',
                params: {
                    officeId: scope.row.id
                }    
            })
        },
        //通过查看考勤地点页面进入编辑
        goEditSite: function() {
            this.isShowSite = false
            this.$router.push({
                name: 'edit_clock_site',
                params: {
                    officeId: this.siteInfo.id
                }    
            })
        },
        //翻页
        nextPage: function(val) {
            this.querySite(val,20,this.searchInfo.city,this.searchInfo.name)
        },
        //创建考勤地点
        createSite: function() {
            this.setSiteInfo({})
            this.$router.push('create_clock_site')
        },
        //设置考勤地点
        setSite: function(obj) {
            let {id='',name,address,city,latitude,longitude} = obj
            this.setSiteInfo({id,name,address,city,latitude,longitude})
        },
    }
}
</script>

<style lang="scss" scoped>
    .clocksite-container{
        

    }
</style>
