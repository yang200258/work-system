<template>
    <div class="time-container">
        <div class="time-wrapper"  v-for="(item,i) in time" :key="i">
            <p >时间段{{i+1}}</p>
            <el-checkbox style="margin-left: 10px;margin-right: 0" v-model="item.here" v-if="i !== 0 ">需要签到</el-checkbox>
            <el-time-picker is-range v-model="item.worktime" range-separator="-" start-placeholder="00:00" end-placeholder="00:00" prefix-icon="el-icon-time" 
            format="HH:mm" value-format="HH:mm"> </el-time-picker>
            <el-checkbox v-model="item.quit" v-if="time.length !== (i+1) && time.length >= 1">需要签退</el-checkbox>
            <el-button size="mini" v-if="time.length == (i+1) || time.length == 1" @click="addTime">添加</el-button>
            <el-button size="mini" type="danger" v-if="time.length == i+1 && time.length !== 1" @click.prevent="delTime">删除</el-button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        time: {type:Array,default:function() { return [{worktime:['00:00','23:59'],quit: false,key: new Date(),here: false}]}}
    },
    data() {
        return {
            
        }
    },
    methods: {
        addTime: function() {
            this.time.push({
                worktime:['00:00','23:59'],
                key: new Date(),
                quit: false,
                here: false 
            })
        },
        delTime: function() {
            this.time.pop()
        }
    }
}
</script>


<style lang="scss" scoped>
    .time-container {
        // margin-left: 40px;
        .time-wrapper {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            .el-date-editor {
                margin: 0 20px;
                width: 180px;
            }
            /deep/ .el-icon-time {
                // font-size: 24px;
                // position: absolute;
                // right: 1%;
                // color: #9DA5A7;
                // font-weight: 700;
            }
            &:first-child {
                .el-date-editor {
                    margin-left: 110px;
                }
            }
        }
    }
</style>

