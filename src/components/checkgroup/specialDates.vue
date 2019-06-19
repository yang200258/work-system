<template>
    <div class="special-container">
        <div class="left-cal">
            <div class="head">
                <p>请在下方日历选择日期进行设置</p>
                <el-divider></el-divider>
            </div>
            <el-calendar class="calendar">
                <template #dateCell="{date, data}">
                    <div :class="data.isSelected ? 'isSelected':''" class="dateinfo" @click.prevent="setDate($event,date,data)">{{data.day.split('-')[2]}}</div>
                </template>
            </el-calendar>
            <div class="set-special" v-show="isSetSpecial" ref="setSpecial">
                <special-day class="special-wrapper" v-for="(item,i) in specialtime" :key="i" :setData="item" @submitSet="submitSet" :day="day" @cancelSet="cancelSet"></special-day>
            </div>
        </div>
        <div class="right-cal">
            <div class="head">
                <p>已设置特殊日期</p>
                <el-divider></el-divider>
            </div>
            <div class="right-content">
                <table-data :head="specialHead" :option="option" :tableData="specialDate" :page="page" :isSelected="false" :emptyText="emptyDateText" :isSearch="false" :format="formatDate" 
                :height="500" @delTable="delTime" :tableRowClassName="selectedDates">
                </table-data>
            </div>
        </div>
    </div>
</template>

<script>
import SpecialDay from '@/components/checkgroup/specialDay'
import TableData from '@/components/common/TableData'
import utils from '@/utils/utils'
import {mapState,mapMutations} from 'vuex'
export default {
    data() {
        return {
            // 渲染指定日期数据源
            specialtime: [],
            day: '',         //记录点击所选日期
            emptyDateText: '还没有添加特殊日期！',
            specialHead: [{key:'date',name: '日期'},{key:'type',name: '设置类型'},{key:'scheduleItems',name: '上班时段'},{key:'reason',name:'原因'},{key:'operator',name: '设置人'}],
            page:{isPagination:false},
            // 特殊日期数据
            isSetSpecial: false,
            clickDay: '',   //储存上次点击的日期判断是否需要显示isSetSpecial为false
            status: {type:String,default: ''},
            option: [{name: '删除',event: 'delTable',type:2}],
        }
    },
    components:{
        SpecialDay,
        TableData
    },
    computed: {
        ...mapState({
            specialDate: state => state.group.specialDate,
            clockOrder: state => state.group.clockOrder,
            initialDate: state => state.group.initialDate,
            countData: state => state.group.countData,
        }),
    },
    methods: {
        ...mapMutations({
            // setClockTime: 'group/setClockTime',
            setSpecialDates: 'group/setSpecialDates',
            setClockOrder: 'group/setClockOrder',
            clearCountData: 'group/clearCountData',
        }),
        //点击某一日期后弹出设置时间的操作
        setDate: function($event,date,data){
            this.day = data.day
            if(data.day == this.clickDay) {
                this.isSetSpecial = !this.isSetSpecial
            } else {
                this.isSetSpecial = true
            }
            let userAgent = navigator.userAgent
            if(userAgent.indexOf('Trident') > -1 && this.status !== 'muti') {
                this.$refs.setSpecial.style.top = ($event.pageY - $event.offsetY) + 'px'
                this.$refs.setSpecial.style.left = ($event.pageX - $event.offsetX + $event.target.clientWidth) + 'px' 
            } else {
                this.$refs.setSpecial.style.top = ($event.layerY - $event.offsetY) + 'px'
                this.$refs.setSpecial.style.left = ($event.layerX - $event.offsetX + $event.target.clientWidth) + 'px'
            }
            if(data.type == 'current-month') {
                let week = date.toString().split(' ')[0]
                if(week == 'Sat' || week == 'Sun') {
                    this.specialtime = [{buttonText:'设置为上班日',type:1},{buttonText:'调整上班时间',type:0}]
                } else {
                    this.specialtime = [{buttonText:'设置为休息日',type:2},{buttonText:'调整上班时间',type:0}]
                }
            }
            this.clickDay = data.day
        },
        //提交设置
        submitSet: function(reason,type) {
            let dates = this.specialDate
            if(dates.map(item=>item.date).indexOf(this.day) !== -1) {
                this.$message.error('不可重复添加日期！')
                this.isSetSpecial = false
                return 
            } 
            let scheduleItem = utils.dealTimeData(this.countData,this.clockOrder.clockTimes)
            let data = type === 0 ? {date:this.day,reason,type,scheduleItem:scheduleItem,clockTimes:this.clockOrder.clockTimes,specialDateId: 0}  
                                        : {specialDateId: 0,date:this.day,reason,type,scheduleItem:[],clockTimes:0}
            dates.push(data)
            this.setSpecialDates(dates)
            this.isSetSpecial = false
        },
        //点击取消隐藏设置框
        cancelSet: function() {
            this.isSetSpecial = false
        },
        //过滤特殊日期类型
        formatDate: function(cellValue,property) {
            let val = ['调整时间','上班','休息']
            switch(property) {
                case 'type':
                    return val[cellValue]
                    // break
                case 'scheduleItems':
                    var list = []
                    if(cellValue) {
                        cellValue.forEach(item=> {
                            list.push(!item.type ? `工作时段：${item.startTime}-${item.endTime}` : `休息时段：${item.startTime}-${item.endTime}`)
                        })
                    }
                    return cellValue ? list.join('<br>') : '无'
                    // break
                default:
                    return cellValue ? cellValue : '无'
            }
        },
        selectedDates: function({row}) {
            if(this.initialDate.map(item=>item.date).indexOf(row.date) > -1) return 'success-row'
        },
        //删除考勤时间
        delTime: function(scope) {
            let data = this._.remove(this.specialDate,item => item.date !== scope.row.date )
            this.setSpecialDates(data)
        },
    }
}
</script>

<style lang="scss" scoped>
.special-container {
    display: flex;
    padding-left: 15px;
    .left-cal,.right-cal {
        .head {
            p {
                white-space: nowrap;
                font-weight: 700;
                color: #666666;
                font-size: 12px;
            }
            .el-divider {
                margin: 12px 0 20px 0;
            }
        }
    }
    .left-cal {
        margin-right: 20px;
        .calendar {
            min-width: 400px;
            width: 500px;
            /deep/ .el-calendar__body {
                .el-calendar-table {
                .el-calendar-table__row {
                    .el-calendar-day {
                        padding: 0;
                        .dateinfo {
                            width: 100%;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                    }
                    .is-selected {
                        color: #1989FA;
                    }
                    
                }
            }
            }
            
        }
        .set-special {
            position: absolute;
            background-color: #fff;
            z-index: 99;
            .special-wrapper {
                &:last-child {
                    margin-top: 10px;
                }
            }
        }
    }
    .right-cal {
        min-width: 500px;
        .right-content {
            /deep/ .el-table__empty-block {
                    margin: 100px 0;
                    span {
                        color: #bcbcc9;
                        font-size: 28px;
                    }
                }
        }
    }
}
</style>

