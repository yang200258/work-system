<template>
    <div class="check-container"> 
        <header>
            <p>选择地址</p>
            <map-gao class="gao-map" @add="addSite"></map-gao>
        </header>
        <section>
            <div class="line"></div>
            <div class="tab-content">
                <span>添加打卡方式</span>
                <el-tabs type="border-card" class="tab" @tab-click="tabclick" >
                    <el-tab-pane :label="item" v-for="item in tabItem" :key="item">
                        <check-style :equips="equips" :addEquips="addEquips" v-if="item != 'GPS'"></check-style>
                        <div class="gps-style" v-else>
                            <div class="left-gps">
                                <el-checkbox v-model="isGpsCheck">允许GPS打卡</el-checkbox>
                            </div>
                            <div class="right-gps">
                                <span>GPS打卡范围</span>
                                <div class="gps-input">
                                    <el-input type="text" size="small" v-model="gpsDistrict" placeholder="请输入允许打卡距离" clearable></el-input>
                                    <span>米</span> 
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </section>
        <footer>
            <el-button type="primary" size="medium" @click.prevent="submitCreate">提交</el-button>
        </footer>
    </div>
</template>

<script>
import MapGao from '@/components/common/MapGao'
import CheckStyle from '@/components/checkgroup/checkStyle'
export default {
    data() {
        return {
            tabItem: ['蓝牙','WIFI','GPS'],
            equips: [],
            addEquips: [],
            isGpsCheck: false,
            gpsDistrict: '',
            
        }
    },
    mounted() {
        //获取默认蓝牙设备
        this.equips = [{site: '海南大厦26层',device: '蓝牙设备'},{site: '海南大厦26层',device: '蓝牙设备'}]
        this.addEquips = [{site: '海南大厦26层',device: '蓝牙设备'},{site: '海南大厦26层',device: '蓝牙设备'}]
    },
    methods: {
        addSite: function(poi) {
            console.log(poi);
        },
        //切换标签时使用
        tabclick: function(tab) {
            if(tab.index === '0') {
                this.equips = [{site: '海南大厦26层',device: '蓝牙设备'},{site: '海南大厦26层',device: '蓝牙设备'}]
                this.addEquips = [{site: '海南大厦26层',device: '蓝牙设备'},{site: '海南大厦26层',device: '蓝牙设备'}]
            } 
            if(tab.index === '1') {
                this.equips = [{site: '海南大厦26层',device: 'WIFI设备'},{site: '海南大厦26层',device: 'WIFI设备'}]
                this.addEquips = [{site: '海南大厦26层',device: '蓝牙设备'},{site: '海南大厦26层',device: '蓝牙设备'}]
            } 
            // if(tab.index === '3') return
        },
        submitCreate: function() {
            this.$router.go(-1)
        }
    },
    components: {
        MapGao,CheckStyle
    }
}
</script>

<style lang="scss" scoped>
    .check-container {
        padding-left: 40px;
        display: flex;
        flex-direction: column;
        header {
            width:70%;
            height: 500px;
            p {
                font-size: 20px;
                color: #ccc;
            }
            .gao-map {
                margin-top: 20px;
                width: 100%;
                height: 100%;
            }
        }
        section {
            width: 70%;
            .line {
                height: 2px;
                background-color: #ddd;
            }
            .tab-content {
                margin-top: 40px;
                display: flex;
                span {
                    white-space: nowrap;
                }
                .tab {
                    margin-left: 40px;
                    width: 100%;
                    min-width: 800px;
                    min-height: 300px;
                    .gps-style {
                        height: 210px;
                        display: flex;
                        padding-top: 40px;
                        .left-gps {
                            margin: 0 80px;
                        }
                        .right-gps {
                            display: flex;
                            flex-direction: column;
                            margin-left: 60px;
                            .gps-input {
                                display: flex;
                                align-items: center;
                                margin-top: 50px;
                                .el-input {
                                    margin-right: 10px;
                                }
                                span {
                                    font-size: 12px;
                                }
                            }
                            span {
                                font-size: 14px;
                            }
                        }
                    }
                }
            }
        }
        footer {
            margin: 40px 0;
            width: 70%;
            text-align: center;
            .el-button {
                width: 90px;
            }
        }
    }
</style>
