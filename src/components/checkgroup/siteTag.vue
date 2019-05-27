<template>
    <div class="sitetag-container">
        <div class="sitetag-header">
            <p>地点名称</p>
            <p>打卡方式</p>
        </div>
        <div class="sitetag-content" v-for="(item,i) in siteData" :key="i">
            <div class="name">
                <a @click.prevent="goSiteInfo">{{item.city}}-{{item.site}}</a>
            </div>
            <div class="clock-type" v-if="item.id">
                <span v-if="item.clockType.includes(0)" style="margin-left:0;">蓝牙</span>
                <span v-if="item.clockType.includes(1)">WIFI</span>
                <span v-if="item.clockType.includes(2)">
                    GPS <span v-if="item.gpsDistrict">{{item.gpsDistrict}}米</span>
                </span>
            </div>
            <div class="clock-style" v-if="!item.id">
                <el-checkbox-group v-model="item.clockType">
                    <el-checkbox :label="0">蓝牙</el-checkbox>
                    <el-checkbox :label="1">WIFI</el-checkbox>
                    <el-checkbox :label="2">GPS</el-checkbox>
                </el-checkbox-group>
                <el-input v-if="item.clockType.includes(2)" v-model="item.gpsDistrict" placeholder="打卡范围100米"></el-input>
            </div>
            <div class="option" v-if="!item.id">
                <img src="../../assets/images/del.png" alt="" @click="delsite">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        siteData: {type: Array}
    },
    data() {
        return {
            isShowGPS: false
        }
    },
    methods: {
        delsite: function() {
          this.$emit('delsite')
        },
        goSiteInfo: function() {
            
        }
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
                img {
                    display: block;
                    width:30px;
                    height: 30px;
                }
            }
        }
        
    }
</style>

