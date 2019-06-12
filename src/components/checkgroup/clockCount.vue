<template>
    <div class="clock-container">
        <el-radio :label="countData.type" v-model="clockOrder.clockTimes" @change="changeClockCount">{{countData.text}}</el-radio>
        <time-tag v-for="(item,i) in countData.clockNum" :key="i" :data="item" @changTime="changeTime"></time-tag>
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
        display:grid;
        grid-template-columns: 1fr 3fr 3fr 3fr;
        grid-template-rows: 80px;
        line-height: 80px;
        .el-radio {
            display: flex;
            align-items: center;
        }
    }
</style>
