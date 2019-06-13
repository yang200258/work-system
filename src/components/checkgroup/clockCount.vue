<template>
    <div class="clock-container">
        <el-radio :label="countData.type" v-model="clockOrder.clockTimes" @change="changeClockCount">{{countData.text}}</el-radio>
        <time-tag v-for="(item,i) in countData.clockNum" :key="i" :data="item" @changTime="changeTime" class="time-tag"></time-tag>
    </div>
</template>


<script>
import TimeTag from '@/components/common/TimeTag'
import {mapState,mapMutations} from 'vuex'
export default {
    props: {
        countData: {type: Object},
    },
    data() {
        return {
            timeList: [],
        }
    },
    computed: {
        ...mapState({
            clockOrder: state => state.group.clockOrder,
        })
    },
    components: {
        TimeTag
    },
    watch: {
        
    },
    methods: {
        ...mapMutations({
            setClockCount: 'group/setClockCount',
            setClockTime: 'group/setClockTime',
            
        }),
        changeTime: function(data) {
            this.timeList.push(data.time)
            this.setClockTime(this.timeList)
        },
        changeClockCount: function(val) {
            this.setClockTime([])
            this.setClockCount(val)
        }
    }
}
</script>


<style lang="scss" scoped>
    .clock-container {
        display: flex;
        align-items: center;
        .el-radio {
            margin-right: 98px;
            height: 54px;
            line-height: 54px;
            /deep/ .el-radio__label {
                font-size: 12px;
            }
        }
        .time-tag {
            margin-right: 36px;
        }
    }
</style>
