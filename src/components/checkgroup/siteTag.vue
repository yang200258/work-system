<template>
    <div class="sitetag-container">
        <div class="sitetag-header">
            <p>地点名称</p>
            <p>打卡方式</p>
        </div>
        <el-divider></el-divider>
        <div class="add-header" v-if="!siteData.length">
            <p>暂未添加考勤地点</p>
        </div>
        <div class="wrapper-site">
            <el-scrollbar style="height:100%">
                <div class="sitetag-wrapper" v-for="(item,index) in siteData" :key="index">
                    <div class="sitetag-content">
                        <div class="name">
                            <p @click.prevent="goSiteInfo" v-if="item.officeName">{{item.officeName}}</p>
                        </div>
                        <div class="clock-type" v-if="!isEdit">
                            <span v-if="item.clockType.includes(0)" style="margin-left:0;">蓝牙</span>
                            <span v-if="item.clockType.includes(1)">WIFI</span>
                            <span v-if="item.clockType.includes(4)">
                                GPS( <span v-if="item.gpsScope">{{item.gpsScope}}米)</span>
                            </span>
                        </div>
                        <div class="clock-box">
                            <div class="clock-style" v-show="isEdit" v-for="(t,i) in item.clockType" :key="i" >
                                <el-checkbox v-model="t.enable" @change="changeClockType($event,index,i)">{{val[t.type]}}</el-checkbox>
                                <el-input v-if="t.type == 4 && t.enable" v-model="item.scope" placeholder="打卡范围100米" size="mini" clearable @change="changScope($event,index)"></el-input>
                            </div>
                        </div>
                        <div class="option" v-if="isEdit">
                            <muti-btn :className="'el-icon-remove-outline'" :nameText="'删除'" style="color:#FB424E;font-weight:400" @click.native="delsite(item.officeId)"></muti-btn>
                        </div>
                    </div>
                    <el-divider></el-divider>
                </div>
            </el-scrollbar>
        </div>
        
    </div>
</template>

<script>
import MutiBtn from '@/components/common/MutiBtn'
import {mapMutations} from 'vuex'
export default {
    props: {
        siteData: {type: Array,default: () => []},
        isEdit: {type: Boolean,default: true}
    },
    data() {
        return {
            isShowGPS: false,
            val: ['蓝牙','WIFI','','','GPS'],
        }
    },
    components: {
        MutiBtn
    },
    methods: {
        ...mapMutations({
            setScope: 'group/setScope'
        }),
        delsite: function(id) {
          this.$emit('delsite',id)
        },
        goSiteInfo: function() {
            
        },
        changeClockType: function(val1,val2,val3) {
            console.log(val1,val2,val3)
            this.$emit('changeClockType',val1,val2,val3)
        },
        changScope: function(val,t) {
            this.setScope({val,t})
        }
    },

}
</script>


<style lang="scss" scoped>
    .sitetag-container {
        display: flex;
        flex-direction: column;
        color: #666;
        .sitetag-header {
            display: flex;
            align-items: center;
            padding-left: 15px;
            p {
                font-size: 12px;
                font-weight: 700;
                &:first-child {
                    width: 180px;
                }
            }
        }
        .el-divider {
            margin: 18px 0;
        }
        .add-header {
            font-size: 68px;
            color: #ddd;
            text-align: center;
            font-weight: 200;
        }
        .wrapper-site {
            // height: 400px;
            overflow-y: auto;
            /deep/ .el-scrollbar__wrap {
                overflow-x: hidden!important;
            }
            .sitetag-wrapper {
                .sitetag-content {
                    display: flex;
                    align-items: center;
                    padding-left: 15px;
                    .name {
                        width: 180px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        color: #409EFF;
                        font-size: 12px;
                        cursor: pointer;
                    }
                    .clock-type {
                        font-size: 12px;
                        white-space: nowrap;
                        >span {
                            margin-right: 20px;
                        }
                    }
                    .clock-box {
                        width: 400px;
                        height: 28px;
                        display: flex;
                        align-items: center;
                        &:nth-child(2) {
                            .el-checkbox {
                                margin-right: 4px;
                            }
                        }
                        .clock-style {
                            display: flex;
                            align-items: center;
                            margin-right: 10px;
                            /deep/ .el-checkbox {
                                .el-checkbox__label {
                                    font-size: 12px;
                                }
                            }
                            .el-input {
                                width: 150px;
                            }
                            
                        }
                    }
                    
                    .option {
                        display: flex;
                        align-items: center;
                        .el-icon-delete {
                            cursor: pointer;
                            color: #000;
                            font-size: 18px;
                            font-weight: 700;
                            &:hover {
                                color: #409EFF;
                            }
                        }
                    }
                }
                .el-divider {
                    margin: 10px 0;
                }
            }
        }
        
        
        
    }
</style>

