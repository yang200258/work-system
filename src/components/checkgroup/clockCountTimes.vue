<template>
    <!-- 打卡次数及时间设置 -->
    <div class="worktype">
        <div class="worktype-header">
            <span>打卡次数</span>
            <span>工作时段设置</span>
        </div>
        <el-divider></el-divider>
        <div class="worktype-content" v-for="(item,i) in countData" :key="i" :class="clockOrder.clockTimes == (i+1)*2 ? 'isActive' : ''">
            <el-radio :label="item.type" v-model="clockOrder.clockTimes" @change="changeClockCount">{{item.text}}</el-radio>
            <time-tag v-for="(t,i) in item.clockNum" :key="i" :data="t" @changTime="changeTime($event,i,t.type,t.text)" class="time-tag" ></time-tag>
        </div>
    </div>
</template>

<script>
import TimeTag from '@/components/common/TimeTag'
import {mapState,mapMutations} from 'vuex'
export default {
    props: {
        
    },
    data() {
        return {
            list: []
        }
    },
    mounted() {
        
    },
    components: {
        TimeTag
    },
    computed: {
        ...mapState({
            clockOrder: state => state.group.clockOrder,
            countData: state => state.group.countData,
        })
    },
    methods: {
        ...mapMutations({
            setClockCount: 'group/setClockCount',
            setClockTime: 'group/setClockTime',
            
        }),
        //更换次数时清除其余次数上的时间数据
        changeClockCount: function(val) {
            this.setClockTime([])
            this.setClockCount(val)
            this.list = []
            this.countData.forEach(item=> {
                if(item.type !== val) {
                    item.clockNum.forEach(t=> {
                        t.time = ''
                    })
                }
            })
        },
        changeTime: function(time,i,type,text) {
            if(time) {
                let list = this.list
                let obj = {}
                if(this.clockOrder.clockTimes === 2) {
                    obj = text.indexOf('工作时段') > -1 ? {startTime:time[0],endTime:time[1],type:0} : {startTime:time[0],endTime:time[1],type:1}
                } else {
                    obj = {startTime:time[0],endTime:time[1],type:0}
                }
                list.push(obj)
                this.setClockTime(list)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
$contentLeft: 15px;
.worktype {
    .worktype-header {
        padding-left: $contentLeft;
        span {
            font-weight: 700;
            font-style: normal;
            font-size: 12px;
            color: #666666;
            margin-right: 98px;
        }
    }
    .el-divider {
        margin:12px 0 10px 0;
    }
    .isActive {
        background-color: #e4e4e4;
    }
    .worktype-content {
        padding-left: $contentLeft;
        height: 54px;
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
}
</style>
