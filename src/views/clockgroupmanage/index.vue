<template>
    <div class="clockgroup-manage">
        <section class="clockgroup-content">
            <table-data :head="head" :tableData="clockGroupData" :tableLoading="clockGroupLoading" :totalNumber="groupNumber" :option="option" @chooseTable="getClockGroup" @editTable="editClockGroup" @delTable="delClockGroup" 
                :format="format" :data="searchInfo" :formData="formItem" @btnClick="search" @changeMutiSelect="changeMutiSelect" :mutiItem="mutiItem" @showCreate="showCreate" @mutiTime="mutiTime"
                @specialDate="showSpecialDate" @currentChange="nextGroup" @selectionChange="mutiSelect" @showSlect="showSlectGroup">
            </table-data>
        </section>
        <!-- 创建考勤组名称弹窗 -->
        <my-dialog :title="'新建考勤组'" :width="'35%'" :show.sync="isShowCreate" :isCancel="true" :confirmText="'提交'" @close="closeCreate" @cancel="cancelCreate" class="create-group" @confirm="goCreate">
            <template slot="dialog-content">
                <div class="clock-name">
                    <el-input type="text" placeholder="考勤组名称" size="mini" style="width:400px;margin-bottom:18px" v-model="name"></el-input>
                    <p class="tip">Tip：推荐按照考勤地点加时间段的方式命名考勤组，如“海南大厦26层-9点至17点30分”</p>
                </div>
                <div class="clock-type">
                    <div class="text">
                        <p>班次类型</p>
                    </div>
                    <el-radio-group v-model="type" class="radio-wrapper">
                        <el-radio :label="0">固定班次<span class="radioTip">每天的考勤时间一样</span></el-radio>
                        <el-radio :label="1">排班制<span class="radioTip">自定义设置考勤时间</span></el-radio>
                    </el-radio-group>
                </div>
            </template>
        </my-dialog>
        <!-- 查看考勤组弹窗 -->
        <my-dialog :title="'查看考勤组信息'" :width="'60%'" :show.sync="isShowSee" :isCancel="true" :confirmText="'编辑'" @close="closeSee" @cancel="closeSee" @confirm="goEdit" 
                :cancelText="'关闭'" :innerTitle="'考勤组成员'" :innerShow="innerShow" @closeInner="closeInner">
            <template slot="dialog-content" class="show-clockgroup-content">
                <info-tag :text="'考勤组名称'" :info="groupInfo.name"></info-tag>
                <info-tag :text="'考勤组成员'">
                    <p slot="info-tag">共有
                        <span style="color:#409EFF;text-decoration: underline;cursor:pointer;padding:0 2px;" @click.prevent="showUsers">{{groupInfo.userNum}}</span>
                    个成员</p>
                </info-tag>
                <info-tag :text="'考勤地点'">
                    <div class="site-content" slot="info-tag">
                        <site-tag :siteData="groupInfo.officeAndClockTypes" :isEdit="false"></site-tag>
                    </div>
                </info-tag>
                <info-tag :text="'班次信息'">
                    <div class="order-head" slot="info-tag">
                        <span>{{workType[groupInfo.scheduleType]}}</span>
                        <span>每天{{groupInfo.clockTimes}}次打卡</span>
                    </div>
                    <div class="order-content" slot="info-tag">
                        <time-tag v-for="(item,i) in workDayShow" :key="i" :data="item" :readonly="true" :size="'mini'"></time-tag>
                    </div>
                </info-tag>
                <info-tag :text="'工作日设置'" :info="workday"></info-tag>
                <info-tag :text="'特殊日期设置'">
                    <template slot="info-tag">
                        <special-date-tag :data="groupInfo.specialDate"></special-date-tag>
                    </template>
                </info-tag>
            </template>
            <template slot="innerDialog-content">
                <table-data :head="userHead" :tableData="addUser" :isSelected="false" :isOption="false"  :emptyText="emptyText" :isSearch="false" :height="500" :page="{isPagenation:false}"
                    :format="formatUser">
                </table-data>
            </template>
        </my-dialog>
        <!-- 批量修改考勤时间 -->
        <my-dialog :title="'批量修改上班时间'" :width="'1000px'" :show.sync="isShowMutiTime" :confirmText="'提交'" @close="closeMutiTime" @confirm="submintMutiTime">
            <clock-count-times slot="dialog-content"></clock-count-times>
        </my-dialog>
        <my-dialog :title="'批量修改特殊日期'" :width="'1200px'" :show.sync="isShowSpecialDate" :confirmText="'提交'" @close="closeSpecialDate" @confirm="submitMutiSpecialDate">
            <special-dates slot="dialog-content" :status="'muti'"></special-dates>
        </my-dialog>
    </div>
</template>

<script>
import TableData from '@/components/common/TableData'
import MyDialog from '@/components/common/MyDialog'
import InfoTag from '@/components/checkgroup/infoTag'
import SiteTag from '@/components/checkgroup/siteTag'
import TimeTag from '@/components/common/TimeTag'
import SpecialDateTag from '@/components/checkgroup/specialDateTag'
import ClockCountTimes from '@/components/checkgroup/clockCountTimes'
import SpecialDates from '@/components/checkgroup/specialDates'
import utils from '@/utils/utils'
import {mapState,mapMutations,mapActions} from 'vuex'
export default {
    data() {
        return {
            mutiItem: {left: [{className:'el-icon-edit-outline',nameText:'修改上班时间',event:'mutiTime'},{className:'el-icon-date',nameText:'特殊日期设置',event:'specialDate'}],
                        right: [{nameText:'创建考勤组',className:'el-icon-circle-plus-outline',event: 'showCreate'}]},
            // tableSort: {prop:'date',order: 'descending'},
            // ----------------------搜索考勤组---------------------------
            searchInfo: {},
            formItem: [{type:'input',placeholder: '考勤组名称',label: 'name'},{label:'officeName',placeholder:'考勤地点',type:'input'},
                        {label:'type',nameText:'打卡方式',type:'mutiSelect',options:[{label:'蓝牙',value:0},{label:'WIFI',value:1},{label:'GPS',value:4}]},
                        {label:'creator',placeholder:'创建人',type:'input'},{label:'city',nameText:'所在城市',type:'mutiSelect',options:[]},
                        {type:'button',btnType:'primary',nameText:'搜索'}],
            // -------------------------考勤组展示-------------------------
            head:[{key: 'name',name:'考勤组名称'},{key: 'officeAndClockTypes',name:'考勤地点/打卡方式'},{key: 'counttime',name:'打卡次数/作息时段'},{key: 'scheduleType',name:'班次类型'},{key: 'city',name:'所在城市'},
                    {key: 'creator',name:'创建人'},{key: 'updateTime',name:'更新时间',sortable: true},{key: 'workDay',name:'工作日设置'}],
            clockGroupData: [],
            clockGroupLoading: false,
            option:[{name: '查看',type:1,event: 'chooseTable'},{name: '编辑',type:1,event: 'editTable'},{name:'删除',type:2,event: 'delTable'}],
            groupNumber: 0,
            // -------------------------查看考勤组-------------------------
            innerShow: false,
            userHead: [{key:'name',name: '姓名'},{key:'username',name: '用户账号'},{key:'mobile',name: '手机号'},{key:'hisgroup',name: '当前考勤组'},{key:'organ',name: '组织'}],
            addUser: [],
            emptyText: '还没有添加考勤组成员！',
            selectedGroup: [],
            // --------------批量操作考勤组-------------------
            isShowMutiTime: false,       //是否显示修改时间界面
            // --------------批量操作特殊日期-------------------
            isShowSpecialDate: false,

            // --------------创建考勤组-------------------
            isShowCreate: false,
            type: 1,
            name: '',
            id: '',        //创建考勤组成功后的id
            // ----------------查看考勤组信息----------------
            isShowSee: false,
            groupInfo: {},
            workType : ['固定班次','排班制'],
            workDayShow: [],      //根据点击的打卡次数及打卡时间设置显示的数组对象
            workday: '',           //工作日设置
            
        }
    },
    mounted() {
        //获取考勤组数据
        this.getGroup()
        this.getCity()
    },
    computed: {
        ...mapState({
            clockOrder: state => state.group.clockOrder,
            specialDate: state => state.group.specialDate,
            countData: state => state.group.countData,
        })
    },
    components: {TableData,MyDialog,InfoTag,SiteTag,TimeTag,SpecialDateTag,ClockCountTimes,SpecialDates},
    methods: {
        ...mapMutations({
            setName: 'group/setName',
            setId: 'group/setId',
            setClockOrder: 'group/setClockOrder',
            clearCountData: 'group/clearCountData',
            clearDate: 'group/clearDate',
        }),
        ...mapActions({
            addGroup:'group/addGroup',
            submitSpecialDate: 'group/submitSpecialDate',
            getAddClockUser: 'group/getAddClockUser',
            getInitialDate: 'group/getInitialDate',
        }),
        //获取考勤组数据
        getGroup(page=1,size=20,name='',officeName='',clockType=[],creator='',city=[]) {
            this.clockGroupLoading = true
            this.$axios({
                url: `/es/clockGroups/_search?page=${page}&size=${size}`,
                method: 'post',
                data: {name,officeName,clockType,creator,city}
            }).then(res=> {
                if(res) {
                    console.log('获取考勤组数据',res)
                    this.clockGroupData = res.content
                    this.groupNumber = res.recordCount
                    this.clockGroupLoading = false
                }
            }).catch(err=> {
                console.log(err)
            })
        },
        //获取城市信息
        getCity: function() {
            this.$axios({
                url: '/es/clockGroups/getCity',
                method: 'post'
            }).then(res=> {
                console.log('成功获取城市列表',res)
                if(res) {
                    let list = []
                    res.forEach(item=> {
                        list.push({id: item,name: item})
                    })
                    this.formItem[4].options = list
                } 
            })
        },
        //翻页
        nextGroup: function(val) {
            this.getGroup(val,20)
        },
        closeCreate: function() {
            this.isShowCreate = false
        },
        cancelCreate: function() {
            this.isShowCreate = false
        },
        showCreate: function() {
            this.name = ''
            this.type = 0
            this.isShowCreate = true
        },
        //展示已选择考勤组或释放全部
        async showSlectGroup(val) {
           val ? this.clockGroupData = this.selectedGroup : this.getGroup()
        },
        //添加考勤组-----------------
        goCreate: function() {
            // if(!this.groupName) return this.$message.error('请先填写考勤组名称')
            let [name,type] = [this.name,this.type]
            this.addGroup({name,type}).then(res=> {
                console.log(res)
                this.$message.success('创建考勤组成功！')
                this.isShowCreate = false
                this.$router.push('create_clock_group')
            })
        },
        //搜索考勤组
        search: function() {
            let {name,office,type,creator,city} = this.searchInfo
            this.getGroup(1,20,name,office,type,creator,city)
        },
        //查看考勤组------------------------------------
        async getClockGroup(scope) {
            this.groupInfo = scope.row
            await this.getAddClockUser(scope.row.clockGroupId).then(res=> {
                this.groupInfo.userNum = res ? res.length : 0
                this.addUser = res
            })
            this.showWorkDayType(this.groupInfo)
            this.workday = this.groupInfo.workDay.join(';')
            await this.getInitialDate(scope.row.clockGroupId).then(res=> {
                this.groupInfo.specialDate = res 
            })
            this.isShowSee = true
        },
        //格式化考勤组成员数据
        formatUser: function(val) {
            return val ? val : '无'
        },
        //展示考勤组用户
        showUsers: function() {
            this.innerShow = true
        },
        //编辑考勤组
        goEdit: function() {
            this.$router.push('edit_clock_group')
        },
        closeSee: function() {
            this.isShowSee = false
        },
        closeInner: function() {
            this.innerShow = false
        },
        //编辑考勤组--------------------------------------
        editClockGroup: function(scope) {
            this.setId(scope.row.clockGroupId)
            this.setName(scope.row.name)
            this.$router.push({
                name: 'edit_clock_group',
                params: {
                    name: scope.row.name
                }    
            })
        },
        //删除考勤组---------------------------------------
        delClockGroup: function(scope) {
            this.$axios({
                url: `/es/clockGroups/delete?id=${scope.row.clockGroupId}`,
                method: 'post',
            }).then(res => {
                this.$message.success(res)
                this.getGroup()
            }).catch(err=> {
                console.log(err)
            })
        },
        //调整考勤组数据展示**************
        showWorkDayType: function(val) {
            let time = val.scheduleItems
            switch(val.clockTimes) {
                case 2:
                    this.workDayShow = [{text:'工作时段',time: [time[0].startTime,time[0].endTime]},{text:'休息时段',time: [time[1].startTime,time[1].endTime]}]
                    break
                case 4:
                    this.workDayShow = [{text:'工作时段1',time: [time[0].startTime,time[0].endTime]},{text:'工作时段2',time: [time[1].startTime,time[1].endTime]}]
                    break
                case 6:
                    this.workDayShow = [{text:'工作时段1',time: [time[0].startTime,time[0].endTime]},{text:'工作时段2',time: [time[1].startTime,time[1].endTime]},
                            {text:'工作时段3',time: [time[2].startTime,time[2].endTime]}]
            }
        },
        //批量操作考勤组------------------------------------------
            //修改考勤时间
        mutiTime: function() {
            this.clearCountData()
            this.setClockOrder({clockTimes: 2})
            this.clearDate()
            this.isShowMutiTime = true
        },
            //关闭修改考勤时间界面
        closeMutiTime: function() {
            this.isShowMutiTime = false
        },
            //提交修改时间
        submintMutiTime: function() {
            let clockGroupId = this.selectedGroup.map(item=> item.clockGroupId)
            let {clockTimes} = this.clockOrder
            let scheduleItem = utils.dealTimeData(this.countData,this.clockOrder.clockTimes)
            this.$axios({
                url: '/es/regularSchedules/editWorkTime',
                method: 'post',
                data: {clockGroupId,clockTimes,scheduleItem}
            }).then(res=> {
                if(res) {
                    this.$message.success(res)
                    this.getGroup()
                    this.isShowMutiTime = false
                }
            })
        },
            //显示修改特殊日期界面
        showSpecialDate: function() {
            this.setClockOrder({clockTimes: 2})
            this.clearCountData()
            this.clearDate()
            this.isShowSpecialDate = true
        },
            //提交修改特殊日期
        submitMutiSpecialDate: function() {
            let ids = this.selectedGroup.map(item=> item.clockGroupId)
            this.submitSpecialDate(ids).then(res=> {
                this.$message.success(res)
                this.getGroup()
                this.isShowSpecialDate = false
            })
        },
        closeSpecialDate: function() {
            this.isShowSpecialDate = false
        },
        //****************格式化表格数据 */
        format: function(cellvalue,property,row) {
            if(property == 'workDay') {
                return cellvalue && cellvalue.length ? cellvalue.join(';') : '无'
            } 
            if(property == 'scheduleType') {
                let list = ['固定班次','排班制']
                return list[cellvalue]
            }
            if(property == 'city') {
                return cellvalue && cellvalue.length ? cellvalue.join(';') : '无'
            }
            if(property == 'officeAndClockTypes') {
                const value = ['蓝牙', 'WIFI', '', '', 'GPS']
                const list = []
                if(cellvalue && cellvalue.length) {
                    cellvalue.forEach(item=> {
                        const str = []
                        item.clockType.forEach(i=>str.push(value[i]))
                        if(item) list.push(item.officeName + '/' + str.join(';'))
                    })
                }
                return cellvalue && cellvalue.length ? list.join('<br>') : '无'
            }
            if(property == 'counttime') {
                const list = []
                if(row.scheduleItems && row.scheduleItems.length ) {
                    row.scheduleItems.forEach(item=> {
                        list.push([item.startTime,item.endTime])
                    })
                }
                if(!row.clockTimes) return '无'
                if(row.clockTimes === 2) {
                    return `${row.clockTimes} / 工作时间：${list[0][0]}-${list[0][1]}；休息时间：${list[1][0]}-${list[1][1]}`
                } else if(row.clockTimes === 6) {
                    return `${row.clockTimes} / ${list[0].join('-')}；${list[1].join('-')}；${list[2].join('-')}`
                }else if(row.clockTimes === 4) {
                    return `${row.clockTimes} / ${list[0].join('-')}；${list[1].join('-')}`
                }
            }
            else {
                return cellvalue ? cellvalue : '无'
            }
        },
        changeMutiSelect: function(val1,val2) {
            this.searchInfo[val2] = val1
        },
        mutiSelect: function(val) {
            this.selectedGroup = val
        },
    }
}
</script>

<style lang="scss" scoped>
    .clockgroup-manage {
        .create-group {
            .tip {
                font-size: 12px;
                color: #bbb;
                white-space: normal;
                line-height: 16px;
            }
            .clock-type {
                display: flex;
                margin-top: 30px;
                .text {
                    width: 70px;
                    p {
                        white-space: nowrap;
                        font-style: normal;
                        color: #666666;
                        font-size: 12px;
                    }
                }
                .radio-wrapper {
                    display: flex;
                    flex-direction: column;
                    margin-left: 20px;
                    .el-radio {
                        /deep/ .el-radio__label {
                            font-size: 12px;
                        }
                        &:last-child {
                            margin-top: 20px;
                            /deep/ .el-radio__label {
                                letter-spacing: 5px;
                                font-size: 12px;
                                span {
                                   letter-spacing: 0; 
                                }
                            }
                        }
                    }
                    // 班次设置tip文字样式
                    .radioTip {
                        color: #bbb;
                        font-size: 12px;
                        display: inline-block;
                        margin-left: 20px;
                    }
                }
            }
        }

        .site-content {
            margin-top: 10px;
            width: 416px;
        }
        .order-head {
            color: #666;
            font-size: 12px;
            span {
                &:first-child {
                    margin-right: 6px;
                }
            }
        }
        .order-content {
            margin-top: 20px;
            display: grid;
            width: 720px;
            grid-template-columns: 1fr 1fr 1fr;
        }

    }
</style>

