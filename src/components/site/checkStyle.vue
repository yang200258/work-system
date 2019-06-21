<template>
    <div class="tab-container">
        <div class="left-tab">
            <div class="tab-head">
                <span>打卡设备</span>
                <el-input size="mini" placeholder="输入名称搜索" v-model="searchKey" @keyup.enter.native="searchDevice">
                    <i slot="suffix" class="el-input__icon el-icon-search" @click.prevent="searchDevice"></i>
                </el-input>
            </div>
            <div class="tab-content">
                <el-scrollbar style="height: 100%;"><equip-tag v-for="(item,i) in equips" :key="i" :device="item" @add="addDevice" v-show="type === item.type"></equip-tag></el-scrollbar>
            </div>
        </div>
        <div class="right-tab">
            <span>已添加设备</span>
            <div class="tab-content">
                 <el-scrollbar style="height: 100%;"><equip-tag v-for="(item,i) in addEquips" :key="i" :device="item" :type="1" @delete="delDevice" v-show="type === item.type"></equip-tag></el-scrollbar>
            </div>
        </div>
    </div>
</template>

<script>
import EquipTag from '@/components/site/equipTag'
import {mapState,mapMutations} from 'vuex'
export default {
    props: {
        type: {type:Number}
    },
    data() {
        return {
            searchKey: ''
        }
    },
    components: {
        EquipTag
    },
    computed: {
        ...mapState({
            equips: state => state.site.equips,     // 设备列表
            addEquips: state => state.site.addEquips,   //已添加设备
            // inialDeviceId: state => state.site.inialDeviceId    //记录初始状态时的已添加设备
        })
    },
    methods: {
        ...mapMutations({
            setEquips: 'site/setEquips',
            setAddEquips: 'site/setAddEquips',
            // setInialDeviceId: 'site/setInialDeviceId',
        }),
        //搜索设备
        searchDevice() {
            this.$emit('searchDevice',this.searchKey)
        },
        // 添加设备
        addDevice: function(device) {
            const list = []
            const addequip = this.addEquips
            addequip.push(device)
            this.setAddEquips(addequip)
            this.equips.forEach(item=> {
                if(item.id !== device.id) list.push(item)
            })
            this.setEquips(list)
        },
        // 删除设备
        delDevice: function(device) {
            const list = []
            let equip = this.equips
            equip.push(device)
            this.setEquips(equip)
            this._.remove(this.addEquips,item => item.id !==device.id )
            this.setAddEquips(list)
        }
    }
}
</script>


<style lang="scss" scoped>
    .tab-container {
        display: flex;
        height: 250px;
        justify-content: flex-start;
        font-size: 12px;
        .left-tab {
            display: flex;
            flex-direction: column;
            width: 400px;
            .tab-head {
                display: flex;
                align-items: center;
                span {
                    white-space: nowrap;
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
                margin: 8px 0 20px 0;
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