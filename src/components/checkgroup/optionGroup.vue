<template>
    <div class="create-group-container">
        <header class="group-header">
            <div class="name">
                <p> {{name}}</p>
                <el-popover placement="bottom" title="修改考勤组名称" width="400" trigger="click">
                    <el-input v-model="name" clearable></el-input>
                    <i class="el-icon-edit" slot="reference"></i>
                </el-popover>
            </div>
            <el-steps :active="active" finish-status="success">
                <el-step v-for="(item,i) in steps" :key="i" :title="item" :class="['step' + i, active == 3 ? 'isSet':'']"  @click.native="setSpecialDate(i)"></el-step>
            </el-steps>
        </header>
        <section class="create-content">
            <div class="first" v-if="active == 0">
                <!-- 打卡次数及时间设置 -->
                <div class="worktype">
                    <div class="worktype-header">
                        <span>打卡次数</span>
                        <span>工作时段设置</span>
                    </div>
                    <div class="worktype-content">
                        <clock-count v-for="(item,i) in countData" :key="i" :countData="item" :clockCount="clockOrder.clockCount" :class="clockOrder.clockCount == i ? 'isActive' : ''"></clock-count>
                    </div>
                </div>
                <!-- 工作日设置 -->
                <div class="day">
                    <div class="text">
                        <span>工作日设置</span>
                    </div>
                    <div class="workday">
                        <el-checkbox-group v-model="clockOrder.workDay" @change="handleCheckedCitiesChange">
                            <el-checkbox v-for="day in days" :label="day" :key="day">{{day}}</el-checkbox>
                        </el-checkbox-group>
                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                    </div>
                </div>
                <!-- 节假日设置 -->
                <div class="rest">
                    <div class="text">
                        <span>节假日设置</span>
                    </div>
                    <el-checkbox v-model="clockOrder.autorest" class="autorest">法定节假日自动排休</el-checkbox>
                    <span>（说明:勾选后自动在考勤日历应用国家假日办发布的节假日排序计划）</span>
                </div>
            </div>
            <div class="second" v-if="active === 1">
                <div class="header">
                    <div class="site-header">
                        <p>已选考勤地点</p>
                        <el-button @click.prevent="createSite">创建</el-button>
                    </div>
                    <div class="line"></div>
                    <div class="site-content">
                        <site-tag :siteData="siteData" @delsite="delsite"></site-tag>
                    </div>
                </div>
                <div class="content">
                    <div class="content-header">
                        <p>可选考勤地点</p>
                        <div class="right-header">
                            <el-input placeholder="请输入地点名称" v-model="siteName" prefix-icon="el-icon-search"></el-input>
                            <el-select v-model="city" placeholder="请选择城市" clearable>
                                <el-option v-for="item in cityOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="content-table">
                        <table-data :head="siteHead" :tableData="siteTableData" :option="option" :format="formatter" @editTable="editTable" @chooseTable="chooseTable" :isSelected="false"></table-data>
                    </div>
                </div>
            </div>
            <div class="third" v-if="active === 2">
                <div class="edit-wrapper">
                    <el-row>
                        <el-button size="mini" plain @click.prevent="isSelectPart = !isSelectPart">按部门添加</el-button> 
                        <el-input placeholder="输入名称搜索" suffix-icon="el-icon-search" size="mini"></el-input>
                        <select-tree v-if="isSelectPart" class="select-depart"></select-tree>
                    </el-row>
                    <el-row>
                        <table-data :head="head" :tableData="users" :isSelected="false" :option="userOption" :totalNumber="total" :pageSize="pageSize" :emptyText="emptyText">
                            <template #special="{scope: scope}">
                                <img v-if="scope.column.property == 'avater'" :src="scope.row.avater" style="max-width: 40px;border-radius: 50%;">
                            </template>
                            <template #option="{scope: scope}">
                                <img src="@/assets/images/del.png" class="delImg" @click.prevent="delUser(scope)">
                            </template>
                        </table-data>
                    </el-row>
                </div>
            </div>
            <div class="fourth" v-if="active === 3">
                <div class="left-cal">
                    <p>请在下方日历选择日期进行设置</p>
                    <el-calendar class="calendar">
                        <template #dateCell="{date, data}">
                            <div :class="data.isSelected ? 'isSelected':''" class="dateinfo" @click.prevent="setDate($event,date,data)">{{data.day.split('-')[2]}}</div>
                        </template>
                    </el-calendar>
                    <div class="set-special" v-show="isSetSpecial" ref="setSpecial">
                        <special-day class="special-wrapper" v-for="(item,i) in specialtime" :key="i" :setData="item" @submitSet="submitSet" :day="day"></special-day>
                    </div>
                </div>
                <div class="right-cal">
                    <div class="right-head">
                        <p>已设置特殊日期</p>
                        <hr>
                    </div>
                    <div class="right-content">
                        <table-data :head="specialHead" :tableData="specialDate" :page="page" :isSelected="false" :emptyText="emptyDateText">
                            <template #option="{scope}">
                                <p style="color:red;cursor:pointer;" @click.prevent="delTime(scope)">删除</p>
                            </template>
                        </table-data>
                    </div>
                </div>
            </div>
        </section>
        <footer class="create-footer" v-if="status === 'new'">
            <el-button @click="last" v-if="active == 1 || active == 2">上一步</el-button>
            <el-button @click="next" v-if="active < 2">下一步</el-button>
            <el-button @click="submit" type="primary" v-if="active == 2 || active == 3">提交 </el-button>
        </footer>
        <footer v-else>
            <el-button @click="saveEdit" type="primary">保存</el-button>
        </footer>
    </div>
</template>

<script>
import ClockCount from '@/components/checkgroup/clockCount'
import SiteTag from '@/components/checkgroup/siteTag'
import TableData from '@/components/common/TableData'
import SelectTree from '@/components/common/SelectTree'
import SpecialDay from '@/components/checkgroup/specialDay'
import utils from '@/utils/utils'
import {mapState,mapMutations,mapActions} from 'vuex'
const days = ['周一','周二','周三','周四','周五','周六','周日']
export default {
    props: {
        status: {type:String,default:'new'},
        name: {type: String,default:''}
    },
    data() {
        return {
            // name: '海南大厦26层-9点至17点30分',
            active: 0,
            steps: ['班次设置','考勤地点设置','考勤组成员编辑','特殊日期设置'],
            // -----------------工作日设置----------------
            // 设置打卡次数渲染数据
            countData: [{type:0,text:'两次',clockNum: [{text: '工作时段 ',time: ''},{text: '休息时段',time: ''}]},{type:1,text:'四次',clockNum: [{text: '工作时段1',time: ''},{text: '工作时段2',time: ''}]},
                            {type:2,text:'六次',clockNum: [{text: '工作时段1',time: ''},{text: '工作时段2',time: ''},{text: '工作时段3',time: ''}]}],
            clockCount: 0,          //打卡次数
            // 工作日全选设置
            isIndeterminate: true,
            // workday: [],
            checkAll: false,
            // autorest: false,
            // 渲染周一至周日
            days:days,
            // --------------------考勤地点设置--------------------------
            // 地点标签数据
            siteData:[{city: '北京',site: '雍和航星园',clockType: [0,1,2]},{city: '海口',site: '海南大厦',clockType: [0,1]}],
            //搜索地点标签
            siteName: '',
            city: '',
            cityOptions: [{value:'hainan',label:'海南'}],
            siteHead: [{key:'place',name: '所在位置'},{key:'siteName',name: '地点名称'},{key:'clockType',name: '支持打卡方式'}],
            siteTableData: [{place:'海南',siteName:'海南大厦',clockType:[0,1,2]}],
            option: [{name: '查看',type:'success',style: {},event: 'editTable'},{name: '选择',type:'primary',style:{},event: 'chooseTable'}],
            // ------------------------考勤组成员编辑---------------
            //是否按部门添加考勤组成员
            isSelectPart: false,
            head: [{key:'avater',name: '头像'},{key:'username',name: '用户账号'},{key:'name',name: '姓名'},{key:'mobile',name: '手机号'},{key:'email',name: '邮箱'},{key:'hisgroup',name: '历史考勤组'},
                    {key:'organ',name: '组织'}],
            userOption:[],
            //考勤组成员信息
            users: [],
            total: 0,
            pageSize: 0,
            emptyText: '还没有添加考勤组成员！',
            // ----------------------------特殊日期------------------------------
            emptyDateText: '还没有添加特殊日期！',
            specialHead: [{key:'date',name: '日期'},{key:'type',name: '设置类型'},{key:'time',name: '上班时段'},{key:'user',name: '设置人'}],
            // specialDate:[{date:'2018-9-9',type:'休息',time:'',user:'yqqqq'}],
            page:{isPagination:false},
            isWeekend: false,
            // 渲染指定日期数据源
            specialtime: [],
            // 特殊日期数据
            timeData: {date: '',time: [{worktime:['00:00','23:59'],quit: true,key: new Date(),here: true}]},
            isSetSpecial: false,
            clickDay: '',   //储存上次点击的日期判断是否需要显示isSetSpecial为false
            day: '',         //记录点击所选日期
        }
    },
    computed: {
        ...mapState({
            clockOrder: state => state.group.clockOrder,
            clockSite: state => state.group.clockSite,
            clockUserId: state => state.group.clockUserId,
            specialDate: state => state.group.specialDate,
        })
    },
    methods: {
        ...mapMutations({

        }),
        ...mapActions({
            
        }),
        //全选按钮工作日激活操作
        handleCheckAllChange(val) {
            this.clockOrder.workDay = val ? days : [];
            this.isIndeterminate = false;
        },
        //全部选择工作日激活操作
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.days.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.days.length;
        },
        //点击进行下一步
        next: function() {
            this.active++
        },
        //点击进行上一步
        last: function(){
            this.active--
        },
        // 创建考勤地点
        createSite: function() {
            
        },
        //删除已选择考勤地点
        delsite: function() {

        },
        //查看可选择考勤地点
        editTable: function() {

        },
        chooseTable: function() {
            
        },
        formatter: function(cellvalue,property) {
            if(property == 'clockType') { 
                return utils.filterClockType(cellvalue)
            } else {
                return cellvalue
            }
        },
        //删除考勤组成员
        delUser: function(scope) {
            console.log(scope);
            this.users = this._.dropWhile(this.users, (item)=> {return item.id === scope.row.id})
        },
        submit: function() {

        },
        setSpecialDate: function(i) {
            if(i == 3) {
                this.active = 3
            }
        },
        //点击某一日期后弹出设置时间的操作
        setDate: function($event,date,data){
            this.day = data.day
            if(data.day == this.clickDay) {
                this.isSetSpecial = !this.isSetSpecial
            } else {
                this.isSetSpecial = true
            }
            this.$refs.setSpecial.style.top = $event.clientY + 'px'
            this.$refs.setSpecial.style.left = $event.clientX + 20  + 'px'
            if(data.type == 'current-month') {
                let week = date.toString().split(' ')[0]
                if(week == 'Sat' || week == 'Sun') {
                    this.specialtime = [{buttonText:'设置为上班日',type:0},{buttonText:'调整上班时间',type:1}]
                } else {
                    this.specialtime = [{buttonText:'设置为休息日',type:2},{buttonText:'调整上班时间',type:1}]
                }
            }
            this.clickDay = data.day
        },
        //特殊日期保存
        submitSet: function(timeTagData) {
            console.log(timeTagData)
        },
        //删除考勤时间
        delTime: function(scope) {
            console.log(scope);
        },
        // *************************保存编辑考勤组*******************
        saveEdit: function() {

        },
    },
    components: {
        ClockCount,SiteTag,TableData,SelectTree,SpecialDay
    }
}
</script>


<style lang="scss" scoped>
$contentLeft: 20px;

    .create-group-container {
        .group-header {
            margin: 20px 60px;
            .name {
                height: 40px;
                display: flex;
                align-items: center;
                p {
                    white-space: nowrap;
                    font-weight: 400;
                    font-style: normal;
                    font-size: 20px;
                    color: #999999;
                    margin-right: 10px;
                }
                .el-icon-edit {
                    cursor: pointer;
                    color: #999999;
                    &:hover {
                        color: #1989FA;
                    }
                }
                
            }
            .el-steps {
                margin-top: 20px;
                .step2 {
                    /deep/ .el-step__head {
                        .el-step__line {
                            border-bottom: 2px dashed #999;
                            background-color: #fff;
                            top: 9px;
                        }
                    }
                }
                .step3 {
                    &.isSet {
                        /deep/ .el-step__main {
                            background-color: #ff0000;
                        }
                    }
                    /deep/ .el-step__main {
                        background:#ffc7c7;
                        border-radius: 2px;
                        position: absolute;
                        left: -100px;
                        cursor: pointer;
                        &:hover {
                            background-color: #ff0000;
                        }
                        .el-step__title {
                            color: #fff;
                        }
                    }
                }
                
            }
        }
        .create-content {
            margin:40px 80px;
            padding: 40px;
            .first {
                .worktype {
                    .worktype-header {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        grid-template-rows: 50px;
                        line-height: 50px;
                        padding-left: $contentLeft;
                        span {
                                font-weight: 650;
                                font-style: normal;
                                font-size: 14px;
                                color: rgb(51, 51, 51);
                        }
                    }
                    .worktype-content {
                        &:first-child {
                            color: red;
                        }
                        .clock-container {
                            padding-left: $contentLeft;
                        }
                        .isActive {
                            background-color: #e4e4e4;
                        }
                    }
                }
                .day {
                    margin-top: 40px;
                    padding-left: $contentLeft;
                    display: flex;
                    .text {
                        margin-right: 60px;
                        span {
                            font-weight: 650;
                            font-style: normal;
                            font-size: 14px;
                            color: #333333;
                        }
                    }
                    .workday {
                        display: flex;
                        .el-checkbox-group {
                            display: flex;
                        }
                        &>.el-checkbox {
                            margin-left: 20px;
                        }
                    }
                }
                .rest {
                    padding-left: $contentLeft;
                    display: flex;
                    align-items: center;
                    margin-top: 40px;
                    font-style: normal;
                    .text {
                        margin-right: 60px;
                        span {
                            font-weight: 650;
                            font-size: 14px;
                            color: #333333;
                        }
                    }
                    .autorest {
                        /deep/ .el-checkbox__label {
                            text-decoration: underline;
                        }
                    }
                    span {
                        font-size: 14px;
                        font-weight: 400;
                        color: #666666;
                        vertical-align : bottom;
                        line-height: 1;
                    }
                }
            }
            .second {
                .header {
                    .site-header {
                       display: flex;
                       align-items: center;
                       justify-content: space-between;
                    }
                    .line {
                        height: 1px;
                        background-color:#ddd;
                    }
                    .site-content {
                        margin-top: 10px;
                    }
                }
                .content {
                    .content-header {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        .right-header {
                            display: flex;
                            .el-input {
                                width: 200px;
                            }
                            .el-select {
                                margin-left: 20px;
                            }
                        }
                    }
                    .content-table {

                    }
                }
            }
            .third {
                // 编辑考勤组成员中表格距离顶部样式
                .edit-wrapper {
                    position: relative;
                    .el-row {
                        &:first-child {
                            display: flex;
                            align-items: center;
                            .el-input {
                                width: 200px;
                                margin-left: 40px;
                            }
                            .select-depart {
                                position: absolute ;
                                top: 40px; 
                                z-index:999
                            }
                        }
                        &:last-child {
                            margin-top: 20px;
                            /deep/ .el-table__empty-block {
                                margin: 100px 0;
                                span {
                                    color: #bcbcc9;
                                    font-size: 28px;
                                }
                            }
                        }
                        .delImg {
                            width: 30px;
                        }
                    }
                }
            }
            .fourth {
                display: flex;
                .left-cal {
                    >p {
                        white-space: nowrap;
                        font-weight: 650;
                        font-style: normal;
                        color: #666666;
                        font-size: 14px;
                    }
                    margin-right: 20px;
                    .calendar {
                        width: 600px;
                        height: 600px;
                        /deep/ .el-calendar-table {
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
                    .set-special {
                        position: absolute;
                        .special-wrapper {
                            &:last-child {
                                margin-top: 10px;
                            }
                        }
                    }
                    
                }
                .right-cal {
                    width: 40%;
                    min-width: 500px;
                    .right-head {
                        p {
                            white-space: nowrap;
                            font-weight: 650;
                            font-style: normal;
                            color: #666666;
                            font-size: 14px;
                            margin-bottom: 10px;
                        }
                    }
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
        }
        .create-footer {
            margin: 20px;
            display: flex;
            justify-content: center;
        }
    }
</style>
