<template>
    <div class="create-group-container">
        <header class="group-header">
            <div class="name">
                <p> {{name}}</p>
                <el-popover placement="bottom" title="修改考勤组名称" width="400" trigger="click" v-model="isShowEditName">
                    <el-input v-model="groupname" clearable @keyup.enter.native="changeName"></el-input>
                    <i class="el-icon-edit" slot="reference"></i>
                </el-popover>
            </div>
            <el-steps :active="active" :finish-status="status === 'new' ? 'success' : ''">
                <el-step v-for="(item,i) in steps" :key="i" :title="item" :class="['step' + i, active === i ? 'isSet':'',status === 'edit' ? 'step-edit' : '']"  @click.native="goSpecialDate(i)"></el-step>
            </el-steps>
        </header>
        <section class="create-content">
            <div class="first" v-if="active == 0">
                <clock-count-times ></clock-count-times>
                <el-divider></el-divider>
                <!-- 每天打卡时间点 -->
                <div class="clock-start-time">
                    <span>每天开始打卡时间点</span>
                    <el-time-picker v-model="clockOrder.clockStartTime" placeholder="请选择时间" size="mini" format="HH:mm" value-format="HH:mm" @change="changeTime"></el-time-picker>
                </div>
                <el-divider></el-divider>
                <!-- 工作日设置 -->
                <div class="day">
                    <div class="text">
                        <span>工作日设置</span>
                    </div>
                    <div class="workday">
                        <el-checkbox-group v-model="clockOrder.workDaySet" @change="handleCheckedCitiesChange">
                            <el-checkbox v-for="day in days" :label="day" :key="day"></el-checkbox>
                        </el-checkbox-group>
                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                    </div>
                </div>
                <el-divider></el-divider>
                <!-- 节假日设置 -->
                <div class="rest">
                    <span>节假日设置</span>
                    <el-checkbox v-model="clockOrder.applyFestival" class="autorest" @change="changeAutoRest">法定节假日自动排休</el-checkbox>
                    <span>（说明:勾选后自动在考勤日历应用国家假日办发布的节假日排序计划）</span>
                </div>
                <el-divider></el-divider>
            </div>
            <div class="second" v-if="active === 1">
                <div class="header">
                    <div class="site-header">
                        <p>已选考勤地点</p>
                        <div class="btn">
                            <muti-btn :className="'el-icon-circle-plus-outline'" :nameText="'添加'" @click.native="isShowAdd = true"></muti-btn>
                            <muti-btn :className="'el-icon-circle-plus-outline'" :nameText="'创建'" @click.native="createSite"></muti-btn>
                        </div>
                    </div>
                    <div class="site-content">
                        <site-tag :siteData="clockSite" @delsite="delsite" @changeClockType="changeClockType"></site-tag>
                    </div>
                </div>
                <my-dialog :title="'考勤地点列表'" :width="'800px'" :show.sync="isShowAdd"  @close="isShowAdd = false" :isOption="false">
                    <template slot="dialog-content">
                        <div class="content">
                            <div class="content-table">
                                <table-data :head="siteHead" :tableLoading="loadingSite" :tableData="siteTableData" :totalNumber="recordCount"  :option="option" :format="formatter" @editTable="editTable"
                                    @chooseTable="chooseTable" :isSelected="false" @currentChange="nextSitePage" :data="searchInfo" :formData="formData" @changeMutiSelect="changeMutiSelect" 
                                    @btnClick="searchSite" :isMutiOption="false">
                                </table-data>
                            </div>
                        </div>
                    </template>
                </my-dialog>
                <look-site :show="isShowSite" @close="closeSite" @cancel="closeSite" @confirm="goEditSite"></look-site>
            </div>
            <div class="third" v-if="active === 2">
                <div class="edit-wrapper">
                    <table-data :head="head" :tableData="clockUser" :tableLoading="loadingUser" :isSelected="false" :option="userOption" :totalNumber="totalUser" :emptyText="emptyText"
                                :data="searchUserInfo" :formData="formUserData" @changeMutiSelect="changeMutiSelect" @btnClick="isSelectPart = !isSelectPart">
                        <template #special="{scope: scope}">
                            <img v-if="scope.column.property == 'avater'" :src="scope.row.avater" style="max-width: 40px;border-radius: 50%;">
                        </template>
                        <template #option="{scope: scope}">
                            <img src="@/assets/images/del.png" class="delImg" @click.prevent="delUser(scope)">
                        </template>
                    </table-data>
                    <select-tree v-if="isSelectPart" class="select-depart"></select-tree>
                </div>
            </div>
            <div class="fourth" v-if="active === 3">
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
                        <table-data :head="specialHead" :tableData="specialDate" :page="page" :isSelected="false" :emptyText="emptyDateText" :isSearch="false" :format="formatDate">
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
        <footer class="create-footer" v-else>
            <el-button @click="saveEdit" type="primary">保存</el-button>
        </footer>
    </div>
</template>

<script>
import ClockCountTimes from '@/components/checkgroup/clockCountTimes'
import SiteTag from '@/components/checkgroup/siteTag'
import TableData from '@/components/common/TableData'
import SelectTree from '@/components/common/SelectTree'
import SpecialDay from '@/components/checkgroup/specialDay'
import MutiBtn from '@/components/common/MutiBtn'
import MyDialog from '@/components/common/MyDialog'
import LookSite from '@/components/site/lookSite'
import utils from '@/utils/utils'
import {mapState,mapMutations,mapActions} from 'vuex'
const days = ['周一','周二','周三','周四','周五','周六','周日']
export default {
    props: {
        status: {type:String,default:'new'},
    },
    data() {
        return {
            active: 0,
            steps: ['班次设置','考勤地点设置','考勤组成员编辑','特殊日期设置'],
            groupname: '',
            isShowEditName: false,
            // -----------------工作日设置----------------
            // 工作日全选设置
            isIndeterminate: true,
            // workday: [],
            checkAll: false,
            // 渲染周一至周日
            days:days,
            clockStartTime: '',
            // --------------------考勤地点设置--------------------------
            //搜索地点标签
            isShowAdd: false,
            isShowSite: false,
            searchInfo: {},
            formData: [{type:'text',nameText:'可选考勤地点'},{type: 'input',label:'name',placeholder:'考勤地点名称'},{type:'mutiSelect',nameText:'城市',options:[]},{type:'button',btnType:'primary',nameText: '搜索'}],
            loadingSite: false,
            recordCount: 0,
            siteName: '',
            city: '',
            cityOptions: [{value:'hainan',label:'海南'}],
            siteHead: [{key:'city',name: '所在位置'},{key:'officeName',name: '地点名称'},{key:'clockType',name: '支持打卡方式'}],
            option: [{name: '查看',type:1,event: 'editTable'},{name: '选择',type:1,event: 'chooseTable'}],
            siteTableData: [],
            // ------------------------考勤组成员编辑---------------
            //是否按部门添加考勤组成员
            searchUserInfo: {},
            formUserData: [{type:'button',btnType:'plain',nameText:'按部门添加'},{type:'input',placeholder:'输入名称搜索',label:'name'}],
            isSelectPart: false,
            head: [{key:'name',name: '姓名'},{key:'username',name: '用户账号'},{key:'mobile',name: '手机号'},{key:'hisgroup',name: '历史考勤组'},{key:'organ',name: '组织'}],
            userOption:[],
            //考勤组成员信息
            users: [],
            loadingUser: false,
            totalUser: 0,
            emptyText: '还没有添加考勤组成员！',
            // ----------------------------特殊日期------------------------------
            emptyDateText: '还没有添加特殊日期！',
            specialHead: [{key:'date',name: '日期'},{key:'type',name: '设置类型'},{key:'scheduleItem',name: '上班时段'},{key:'reason',name:'原因'},{key:'operator',name: '设置人'}],
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
    components: {
        SiteTag,TableData,SelectTree,SpecialDay,MutiBtn,MyDialog,LookSite,ClockCountTimes
    },
    mounted() {
        this.groupname = this.name
        //初次进入页面清除时间数据，
        this.clearCountData()
        this.initialData()
        //编辑时获取已设置考勤班次
        if(this.status === 'edit')   {
            this.getClockSchedual().then(res=> {
                this.setEditClockOrder(res)
            })
        }
    },
    computed: {
        ...mapState({
            name: state => state.group.name,
            id: state => state.group.id,
            clockOrder: state => state.group.clockOrder,
            initialClockSite: state => state.group.initialClockSite,
            clockSite: state => state.group.clockSite,
            clockUserId: state => state.group.clockUserId,
            initialDate: state => state.group.initialDate,
            specialDate: state => state.group.specialDate,
            siteInfo: state => state.site.siteInfo,
        }),
    },
    watch: {
        //监听active状态变化获取页面初始数据
        active: function(val) {
            switch(val) {
                case 0:
                    console.log(156156154);
                    break
                case 1:
                    //编辑时获取已添加考勤地点
                    if(this.status === 'edit') this.getAddClockSite()
                    break
                case 2:
                    //编辑时获取已添加考勤组成员及组织机构树
                    if(this.status === 'edit') {
                        this.getAddClockUser()
                    } 
                    break
                case 3:
                    //编辑时获取已添加考勤组特殊日期
                    if(this.status === 'edit') this.getInitialDate()
                    break
            }
        },
        isShowAdd: function(val) {
            if(val) this.getUsefulSite()
        }
    },
    methods: {
        ...mapMutations({
            setWorkDay: 'group/setWorkDay',
            setAutoRest: 'group/setAutoRest',
            setClockSite: 'group/setClockSite',
            setName: 'group/setName',
            setClockStartTime: 'group/setClockStartTime',
            setSiteInfo: 'site/setSiteInfo',
            setInitialClockSite: 'group/setInitialClockSite',
            setClockType: 'group/setClockType',
            setSpecialDates:'group/setSpecialDates',
            setClockTime: 'group/setClockTime',
            setClockCount: 'group/setClockCount',
            setCountData: 'group/setCountData',
            setClockOrder: 'group/setClockOrder',
            clearCountData: 'group/clearCountData',
            initialData: 'group/initialData',
        }),
        ...mapActions({
            addClockSite: 'group/addClockSite',
            getAddClockSite: 'group/getAddClockSite',
            editName: 'group/editName',
            getInitialDate: 'group/getInitialDate',
            getClockSchedual: 'group/getClockSchedual'
        }),
        // ***************************修改考勤组名称*******************************
        changeName: function() {
            this.editName(this.groupname).then(res=> {
                this.groupname = this.name
                this.$message.success(res)
                this.isShowEditName = false
            }).catch(err=> {
                this.$message.error(err)
            })
        },
        // ***************************点击操作*******************************
        //点击进行下一步
        next: function() {
            switch(this.active) {
                case 0:
                    //操作班次编辑
                    this.setSchedual()
                    break
                case 1:
                    //操作考勤地点
                    this.setGroupSite()
                    break
            }
        },
        //点击进行上一步
        last: function(){
            switch(this.active) {
                case 1:
                    //操作考勤地点
                    break
                case 2:
                    //操作考勤组成员
                    break
            }
            this.active--
        },
        //设置特殊日期及编辑是点击跳转
        goSpecialDate: function(i) {
            if(this.status === 'new' && i === 3) {
                this.active = 3
            } 
            if(this.status === 'edit') this.active = i
        },
        //后两步的提交按钮
        submit: function() {
            switch(this.active) {
                case 2:
                    //操作考勤组成员
                    break
                case 3:
                    //操作特殊日期
                        //提交特殊日期接口
                    this.setSpecialDate()
                    break
            }
        },
        // *************************保存编辑考勤组*******************
        saveEdit: function() {
            switch(this.active) {
                case 0:
                    //保存班次编辑
                    this.setSchedual()
                    break
                case 1:
                    //保存考勤地点
                    this.setGroupSite()
                    break
                case 2:
                    //保存考勤组成员
                    break
                case 3:
                    //保存特殊日期
                    break
            }
        },
        // ***********************考勤班次设置***********************
            //保存考勤班次设置
        setSchedual: function() {
            let clockOrder = this.clockOrder
            let clockGroupId = this.id
            let workDaySet = {}
            let {applyFestival,clockTimes,clockStartTime,scheduleItem} = clockOrder
            workDaySet = utils.transformWorkday(clockOrder.workDaySet)
            this.$axios({
                url: `/es/regularSchedules/save`,
                method: 'post',
                data: {clockGroupId,scheduleItem,workDaySet,applyFestival,clockTimes,clockStartTime}
            }).then(res=> {
                if(res) {
                    this.$message.success({
                        msg: res,
                        duration: 2000
                    })
                    this.setClockOrder({})
                    this.active++
                }
            }).catch(err=> {
                console.log(err)
            })
        },
        //修每天开始打卡时间
        changeTime: function(val) {
            this.setClockStartTime(val)
        },
        //全选按钮工作日激活操作
        handleCheckAllChange(val) {
            if(val) this.setWorkDay(this.days)
            this.clockOrder.workDaySet = val ? days : []
            this.isIndeterminate = false;
        },
        //全部选择工作日激活操作
        handleCheckedCitiesChange(value) {
            this.setWorkDay(value)
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.days.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.days.length;
        },
        //更改自动排休状态
        changeAutoRest: function(val) {
            this.setAutoRest(val)
        },
        //编辑考勤班次时设置state/clockOrder
        setEditClockOrder: function(obj) {
            let scheduleItem = obj.scheduleItem
            let time = []
            let times = []
            if(obj.clockTimes === 2) {
                scheduleItem.forEach(item=> {
                    if(item.type) {
                        time[0] = item.startTime
                        time[1] = item.endTime
                        times.push({text: '休息时段',time:time})
                    } else {
                        time[0] = item.startTime
                        time[1] = item.endTime
                        times.push({text: '工作时段',time:time})
                    }
                })
            } else {
                scheduleItem.forEach(item=> {
                    time[0] = item.startTime
                    time[1] = item.endTime
                    times.push({text: '工作时段',time:time})
                })
            }
            this.setWorkDay(utils.filterWorkDay(obj.workDaySet))
            this.setCountData({i: obj.clockTimes,data: times})
        },
        // ********************************考勤地点设置*******************************
        // 创建考勤地点
        createSite: function() {
            this.$router.push('create_clock_site')
        },
        //删除已选择考勤地点
        delsite: function(id) {
            const list = this.clockSite
            let data = this._.remove(list,function(o) {return o.officeId !== id})
            this.setClockSite(data)
        },
        //编辑已选考勤地点打卡方式
        changeClockType: function(val,t,i) {
            this.setClockType({val,t,i})
        },
        //获取考勤地点列表
        getUsefulSite: function(name='',city='',page=1,size=20) {
            this.loadingSite = true
            this.$axios({
                url: `/es/groupOffices/_search?page=${page}&size=${size}`,
                method: 'post',
                data: {name,city}
            }).then(res=> {
                console.log('成功获取考勤组下可选考勤地点',res)
                if(res) {
                    this.siteTableData = res.content
                    this.recordCount = res.recordCount
                }
                this.loadingSite = false
            }).catch(err=> {
                console.log(err);
            })
        },
        //搜索考勤地点
        searchSite: function() {
            const name = this.searchInfo.name
            const city = this.searchInfo.city
            this.getUsefulSite(name,city,1,20)
        },
        //翻页
        nextSitePage: function(val) {
            this.getUsefulSite(this.id,this.searchInfo.name,this.searchInfo.city,val,20)
        },
        //查看考勤地点信息
        editTable: function(scope) {
            //根据对应地点跳转至查看考勤地点页面*
            this.setSiteInfo(scope.row)
            this.isShowSite = true 
        },
        //通过查看考勤地点页面进入编辑
        goEditSite: function() {
            this.isShowSite = false
            this.$router.push({
                name: 'edit_clock_site',
                params: {
                    officeId: this.siteInfo.id
                }    
            })
        },
        //关闭查看弹框 + 关闭按钮关闭查看弹框
        closeSite: function() {
            this.isShowSite = false
            this.setSiteInfo({})
        },
        //选择考勤地点---将对应信息添加至已选择项
        chooseTable: function(scope) {
            let site = scope.row
            let sitePresent = this.clockSite
            let id = site.officeId
            let initialId = this._.intersection(sitePresent.map(item => item.officeId))
            if(initialId.indexOf(id) !== -1) {
                this.$message.warning('考勤地点已存在，无法重复添加')
                return
            }
            let list = []
            site.clockType.forEach(item=> {
                list.push({type:item,enable:true})
            })
            site.clockType = list
            sitePresent.push(site)
            this.setClockSite(sitePresent)
        },
        //设置考勤组对应考勤地点（final）包含编辑及新增
            /* eslint-disable */
        setGroupSite: function() {
            let clockGroupId  = this.id
            let obj = utils.addDelArr(this.initialClockSite,this.clockSite,'officeId')
            const addOffices = []
            obj.addArr.forEach(item=> {
                let {city,officeName,...addItem} = item
                if(!item.scope) {
                    addItem.scope = 0
                } else
                addItem.scope = item.scope ? parseInt(item.scope) : 0
                addOffices.push(addItem)
            })
            obj.editArr.forEach(item=> {
                let {city,officeName,groupOfficeId,...editItem} = item
                if(!item.scope) editItem.scope = 0
                addOffices.push(editItem)
            })
            const delOffices = obj.delArr.map(item => item.groupOfficeId)
            this.$axios({
                url: '/es/groupOffices/set',
                method: 'post',
                data: {clockGroupId,addOffices,delOffices}
            }).then(res=> {
                if(res) {
                    this.$message.success(res)
                    this.active++  
                } 
            }).catch(err=> {
                console.log(err)
            })

        },
        formatter: function(cellvalue,property) {
            if(property == 'clockType') { 
                return utils.filterClockType(cellvalue)
            } else {
                return cellvalue
            }
        },
        //****************************
        changeMutiSelect: function(val1,val2) {
            this.searchInfo[val2] = val1
        },
        // ********************************考勤组成员设置*******************************
        //删除考勤组成员
        delUser: function(scope) {
            this.users = this._.dropWhile(this.users, (item)=> {return item.id === scope.row.id})
        },
        // ********************************考勤组特殊日期设置*******************************
        //点击某一日期后弹出设置时间的操作
        setDate: function($event,date,data){
            this.day = data.day
            if(data.day == this.clickDay) {
                this.isSetSpecial = !this.isSetSpecial
            } else {
                this.isSetSpecial = true
            }
            this.$refs.setSpecial.style.top = ($event.pageY - $event.offsetY) + 'px'
            this.$refs.setSpecial.style.left = ($event.pageX - $event.offsetX + $event.target.clientWidth) + 'px'
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
        submitSet: function(reason,type) {
            let dates = this.specialDate
            if(dates.map(item=>item.date).indexOf(this.day) !== -1) {
                this.$message.error('不可重复添加日期！')
                this.isSetSpecial = false
                return 
            } 
            let data = type === 1 ? {date:this.day,reason,type,scheduleItem:this.clockOrder.scheduleItem}  : {date:this.day,reason,type,scheduleItem:[]}
            dates.push(data)
            this.setSpecialDates(dates)
            this.isSetSpecial = false
        },
        //点击取消隐藏设置框
        cancelSet: function() {
            this.setClockTime([])
            this.isSetSpecial = false
        },
        //删除考勤时间
        delTime: function(scope) {
            let dates = this.specialDate
            let data = this._.remove(dates,item => item.date !== scope.row.date )
            this.setSpecialDates(data)
        },
        //提交特殊日期接口******------
        setSpecialDate: function() {
            let clockGroupId = this.id
            let obj = utils.addDelArr(this.initialDate,this.specialDate,'id')
            let addSchedualItem = obj.addArr
            let delSchedualItemId = obj.delArr.map(item=> item.id)
            this.$axios({
                url: '',
                method: 'post',
                data: {clockGroupId,addSchedualItem,delSchedualItemId}
            }).then(res=> {
                if(res) {
                    this.$message.success(res)
                    this.$router.push('clock_group_manage')
                }
            }).catch(err=> {
                console.log(err)
            })
        },
        //过滤特殊日期类型
        formatDate: function(cellValue,property) {
            let val = ['上班','调整时间','休息']
            switch(property) {
                case 'type':
                    return val[cellValue]
                    break
                case 'scheduleItem':
                    const list = []
                    if(cellValue) {
                        cellValue.forEach(item=> {
                            list.push(!item.type ? `工作时段：${item.startTime}-${item.endTime}` : `休息时段：${item.startTime}-${item.endTime}`)
                        })
                    }
                    return cellValue ? list.join('<br>') : '无'
                    break
                default:
                    return cellValue ? cellValue : '无'
            }
        }
    }
}
</script>


<style lang="scss" scoped>
// @deep: ~'>>>';
$contentLeft: 15px;
    .create-group-container {
        color: #666;
        .group-header {
            border-top: 1px solid #D5DDE9;
            padding: 0  38px 0px 45px;
            .name {
                display: flex;
                align-items: center;
                margin: 20px 10px 18px 0;
                color: #666666;
                p {
                    white-space: nowrap;
                    font-weight: 400;
                    font-size:14px;
                }
                .el-icon-edit {
                    cursor: pointer;
                    color: #666666;
                    &:hover {
                        color: #1989FA;
                        font-weight: 700;
                    }
                }
                
            }
            .el-steps {
                //编辑状态时的step样式
                .step-edit {
                    &.isSet {
                        /deep/ .el-step__main {
                            .el-step__title {
                                background-color: #409eff;
                            }
                        }
                    }
                    /deep/ .el-step__main {
                        margin-top: 4px;
                        .el-step__title {
                            width:120px;
                            background:#a7d2f9;
                            border-radius: 2px;
                            color: #fff;
                            cursor: pointer;
                            text-align: center;
                            position: relative;
                            right: 50px;
                            &:hover {
                                background-color: #409eff;
                            }
                        }
                    }
                }
                //修改实线为虚线
                .step2 {
                    /deep/ .el-step__head {
                        .el-step__line {
                            border-bottom: 2px dashed #E5EAEF;
                            background-color: #fff;
                            top: 9px;
                        }
                    }
                }
                .step3 {
                    // &.isSet {
                    //     &.step-edit {
                    //         /deep/ .el-step__title {
                    //             background-color: #ff0000;
                    //         }
                    //     }
                    // }
                    /deep/ .el-step__main {
                        .el-step__title {
                            // width:120px;
                            // border-radius: 2px;
                            position: relative;
                            right: 50px;
                            cursor: pointer;
                            // text-align: center;
                            margin: auto 0;
                            // color: #fff;
                            // &:hover {
                            //     background-color: #ff0000;
                            // }
                        }
                        
                    }
                }
                .el-step {
                    /deep/ .el-step__main {
                        .el-step__title {
                            font-size: 14px;
                        }
                    }
                }
            }
        }
        .create-content {
            margin: 40px 25px 40px 30px;
            .first {
                .clock-start-time {
                    display: flex;
                    align-items: center;
                    span {
                        font-size:12px;
                        color:#666;
                        display: block;
                        text-align: left;
                        line-height: 18px;
                        width: 60px;
                        height: 30px;
                        padding-left: 15px;
                        margin-right: 86px;
                    }
                }
                .el-divider {
                    margin: 20px 0;
                }
                .day {
                    padding-left: $contentLeft;
                    display: flex;
                    .text {
                        margin-right: 86px;
                        span {
                            font-size: 12px;
                            color: #666;
                        }
                    }
                    .workday {
                        display: flex;
                        .el-checkbox-group {
                            display: flex;
                            /deep/ .el-checkbox__label {
                                color: #666;
                                font-size: 12px;
                            }
                        }
                        &>.el-checkbox {
                            margin-left: 62px;
                            /deep/ .el-checkbox__label {
                                color: #666;
                                font-size: 12px;
                            }
                        }
                    }
                }
                .rest {
                    padding-left: $contentLeft;
                    display: flex;
                    align-items: center;
                    span {
                        font-size: 12px;
                        color: #666;
                        display: block;
                        margin-right: 86px;
                    }
                    .autorest {
                        /deep/ .el-checkbox__label {
                            text-decoration: underline;
                            font-size: 12px;
                            color: #666;
                        }
                    }
                }
            }
            .second {
                .header {
                    .site-header {
                       display: flex;
                       align-items: center;
                       justify-content: space-between;
                       padding-left: $contentLeft;
                       p {
                           font-size: 12px;
                       }
                       .btn {
                           display: flex;
                           align-items: center;
                       }
                    }
                    .site-content {
                        margin-top: 30px;
                    }
                }
                /deep/ .el-dialog {
                    .el-dialog__body {
                        // padding: 0;
                        padding-left: 10px;
                        padding-right: 4px;

                    }
                }
            }
            .third {
                // 编辑考勤组成员中表格距离顶部样式
                .edit-wrapper {
                    position: relative;
                    .select-depart {
                        position: absolute ;
                        top: 40px; 
                        z-index:999
                    }
                    &:last-child {
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
            .fourth {
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
                    width: 40%;
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
        }
        .create-footer {
            display: flex;
            justify-content: center;
        }
    }
</style>
