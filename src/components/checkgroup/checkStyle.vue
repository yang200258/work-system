<template>
    <div class="tab-container">
        <div class="left-tab">
            <div class="tab-head">
                <span>打卡设备</span>
                <el-input size="mini" suffix-icon="el-icon-search" placeholder="输入名称搜索" v-model="searchKey" @keyup.enter.native="searchDevice"></el-input>
            </div>
            <div class="tab-content">
                <el-scrollbar style="height: 100%;"><equip-tag v-for="(item,i) in equips" :key="i" :site="item.site" :device="item.device" @add="addDevice"></equip-tag></el-scrollbar>
            </div>
        </div>
        <div class="right-tab">
            <span>已添加设备</span>
            <div class="tab-content">
                 <el-scrollbar style="height: 100%;"><equip-tag v-for="(item,i) in addEquips" :key="i" :site="item.site" :device="item.device" :type="1" @delete="deleteDevice"></equip-tag></el-scrollbar>
            </div>
        </div>
    </div>
</template>

<script>
import EquipTag from '@/components/checkgroup/equipTag'
export default {
    props: {
        equips: {type:Array},
        addEquips: {type:Array},
    },
    data() {
        return {
            searchKey: ''
        }
    },
    components: {
        EquipTag
    },
    methods: {
        //搜索设备
        searchDevice() {
            console.log('搜索设备');
        },
        // 添加设备
        addDevice: function(data) {
            this.addEquips.push(data)
            console.log(data);
        },
        // 删除设备
        deleteDevice: function(data) {
            console.log(data);
        }
    }
}
</script>


<style lang="scss" scoped>
    .tab-container {
        display: flex;
        height: 250px;
        justify-content: flex-start;
        .left-tab {
            display: flex;
            flex-direction: column;
            width: 400px;
            .tab-head {
                display: flex;
                align-items: center;
                span {
                    white-space: nowrap;
                    font-size: 14px;
                }
                .el-input {
                    margin-left: 20px;
                    max-width: 200px;
                }
            }
            .tab-content {
                margin-left: 80px;
                margin-top: 10px;
                overflow-y: auto;
                height: 250px;
                /deep/ .el-scrollbar__wrap {
                    overflow-x: hidden!important;
                }
            }
        }
        .right-tab {
            border-left: 1px solid black;
            margin-left: 80px;
            padding-left: 80px;
            display: flex;
            flex-direction: column;
            span {
                white-space: nowrap;
                font-size: 14px;
                margin-bottom: 20px;
            }
            .tab-content {
                overflow-y: auto;
                height: 250px;
                width: 317px;
                /deep/ .el-scrollbar__wrap {
                    overflow-x: hidden!important;
                }
            }
        }
    }
</style>