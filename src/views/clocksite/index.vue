<template>
    <div class="clocksite-container">
        <clock-site :searchInfo="searchInfo" :siteInfo="siteInfo" :sitehead="sitehead" :option="option" @delTable="delSite" @querySite="querySite" @chooseTable="chooseSite" @nextPage="nextPage"
            @createSite="createSite" @searchSite="searchSite" @editTable="editSite">
        </clock-site>
        <!-- 查看考勤地点弹窗 -->
        <my-dialog :title="'考勤地点信息'" :show="isShowSite" :width="'80%'" @close="closeSite" :isCancel="true" :cancelText="'关闭'" :isConfirm="true" :confirmText="'编辑'" @cancel="closeSite">
            <template slot="dialog-content">
                <div class="site">
                    <site-info :isShowReset="!isShowSite"></site-info>
                </div>
                <el-divider></el-divider>
                <div class="device">
                    <p>打卡设备</p>
                    <div class="device-content">
                        <div class="left-device">
                            <p>蓝牙设备</p>
                            <div class="tag">
                                 <div v-for="(item,i) in device" :key="i" v-show="item.type === 0">{{item.name}}-{{item.type == 0 ? '蓝牙设备' : 'WIFI设备'}}</div>
                            </div>
                        </div>
                        <div class="right-device">
                            <p>WIFI设备</p>
                            <div class="tag">
                                <div v-for="(item,i) in device" :key="i" v-show="item.type === 1">{{item.name}}-{{item.type == 0 ? '蓝牙设备' : 'WIFI设备'}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <el-divider></el-divider>
                <div class="clockgroup">
                    <p>已应用考勤组</p>
                    <p class="group-text" v-for="(item,i) in clockGroup" :key="i">{{item}}</p>
                </div>
            </template>
        </my-dialog>
    </div>
</template>
<script>
import ClockSite from '@/components/site/ClockSite'
import MyDialog from '@/components/common/MyDialog'
import SiteInfo from '@/components/site/siteInfo'
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
            option:[{name: '查看',type:'success',event: 'chooseTable'},{name:'删除',type:'danger',event: 'delTable'},{name: '编辑',type:'primary',event: 'editTable'}],
            isShowSite: false,
            // ******************查看考勤地点*****************
            //查看考勤组时的设备
            device: [],
            //查看考勤组时的应用考勤组
            clockGroup: [],
        }
    },
    components: {
       ClockSite,MyDialog,SiteInfo
    },
    mounted() {
        this.querySite()
    },
    methods: {
        ...mapMutations({
            setSiteInfo: 'site/setSiteInfo'
        }),
        //获取考勤地点
        querySite: function(page=0,size=20) {
            this.$axios({
                url: `/es/offices?page=${page}&size=${size}`,
                method: 'get',
            }).then(res=> {
                console.log('获取考勤地点数据',res);
                if(res) {
                    let {content,recordCount} = res 
                    this.siteInfo = {content,recordCount}
                }
            }).catch(err=> {
                this.$message.error(err)
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
            let officeId = scope.row.id
            let [page,size] = [1,20]
            this.setSite(scope.row)
            this.clockGroup = scope.row.clockGroup.map(item=> item.name)
            this.isShowSite = true
            this.$axios({
                url: `/es/offices/getDevice?page=${page}&size=${size}&officeId=${officeId}`,
                method: 'post',
            }).then(res=> {
                this.device = res.content
            }).catch(err=> {
                console.log(err);
            })
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
                url:`/es/offices/deleteOffice?officeId=${officeId}`,
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
            this.$router.push('edit_clock_site')
        },
        //翻页
        nextPage: function(val) {
            this.querySite(val,20)
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
        }

    }
}
</script>

<style lang="scss" scoped>
    .clocksite-container{
        margin: 0 20px;
        .site {

        }
        .device {
            margin-top: 40px;
            .device-content {
                margin-top: 20px;
                display: flex;
                .left-device,.right-device {
                    padding-left: 40px;
                    margin-top: 20px;
                    .tag {
                        margin-top: 10px;
                        padding-left: 60px;
                        div {
                            padding: 6px;
                            background-color: #409EFF;
                            color: #FFF;
                            border-radius: 4px;
                            margin: 4px 0;
                        }
                    }
                }
                .right-device {
                    margin-left: 40px;
                    border-left: 1px solid #000;
                }
            }
        }
        .clockgroup {
            .group-text {
                color:#409EFF;
                display: inline-block;
                margin-top: 20px;
                margin-left: 20px;
            }
        }

    }
</style>
