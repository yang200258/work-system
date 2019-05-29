<template>
    <div class="sitetag-container">
        <div class="sitetag-header">
            <p>地点名称</p>
            <p>打卡方式</p>
        </div>
        <div class="sitetag-content" v-for="(item,i) in siteData" :key="i">
            <div class="name">
                <a @click.prevent="goSiteInfo" v-if="item.city || item.site">{{item.city}}-{{item.site}}</a>
            </div>
            <div class="clock-type" v-if="!isEdit">
                <span v-if="item.clockType.includes(0)" style="margin-left:0;">蓝牙</span>
                <span v-if="item.clockType.includes(1)">WIFI</span>
                <span v-if="item.clockType.includes(2)">
                    GPS <span v-if="item.gpsDistrict">{{item.gpsDistrict}}米</span>
                </span>
            </div>
            <div class="clock-style" v-if="isEdit">
                <el-checkbox-group v-model="item.clockType" @change="changeClockType">
                    <el-checkbox v-for="type in item.clockType" :key="type" :label="type">{{val[i]}}</el-checkbox>
                </el-checkbox-group>
                <el-input v-if="item.clockType.includes(2)" v-model="item.gpsDistrict" placeholder="打卡范围100米"></el-input>
            </div>
            <div class="option" v-if="isEdit">
                <div class="el-icon-delete"  @click="delsite(item.id)"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        siteData: {type: Array},
        isEdit: {type: Boolean,default: true}
    },
    data() {
        return {
            isShowGPS: false,
            val: ['蓝牙','WIFI','GPS'],
        }
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
        max-width: 800px;
        .sitetag-header {
            // display: grid;
            // grid-template-columns: 1fr 3fr 40px;
            display: flex;
            flex-wrap: nowrap;
            p {
                color: #606266;
                &:first-child {
                    width: 200px;
                }
            }
        }
        .sitetag-content {
            display: grid;
            grid-template-columns: 200px 1fr 40px;
            height: 50px;
            border-bottom: 1px dashed #ccc;
            line-height: 60px;
            .name {
                width: 200px;
                a {
                    color: #409EFF;
                    font-size: 14px;
                    cursor: pointer;
                }
            }
            .clock-type {
                font-size: 14px;
                >span {
                    margin-left: 20px;
                }
            }
            .clock-style {
                display: flex;
                min-width: 400px;
                .el-input {
                    width: 150px;
                    margin-left: 20px;
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
        
    }
</style>

