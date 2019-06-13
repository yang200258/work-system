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
        <div class="sitetag-wrapper" v-for="(item,i) in siteData" :key="i">
            <div class="sitetag-content">
                <div class="name">
                    <a @click.prevent="goSiteInfo" v-if="item.city || item.OfficeName">{{item.city}}-{{item.OfficeName}}</a>
                </div>
                <div class="clock-type" v-if="!isEdit">
                    <span v-if="item.clockType.includes(0)" style="margin-left:0;">蓝牙</span>
                    <span v-if="item.clockType.includes(1)">WIFI</span>
                    <span v-if="item.clockType.includes(2)">
                        GPS <span v-if="item.scope">{{item.scope}}米</span>
                    </span>
                </div>
                <div class="clock-box">
                    <div class="clock-style" v-show="isEdit" v-for="(t,i) in item.clockType" :key="i" >
                        <!-- <el-checkbox-group v-model="item.clockType" @change="changeClockType">
                            <el-checkbox v-for="type in item.clockType" :key="type" :label="type">{{val[i]}}</el-checkbox>
                        </el-checkbox-group> -->
                        <el-checkbox v-model="t.enable">{{val[t.type]}}</el-checkbox>
                        <el-input v-if="t.type == 4 && t.enable" v-model="item.scope" placeholder="打卡范围100米" size="mini" clearable></el-input>
                    </div>
                </div>
                <div class="option" v-if="isEdit">
                    <muti-btn :className="'el-icon-remove-outline'" :nameText="'删除'" style="color:#FB424E;font-weight:400" @click.native="delsite(item.id)"></muti-btn>
                </div>
            </div>
            <el-divider></el-divider>
        </div>
    </div>
</template>

<script>
import MutiBtn from '@/components/common/MutiBtn'
export default {
    props: {
        siteData: {type: Array},
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
        delsite: function(id) {
          this.$emit('delsite',id)
        },
        goSiteInfo: function() {
            
        },
        changeClockType: function(val) {
            console.log(val)
            return
        },
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
        .sitetag-wrapper {
            .sitetag-content {
                display: flex;
                align-items: center;
                padding-left: 15px;
                .name {
                    width: 180px;
                    
                    a {
                        color: #409EFF;
                        font-size: 12px;
                        cursor: pointer;
                    }
                }
                .clock-type {
                    font-size: 12px;
                    >span {
                        margin-left: 20px;
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
                            // display: grid;
                            // grid-template-columns: 60px 60px 60px;
                            // .el-checkbox {
                                // margin-right: 0;
                                .el-checkbox__label {
                                    font-size: 12px;
                                }
                            // }
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
</style>

