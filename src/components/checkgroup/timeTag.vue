<template>
    <div class="time-container">
        <div class="time-wrapper"  v-for="(item,i) in time" :key="item.key">
            <p>时间段{{i+1}}</p>
            <el-time-picker is-range v-model="item.worktime" range-separator="-" start-placeholder="00:00" end-placeholder="00:00" prefix-icon="el-icon-time" 
            format="HH:mm"> </el-time-picker>
            <!-- <i class="el-icon-time"></i> -->
            <el-checkbox v-model="item.quit" v-if="time.length !== i && time.length !== 1">需要签退</el-checkbox>
            <el-button size="mini" v-if="time.length == (i+1) || time.length == 1" @click="addTime">添加</el-button>
            <el-button size="mini" type="danger" v-if="time.length == i+1 && time.length !== 1" @click.prevent="delTime">删除</el-button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        time: {type:Array,default:function() { return [{worktime:[],quit: false,key: new Date()}]}}
    },
    data() {
        return {
            
        }
    },
    methods: {
        addTime: function() {
            this.time.push({
                worktime:[],
                key: new Date(),
                quit: false
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
        margin-left: 40px;
        .time-wrapper {
            display: flex;
            align-items: center;
            margin-top: 10px;
            .el-date-editor {
                margin: 0 20px;
                width: 160px;
            }
            /deep/ .el-icon-time {
                font-size: 24px;
                
            }
        }
    }
</style>

