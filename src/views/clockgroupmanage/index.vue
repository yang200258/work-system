<template>
    <div class="clockgroup-manage">
        <section class="clockgroup-content">
            <table-data :head="head" :tableData="clockGroupData" :tableLoading="clockGroupLoading" :option="option" @chooseTable="getClockGroup" @editTable="editClockGroup" @delTable="delClockGroup" 
                :format="format" :data="searchInfo" :formData="formItem" @btnClick="search" @changeMutiSelect="changeMutiSelect" :mutiItem="mutiItem" @showCreate="showCreate" @mutiTime="mutiTime"
                @specialDate="specialDate" @currentChange="nextGroup">
            </table-data>
        </section>
        <!-- 创建考勤组名称弹窗 -->
        <my-dialog :title="'新建考勤组'" :width="'500px'" :show.sync="isShowCreate" :isCancel="true" :confirmText="'提交'" @close="closeCreate" @cancel="cancelCreate" class="create-group" @confirm="goCreate">
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
        <my-dialog :title="'查看考勤组信息'" :width="'80%'" :show.sync="isShowSee" :isCancel="true" :confirmText="'编辑'" @close="closeSee" @cancel="closeSee" @confirm="goEdit" :cancelText="'关闭'">
            <template slot="dialog-content" class="show-clockgroup-content">
                <info-tag :text="'考勤组名称'" :info="groupInfo.name"></info-tag>
                <info-tag :text="'考勤组成员'">
                    <p slot="info-tag">共有<span style="color:#409EFF;text-decoration: underline;cursor:pointer">{{groupInfo.users}}</span>个成员</p>
                </info-tag>
                <info-tag :text="'考勤地点'">
                    <div class="site-content" slot="info-tag">
                        <site-tag :siteData="groupInfo.clockType" :isEdit="false"></site-tag>
                    </div>
                </info-tag>
                <info-tag :text="'班次信息'">
                    <div class="order-head" slot="info-tag">
                        <span>{{workType[groupInfo.workType]}}</span>
                        <span>每天{{groupInfo.clockCount}}次打卡</span>
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
import utils from '@/utils/utils'
import {mapState,mapMutations,mapActions} from 'vuex'
export default {
    data() {
        return {
            mutiItem: {left: [{className:'el-icon-edit-outline',nameText:'批量考勤班次编辑',event:'mutiTime'},{className:'el-icon-date',nameText:'批量特殊日期设置',event:'specialDate'}],
                        right: [{nameText:'创建考勤组',className:'el-icon-circle-plus-outline',event: 'showCreate'}]},
            // ----------------------搜索考勤组--------------------
            searchInfo: {},
            formItem: [{type:'input',placeholder: '考勤组名称',label: 'name'},{label:'officeName',placeholder:'考勤地点',type:'input'},
                        {label:'type',nameText:'打卡方式',type:'mutiSelect',options:[{label:'蓝牙',value:0},{label:'WIFI',value:1},{label:'GPS',value:2}]},
                        {label:'creator',placeholder:'创建人',type:'input'},{label:'city',nameText:'所在城市',type:'mutiSelect',options:[]},
                        {type:'button',btnType:'primary',nameText:'搜索'}],
            // -------------------------考勤组展示-------------------------
            head:[{key: 'name',name:'考勤组名称'},{key: 'siteType',name:'考勤地点/打卡方式'},{key: 'counttime',name:'打卡次数/作息时段'},{key: 'type',name:'班次类型'},{key: 'city',name:'所在城市'},
                    {key: 'creator',name:'创建人'},{key: 'updateTime',name:'更新时间'},{key: 'workDay',name:'工作日设置'}],
            clockGroupData: [],
            clockGroupLoading: false,
            option:[{name: '查看',type:1,event: 'chooseTable'},{name: '编辑',type:1,event: 'editTable'},{name:'删除',type:2,event: 'delTable'}],
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
    },
    computed: {
        ...mapState({
            // name: state=> state.group.name,
        })
    },
    components: {TableData,MyDialog,InfoTag,SiteTag,TimeTag,SpecialDateTag},
    methods: {
        ...mapMutations({
            setName: 'group/setName'
        }),
        ...mapActions({
            'addGroup':'group/addGroup'
        }),
        //获取考勤组数据
        getGroup: function(page=1,size=20,name='',officeName='',clockType=[],creator='',city='') {
            this.clockGroupLoading = true
            this.$axios({
                url: `/es/clockGroups/_search?page=${page}&size=${size}`,
                method: 'post',
                data: {name,officeName,clockType,creator,city}
            }).then(res=> {
                if(res) {
                    this.clockGroupData = res
                    this.clockGroupLoading = false
                }
            }).catch(err=> {
                console.log(err)
                this.clockGroupLoading = false
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
        getClockGroup: function(scope) {
            this.groupInfo = scope.row
            this.showWorkDayType(this.groupInfo)
            this.workday = utils.filterWorkDay(this.groupInfo.workday)
            this.isShowSee = true
        },
        //编辑考勤组
        goEdit: function() {
            this.$router.push('edit_clock_group')
        },
        closeSee: function() {
            this.isShowSee = false
        },
        //编辑考勤组--------------------------------------
        editClockGroup: function(scope) {
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
                url: '/es/clockGroups/delete',
                method: 'post',
                data: {id: scope.row.id}
            }).then(res => {
                this.$message.success(res)
                this.getGroup()
            }).catch(err=> {
                this.$message.error(err)
            })
        },
        //调整考勤组数据展示**************
        showWorkDayType: function(val) {
            switch(val.clockCount) {
                case 2:
                    this.workDayShow = [{text:'工作时段',time: val.clockTime[0]},{text:'休息时段',time: val.clockTime[1]}]
                    break
                case 4:
                    this.workDayShow = [{text:'工作时段1',time: val.clockTime[0]},{text:'工作时段2',time: val.clockTime[1]}]
                    break
                case 6:
                    this.workDayShow = [{text:'工作时段1',time: val.clockTime[0]},{text:'工作时段2',time: val.clockTime[1]},{text:'工作时段3',time: val.clockTime[2]}]
            }
        },
        //批量操作考勤组------------------------------------------
            //修改考勤时间
        mutiTime: function() {

        },
            //修改特殊日期
        specialDate: function() {

        },
        //****************格式化表格数据 */
        format: function(cellvalue,property) {
            if(property == 'clockType') {
                let [site,clockType,district,list] = ['','','',[]]
                cellvalue.forEach(item=> {
                    site = item.site
                    clockType = utils.filterClockType(item.clockType)
                    if(item.gpsDistrict) {
                        district = item.gpsDistrict
                    }
                    let siteInfo = (item.gpsDistrict) ? `<span style="white-space:nowrap;">${site} / ${clockType}(${district}米)</span>` : `<span style="white-space:nowrap;">${site} / ${clockType}</span>`
                    list.push(siteInfo)
                })
                return list.join('<br>')
            } 
            if(property == 'workday') {
                return utils.filterWorkDay(cellvalue)
            } 
            if(property == 'workType') {
                return this.workType[cellvalue]
            } 
            if(property == 'clockCount') {
                return cellvalue
            } 
            else {
                return cellvalue
            }
        },
        changeMutiSelect: function(val1,val2) {
            this.searchInfo[val2] = val1
        }
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
            span {
                &:first-child {
                    margin-right: 20px;
                }
            }
        }
        .order-content {
            margin-top: 20px;
            display: flex;
        }

    }
</style>

