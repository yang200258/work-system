<template>
    <div class="create-group-container">
        <header class="group-header">
            <div class="name">
                <p style="margin-right:6px"> {{name}}</p>
                <!-- <el-popover placement="bottom" title="修改考勤组名称" width="400" trigger="click" v-model="isShowEditName"> -->
                    <!-- <el-input v-model="groupname" clearable @keyup.enter.native="changeName"></el-input> -->
                <i class="el-icon-edit" slot="reference" style="font-size:14px" @click.prevent="openChangeName"></i>
                <!-- </el-popover> -->
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
                                    @btnClick="searchSite" :isMutiOption="false" :optionWidth="'100px'">
                                </table-data>
                            </div>
                        </div>
                    </template>
                </my-dialog>
                <look-site :show="isShowSite" @close="closeSite" @cancel="closeSite" @confirm="goEditSite"></look-site>
            </div>
            <div class="third" v-if="active === 2">
                <div class="left-third">
                    <p style="font-size: 14px;font-weight:700;">请选择编辑成员</p>
                    <el-input placeholder="请输入用户姓名" v-model="userName" clearable size="mini" @keyup.enter.native="searchUser" @clear="clearUserName">
                        <i slot="suffix" class="el-input__icon el-icon-search" @click.prevent="searchUser"></i>
                    </el-input>
                    <el-scrollbar style="height: 100%">
                        <el-tree v-loading="searchLoading" ref="tree" :props="props" :load="loadNode" lazy show-checkbox expand-on-click-node @check-change="selectUser" highlight-current check-on-click-node
                        node-key="id" @setCheckedNodes="setCheckedUser" @node-expand="nodeExpand" :data="rootNode"></el-tree>
                    </el-scrollbar>
                </div>
                <div class="right-third">
                    <table-data :head="head" :tableData="clockUser" :tableLoading="loadingUser" :isSelected="false" :option="userOption" :totalNumber="totalUser" :emptyText="emptyText"
                        :isSearch="false" @delTable="delUser" :format="formatUser" :height="500" :page="{isPagenation:false}" :tableRowClassName="selectedUser">
                    </table-data>
                </div>
            </div>
            <div class="fourth" v-if="active === 3">
                <special-dates></special-dates>
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
import SpecialDates from '@/components/checkgroup/specialDates'
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
            //tree数据
            props: {label: 'name',children:'children',isLeaf: 'leaf'},
            rootNode: [],
            userName: '',
            searchLoading: false,   //搜索user时状态
            //是否按部门添加考勤组成员
            head: [{key:'name',name: '姓名'},{key:'username',name: '用户账号'},{key:'mobile',name: '手机号'},{key:'clockGroupName',name: '当前考勤组'},{key:'organizationName',name: '组织'}],
            userOption:[{name: '删除',event: 'delTable',type:2}],
            //考勤组成员信息
            users: [],
            loadingUser: false,
            totalUser: 0,
            emptyText: '还没有添加考勤组成员！',
            
        }
    },
    components: {
        SiteTag,TableData,SpecialDates,MutiBtn,MyDialog,LookSite,ClockCountTimes
    },
    mounted() {
        this.groupname = this.name
        //编辑时获取已设置考勤班次
        if(this.status === 'edit')   {
            this.getClockSchedual().then(res=> {
               this.setEditClockOrder(res)
            })
        }
        //初次进入页面清除时间数据，
        this.clearCountData()
        this.initialData()
        //获取初始机构树
        this.getDepartUser().then(res => this.rootNode = res)
    },
    computed: {
        ...mapState({
            name: state => state.group.name,
            id: state => state.group.id,
            clockOrder: state => state.group.clockOrder,
            initialClockSite: state => state.group.initialClockSite,
            clockSite: state => state.group.clockSite,
            clockUser: state => state.group.clockUser,
            specialDate: state => state.group.specialDate,
            siteInfo: state => state.site.siteInfo,
            initialClockUser: state => state.group.initialClockUser,
            countData: state => state.group.countData,
        }),
    },
    watch: {
        //监听active状态变化获取页面初始数据
        active: function(val) {
            switch(val) {
                case 0:
                    break
                case 1:
                    //编辑时获取已添加考勤地点
                    if(this.status === 'edit') this.getAddClockSite()
                    break
                case 2:
                    // TODO: 未知bug，点击选择考勤地点时考勤用户被赋值
                    this.setClockUser([])
                    this.setInitialClockUser([])
                    //编辑时获取已添加考勤组成员及组织机构树
                    if(this.status === 'edit') {
                        this.getAddClockUser(this.id).then(res=> {
                            this.setCheckedUser(res)
                        })
                    } 
                    break
                case 3:
                    // TODO: 未知bug，点击选择考勤地点时考勤用户被赋值
                    this.setInitialDate([])
                    this.setSpecialDates([])
                    //编辑时获取已添加考勤组特殊日期
                    if(this.status === 'edit') this.getInitialDate(this.id)
                    break
            }
        },
        isShowAdd: function(val) {
            if(val) this.getUsefulSite()
        },
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
            setClockCount: 'group/setClockCount',
            setCountData: 'group/setCountData',
            setClockOrder: 'group/setClockOrder',
            clearCountData: 'group/clearCountData',
            initialData: 'group/initialData',
            setClockUser: 'group/setClockUser',
            setInitialClockUser: 'group/setInitialClockUser',
            setInitialDate: 'group/setInitialDate',
        }),
        ...mapActions({
            getAddClockSite: 'group/getAddClockSite',
            editName: 'group/editName',
            getInitialDate: 'group/getInitialDate',
            getClockSchedual: 'group/getClockSchedual',
            submitSpecialDate: 'group/submitSpecialDate',
            getAddClockUser: 'group/getAddClockUser'
        }),
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
            this.active--
        },
        //后两步的提交按钮
        submit: function() {
            switch(this.active) {
                case 2:
                    //操作考勤组成员
                    this.saveGroupUser()
                    break
                case 3:
                    //操作特殊日期
                        //提交特殊日期接口
                    this.submitSpecialDate([this.id]).then(res=> {
                        this.$message.success(res)
                        this.$router.push({name: 'clock_group_manage'})
                    })
                    break
            }
        },
        // ***************************修改考勤组名称*******************************
        openChangeName() {
            this.$prompt('请输入名称', '修改考勤组名称', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputErrorMessage: '格式不正确'
            }).then(({ value }) => {
                this.changeName(value)
            }).catch(() => {
                      
            })
        },
        changeName: function(groupname) {
            if(!groupname && !utils.isStringEmpty(groupname)) {
                this.$message.error('考勤组名称不能为空！')
                return
            }
            this.editName(groupname).then(res=> {
                // this.groupname = this.name
                this.$message.success(res)
                // this.isShowEditName = false
            }).catch(err=> {
                this.$message.error(err)
            })
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
                    this.saveGroupUser()
                    break
                case 3:
                    //保存特殊日期
                    this.submitSpecialDate([this.id]).then(res=> {
                        this.$message.success(res)
                        this.getInitialDate(this.id)
                    })
                    break
            }
        },
        // ***********************考勤班次设置***********************
            //保存考勤班次设置
        async setSchedual() {
            let clockOrder = this.clockOrder
            let clockGroupId = this.id
            let workDaySet = {}
            let {applyFestival,clockTimes,clockStartTime} = clockOrder
            let scheduleItem = utils.dealTimeData(this.countData,clockTimes)
            workDaySet = utils.transformWorkday(clockOrder.workDaySet)
            try {
                let res = await this.$axios({url: `/es/regularSchedules/save`,method: 'post',data: {clockGroupId,scheduleItem,workDaySet,applyFestival,clockTimes,clockStartTime}})
                if(res) {
                    this.$message.success(res)
                    this.setClockOrder({clockTimes: 2})
                    this.clearCountData()
                    if(this.status !== 'edit') this.active++
                }
            }catch(err) {
                console.log(err)
            }
        },
        //修每天开始打卡时间
        changeTime: function(val) {
            this.setClockStartTime(val)
        },
        //全选按钮工作日激活操作
        handleCheckAllChange(val) {
            if(val) this.setWorkDay(this.days)
            this.setWorkDay(val ? days : [])
            this.isIndeterminate = false;
        },
        //全部选择工作日激活操作
        handleCheckedCitiesChange(value) {
            this.setWorkDay(value)
            let checkedCount = value.length
            this.checkAll = checkedCount === this.days.length
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.days.length;
        },
        //更改自动排休状态
        changeAutoRest: function(val) {
            this.setAutoRest(val)
        },
        //编辑考勤班次时设置state/clockOrder
        setEditClockOrder(obj) {
            if(!obj.clockTimes) {
                this.clearCountData()
                this.initialData()
                return 
            }
            let times = this.formatCountData(obj.clockTimes,obj.scheduleItem)
            this.setWorkDay(utils.filterWorkDay(obj.workDaySet))
            this.setCountData({i: obj.clockTimes/2-1,data: times})
        },
         //格式化获取到的countData数据
        formatCountData: function(clockTimes, scheduleItem) {
            let time = []
            let times = []
            if(clockTimes === 0) {
                times.push({ text: '休息时段', time: [] },{ text: '工作时段', time: [] })
            }
            if (clockTimes === 2) {
                scheduleItem.forEach(item => {
                    if (item.type) {
                        time[0] = item.startTime
                        time[1] = item.endTime
                        times.push({ text: '休息时段', time: time })
                    } else {
                        time[0] = item.startTime
                        time[1] = item.endTime
                        times.push({ text: '工作时段', time: time })
                    }
                })
            } else {
                if (scheduleItem && scheduleItem.length) {
                    scheduleItem.forEach((item, i) => {
                        time[0] = item.startTime
                        time[1] = item.endTime
                        times.push({ text: `工作时段${i+1}`, time: time })
                    })
                }
            }
            return times
        },
        // ********************************考勤地点设置*******************************
        // 创建考勤地点
        createSite: function() {
            this.$router.push({name:'create_clock_site'})
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
        async getUsefulSite(name='',city=[],page=1,size=20) {
            this.loadingSite = true
            try {
                let res = await this.$axios({url: `/es/groupOffices/_search?page=${page}&size=${size}`,method: 'post',data: {name,city}})
                console.log('成功获取考勤组下可选考勤地点',res)
                if(res) {
                    this.siteTableData = res.content
                    this.recordCount = res.recordCount
                }
                this.loadingSite = false
            }catch(err) {
                console.log(err)
            }
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
            scope.row.id = scope.row.officeId
            scope.row.name = scope.row.officeName
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
            // eslint-disable-next-line
            let {latitude,longitude,clockGroup,...site} = scope.row
            let sitePresent = this.clockSite
            let id = site.officeId
            let initialId = this._.intersection(sitePresent.map(item => item.officeId))
            if(initialId.includes(id)) {
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
        async setGroupSite() {
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
            try {
                let res = await this.$axios({url: '/es/groupOffices/set',method: 'post',data: {clockGroupId,addOffices,delOffices}})
                if(res) {
                    this.$message.success(res)
                    if(this.status !== 'edit') this.active++
                } 
            }catch(err) {
                console.log(err)
            }
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
        //获取机构及人员
        async getDepartUser(oid=1) {
            let node = await this.$axios({url: `/sys/organization-with-users?oid=${oid}`,method: 'get'})
            let rootNode = this.dealOrganUser(node.organizations,node.users,oid)
            return rootNode
        },
        //异步加载部门或人员数据（点击节点）
        async loadNode(node,resolve) {
            if(node.level === 0) {
                return resolve(this.rootNode)
            } else {
                let list = []
                await this.getDepartUser(node.data.id).then(res => resolve(res) )
            }
            this.setCheckedUser(this.clockUser)
        },
        //处理获取机构树后机构和用户
        /**
         * @id 需要删除的id
         */
        dealOrganUser: function(organs,users,id) {
            let list = []
            let data = []
            if(users && users.length) {
                users.forEach(item=> {
                    item.leaf = true
                })
            }
            if(organs && organs.length) {
                data = this._.dropWhile(organs,function(o) {return o.id == id })
            } 
            list = data.concat(users)
            return list
        },
        //选中状态变化时的事件
        selectUser: function(data, checked) {
            let list = this.clockUser
            if(!data.leaf && !checked) return
            if(data.leaf) {
                checked ? this._.findIndex(list,item => item.id == data.id) === -1 ? list.push(data) : '' 
                        : (list = this._.remove(list,item=> item.id !== data.id))
                this.setClockUser(list)
            }
        },
        //删除考勤组成员
        delUser: function(scope) {
            let list = this.clockUser
            let id = scope.row.id
            let data = this._.remove(list, item => item.id !== id)
            this.setClockUser(data)
            this.setCheckedUser(data)
        },
        //搜索考勤组成员
        searchUser: function() {
            if(utils.isStringEmpty(this.userName)) return this.$message.warning('请输入姓名再进行搜索！')
            this.queryUser(this.userName)
        },
        //搜索接口
        async queryUser(q,page=1,size=20,gid=[],oid=[],rid=[]) {
            this.searchLoading = true
            try {
                let res = await this.$axios({url: `/sys/users/_search?page=${page}&size=${size}`,method: 'post',data: {gid,oid,q,rid}})
                if(res) {
                    console.log('成功搜索到用户',res)
                    res.content.forEach(item=> {
                        item.leaf = true
                        item.username ? item.name = `${item.name}(${item.username})` : ''
                    })
                    this.rootNode = res.content
                    this.searchLoading = false
                }
            }catch(err) {
                console.log(err)
            }
        },
        //清除搜索框内容后重新获取机构树
        clearUserName: function() {
            this.getDepartUser().then(res => this.rootNode = res)
        },
        //节点展开回调
        nodeExpand: function() {
            this.setCheckedUser(this.clockUser)
        },
        //根据考勤组操作同步已选考勤组数据至树
        setCheckedUser: function(user) {
            this.$refs.tree.setCheckedNodes(user)
        },
        //编辑时保存考勤组成员设置
        async saveGroupUser() {
            let clockGroupId = this.id
            let obj = utils.addDelArr(this.initialClockUser,this.clockUser,'id')
            let addUserId = obj.addArr ? obj.addArr.map(item=> item.id ) : []
            let deleteUserId = obj.delArr ? obj.delArr.map(item=> item.id) : []
            let res = await this.$axios({url: '/es/groupUsers/set',method: 'post',data: {clockGroupId,addUserId,deleteUserId}})
            if(res) {
                if(this.status === 'edit') return this.$message.success(res)
                this.$confirm(`${res}，是否继续设置特殊日期？`, '', {
                    confirmButtonText: '是',
                    cancelButtonText: '否',
                    type: 'success'
                }).then(() => {
                    this.active++
                }).catch(() => {
                    this.$router.push({name: 'clock_group_manage'})
                })
            }
        },
        //格式化考勤组成员数据
        formatUser: function(val,property) {
            return val ? val : '无'
        },
        selectedUser: function({row, rowIndex}) {
            if(this.initialClockUser.map(item=>item.id).includes(row.id)) return 'success-row'
        },
        // ********************************考勤组特殊日期设置*******************************
         //设置特殊日期及编辑时点击跳转
        goSpecialDate: function(i) {
            if(this.status === 'new' && i === 3) {
                this.active = 3
            } 
            if(this.status === 'edit') this.active = i
        },
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
                            background-color:#a7d2f9;
                            border-radius: 2px;
                            color: #fff;
                            cursor: pointer;
                            text-align: center;
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
                    /deep/ .el-step__main {
                        .el-step__title {
                            cursor: pointer;
                            margin: auto 0;
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
                display: grid;
                grid-template-columns: 400px auto;
                .left-third {
                    height: 468px;
                    padding-left: 15px;
                    margin-top: 16px;
                    /deep/ .el-scrollbar__wrap {
                        overflow-x: hidden!important;
                    }
                    p {
                        font-size: 14px;
                        font-weight: 700;
                        display: block;
                        margin-bottom: 4px;
                    }
                    .el-input {
                        width: 200px;
                    }
                    .el-tree {
                        margin-top: 20px;
                        overflow-y: auto;
                        overflow-x: hidden;
                    }
                }
                // 编辑考勤组成员中表格距离顶部样式
                .right-third {
                    /deep/ .el-table__empty-block {
                        span {
                            color: #bcbcc9;
                            font-size: 28px;
                        }
                    }
                }
            }
            .fourth {
                height: 620px;
            }
        }
        .create-footer {
            display: flex;
            justify-content: center;
        }
    }
</style>
