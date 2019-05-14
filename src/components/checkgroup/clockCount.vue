<template>
    <div class="clock-container">
        <el-radio-group v-model="countData.type">
            <el-radio :label="i" v-for="(item,i) in clockNumItem" :key="i">{{item}}</el-radio>
        </el-radio-group>
        <div class="clock-num">
            <time-tag v-for="(item,i) in clockNum[countData.type]" :key="i" :data="item" @changTime="changeTime"></time-tag>
        </div>
    </div>
</template>


<script>
import TimeTag from '@/components/common/TimeTag'
export default {
    props: {
        countData: {type: Object,default: function() {return {type: 0,time: []}}},
        // time: {type:Array}
        // clockNum: {type: Object}
    },
    data() {
        return {
            //渲染打卡次数
            clockNumItem: ['两次','四次','六次'],
            //打卡次数时间选项
            clockNum: {0: [{text: '工作时段',time: ''},{text: '休息时段',time: ''}],
                        1: [{text: '工作时段1',time: ''},{text: '工作时段2',time: ''}],
                        2: [{text: '工作时段1',time: ''},{text: '工作时段2',time: ''},{text: '工作时段3',time: ''}]},
        }
    },
    components: {
        TimeTag
    },
    watch: {
        clockNum: function() {
            this.countData.time = this.clockNum[this.countData.type]
        }
    },
    methods: {
        changeTime: function(data) {
            console.log(data);
        }
    }
}
</script>


<style lang="scss" scoped>
    .clock-container {
        // overflow: hidden;
        // .el-radio-group {
        //     display: flex;
        // }
        .clock-num {
            display: flex;
            margin: 30px 0;
            align-items: center;
            // display: grid;
            // grid-template-columns: 1fr 1fr 1fr;
        }
    }
</style>
