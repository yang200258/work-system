<template>
    <div class="looksite-container">
        <!-- 查看考勤地点弹窗 -->
        <my-dialog :title="'考勤地点信息'" :show="show" :width="'1200px'" @close="close" :isCancel="true" :cancelText="'关闭'" :isConfirm="true" :confirmText="'编辑'" @cancel="cancel" @confirm="confirm">
            <template slot="dialog-content">
                <div class="site">
                    <site-info :isShowReset="!show" :isDestroy="isDestroy" :mapHeight="300"></site-info>
                </div>
                <el-divider></el-divider>
                <div class="device">
                    <p>打卡设备</p>
                    <div class="device-content">
                        <div class="left-device">
                            <p>蓝牙设备</p>
                            <div class="tag">
                                <el-scrollbar style="height: 100%;">
                                     <div class="device-tag" v-for="(item,i) in device" :key="i" v-show="item.type === 0">{{item.name}}-{{item.type == 0 ? '蓝牙设备' : 'WIFI设备'}}</div>
                                </el-scrollbar>
                            </div>
                        </div>
                        <div class="right-device">
                            <p>WIFI设备</p>
                            <div class="tag">
                                <el-scrollbar style="height: 100%;">
                                    <div class="device-tag" v-for="(item,i) in device" :key="i" v-show="item.type === 1">{{item.name}}-{{item.type == 0 ? '蓝牙设备' : 'WIFI设备'}}</div>
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
import SiteInfo from '@/components/site/siteInfo'
import MyDialog from '@/components/common/MyDialog'
import {mapState} from 'vuex'
export default {
    props: {
        show: {type:Boolean,default:false},
        isShowReset: {type:Boolean},
        // device: {type: Array},
        // clockGroup: {type: Array},
        // isDestroy: {type:Boolean}
    },
    data() {
        return {
            clockGroup: [],
            device: [],
            isDestroy: false
        }
    },
    watch: {
        show: function(val) {
            if(val) this.chooseSite()
        }
    },
    components: {SiteInfo,MyDialog},
    computed: {
        ...mapState({
            siteInfo: state=>state.site.siteInfo
        })
    },
    methods: {
        async chooseSite() {
            this.isDestroy = true
            let officeId = this.siteInfo.id
            let [page,size] = [1,20]
            this.clockGroup = this.siteInfo.clockGroup ? this.siteInfo.clockGroup.map(item=> item.name) : []
            try {
                let res = await this.$axios({url: `/es/offices/getDevices?page=${page}&size=${size}&officeId=${officeId}`,method: 'post'})
                if(res) {
                    console.log('成功获取考勤地点下考勤设备',res)
                    this.device = res.content
                }
            } catch(err) {
                console.log(err)
            }
        },
        close: function() {
            this.$emit('close')
        },
        cancel: function() {
            this.$emit('cancel')
        },
        confirm: function() {
            this.$emit('confirm')
        }
    }
}
</script>


<style lang="scss" scoped>
    .looksite-container {
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
                        max-height: 200px;
                        overflow-y: auto;
                        /deep/ .el-scrollbar__wrap {
                            overflow-x: hidden!important;
                        }
                        .el-scrollbar {
                            .device-tag {
                                padding: 6px;
                                background-color: #409EFF;
                                color: #FFF;
                                border-radius: 4px;
                                margin-bottom: 16px;
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
