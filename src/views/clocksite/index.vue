<template>
    <div class="clocksite-container">
        <clock-site :searchInfo="searchInfo" :siteInfo="siteInfo" :sitehead="sitehead" :option="option" @delTable="delSite" @querySite="querySite" @chooseTable="chooseSite" @nextPage="nextPage"
            @createSite="createSite" @searchSite="searchSite" @editTable="editSite">
        </clock-site>
        <!-- 查看考勤地点弹窗 -->
        <my-dialog :title="'考勤地点信息'" :show="isShowSite" :width="'80%'" @close="closeSite" :isCancel="true" :cancelText="'关闭'" :isConfirm="true" :confirmText="'编辑'" @cancel="closeSite" @confirm="goEditSite">
            <template slot="dialog-content">
                <div class="site">
                    <site-info :isShowReset="!isShowSite" :isDestroy="isDestroy"></site-info>
                </div>
                <el-divider></el-divider>
                <div class="device">
                    <p>打卡设备</p>
                    <div class="device-content">
                        <div class="left-device">
                            <p>蓝牙设备</p>
                            <div class="tag">
                                <el-scrollbar style="height: 100%;">
                                     <div v-for="(item,i) in device" :key="i" v-show="item.type === 0">{{item.name}}-{{item.type == 0 ? '蓝牙设备' : 'WIFI设备'}}</div>
                                </el-scrollbar>
                            </div>
                        </div>
                        <div class="right-device">
                            <p>WIFI设备</p>
                            <div class="tag">
                                <el-scrollbar style="height: 100%;">
                                    <div v-for="(item,i) in device" :key="i" v-show="item.type === 1">{{item.name}}-{{item.type == 0 ? '蓝牙设备' : 'WIFI设备'}}</div>
                                </el-scrollbar>
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
            option:[{name: '查看',type:1,event: 'chooseTable'},{name: '编辑',type:1,event: 'editTable'},{name:'删除',type:2,event: 'delTable'}],
            isShowSite: false,
            isDestroy: false,
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
            this.isDestroy = false
            this.$axios({
                url: `/es/offices/getDevice?page=${page}&size=${size}&officeId=${officeId}`,
                method: 'post',
            }).then(res=> {
                if(res) {
                    this.device = res.content
                }
            }).catch(err=> {
                console.log(err);
            })
        },
        //关闭查看弹框 + 关闭按钮关闭查看弹框
        closeSite: function() {
            this.isShowSite = false
            this.isDestroy = true
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
        },
    }
}
</script>

<style lang="scss" scoped>
    .clocksite-container{
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
                        height: 200px;
                        overflow-y: auto;
                        /deep/ .el-scrollbar__wrap {
                            overflow-x: hidden!important;
                        }
                        .el-scrollbar {
                            div {
                                padding: 6px;
                                background-color: #409EFF;
                                color: #FFF;
                                border-radius: 4px;
                                margin: 10px 0;
                                width: 200px;
                                text-align: center;
                                overflow: hidden;
                            }
                        }
                    }
                }
                .right-device {
                    margin-left: 40px;
                    border-left: 1px solid #000;
                    .tag {
                        overflow-y: auto;
                        /deep/ .el-scrollbar__wrap {
                            overflow-x: hidden!important;
                        }
                    }
                    
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
