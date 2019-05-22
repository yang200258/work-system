<template>
    <div class="sitetag-container">
        <div class="sitetag-content">
            <div class="name">
                <a @click.prevent="goSiteInfo">{{siteData.city}}-{{siteData.site}}</a>
            </div>
            <div class="clock-style">
                <el-checkbox-group v-model="siteData.clockStyle">
                    <el-checkbox :label="0">蓝牙</el-checkbox>
                    <el-checkbox :label="1">WIFI</el-checkbox>
                    <el-checkbox :label="2">GPS</el-checkbox>
                </el-checkbox-group>
                <el-input v-if="this.siteData.clockStyle.includes(2)" v-model="siteData.gpsDistrict" placeholder="打卡范围100米"></el-input>
            </div>
            <div class="option">
                <img src="../../assets/images/del.png" alt="" @click="delsite">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        siteData: {type: Object}
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
        width: 70%;
        min-width: 650px;
        .sitetag-content {
            display: grid;
            grid-template-columns: 1fr 2fr 40px;
            height: 50px;
            border-bottom: 1px dashed #ccc;
            line-height: 60px;
            .name {
                min-width: 200px;
                a {
                    color: #409EFF;
                    font-family: 'PingFangSC-Regular', 'PingFang SC';
                    font-size: 13px;
                    cursor: pointer;
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

