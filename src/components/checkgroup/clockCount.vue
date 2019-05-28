<template>
    <div class="clock-container">
        <el-radio :label="countData.type" v-model="clockOrder.clockCount">{{countData.text}}</el-radio>
        <time-tag v-for="(item,i) in countData.clockNum" :key="i" :data="item" @changTime="changeTime"></time-tag>
    </div>
</template>


<script>
import TimeTag from '@/components/common/TimeTag'
import {mapState} from 'vuex'
export default {
    props: {
        countData: {type: Object},
        // clockCount: {type:Number,default: 0}
    },
    data() {
        return {
            // workType: 0
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
        changeTime: function(data) {
            console.log(data);
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
