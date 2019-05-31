<template>
    <div class="clockgroup-manage">
        <header class="clockgroup-header">
            <my-form :formData="searchInfo" :formItem="formItem" :size="'mini'" :isInline="true" @search="search" @showCreate="showCreate"></my-form>
        </header>
        <section class="clockgroup-content">
            <table-data :head="head" :tableData="clockGroupData" :tableLoading="clockGroupLoading" :option="option" @chooseTable="getClockGroup" @editTable="editClockGroup" @delTable="delClockGroup" 
                :format="format"></table-data>
        </section>
        <!-- 创建考勤组名称弹窗 -->
        <my-dialog :title="'新建考勤组'" :width="'40%'" :show.sync="isShowCreate" :isCancel="true" :confirmText="'提交'" @close="closeCreate" @cancel="cancelCreate" class="create-group" @confirm="goCreate">
            <template slot="dialog-content">
                <my-input :placeholder="groupData.placeholder" :inputData="groupData.info">
                    <template slot="tip">
                        <p class="tip">Tip：推荐按照考勤地点加时间段的方式命名考勤组，如“海南大厦26层-9点至17点30分”</p>
                    </template>
                </my-input>
                <div class="clock-type">
                    <div class="text">
                        <p>班次类型</p>
                    </div>
                    <el-radio-group v-model="clockType" class="radio-wrapper">
                        <el-radio :label="1">固定班次<span class="radioTip">每天的考勤时间一样</span></el-radio>
                        <el-radio :label="2">排班制<span class="radioTip">自定义设置考勤时间</span></el-radio>
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
import MyInput from '@/components/common/MyInput'
import MyForm from '@/components/common/MyForm'
import InfoTag from '@/components/checkgroup/infoTag'
import SiteTag from '@/components/checkgroup/siteTag'
import TimeTag from '@/components/common/TimeTag'
import SpecialDateTag from '@/components/checkgroup/specialDateTag'
import utils from '@/utils/utils'
import {mapMutations} from 'vuex'
export default {
    data() {
        return {
            // ----------------------搜索考勤组--------------------
            searchInfo: {},
            formItem: [{prop:'name',label:'考勤组名称',placeholder:'请输入内容',type:'input',inputType:'text'},{prop:'site',label:'考勤地点',placeholder:'请输入内容',type:'input',inputType:'text'},
                        {prop:'clockType',label:'打卡方式',placeholder:'请选择',type:'select',options:[{name:'蓝牙',value:0},{name:'WIFI',value:1},{name:'GPS',value:2}]},
                        {prop:'user',label:'创建人',placeholder:'请输入内容',type:'input',inputType:'text'},{prop:'city',label:'所在城市',placeholder:'请选择',type:'select',options:[]},
                        {type:'button',buttonType:'primary',text:'搜索',icon:'el-icon-search',event:'search'},{type:'button',buttonType:'primary',text:'添加',icon:'el-icon-edit',event: 'showCreate'}],
            // -------------------------考勤组展示-------------------------
            head:[{key: 'name',name:'考勤组名称'},{key: 'clockType',name:'考勤地点/打卡方式'},{key: 'clockCount',name:'打卡次数/作息时段'},{key: 'workType',name:'班次类型'},{key: 'city',name:'所在城市'},
                    {key: 'user',name:'创建人'},{key: 'time',name:'更新时间'},{key: 'workday',name:'工作日设置'}],
            clockGroupData: [],
            clockGroupLoading: false,
            option:[{name: '查看',type:'success',event: 'chooseTable'},{name: '编辑',type:'primary',event: 'editTable'},{name:'删除',type:'danger',event: 'delTable'}],
            // --------------创建考勤组-------------------
            isShowCreate: false,
            groupData: {placeholder:'请输入考勤组名称',info:''},
            clockType: 1,
            // ----------------查看考勤组信息----------------
            isShowSee: false,
            groupInfo: {},
            workType : ['固定班次','排班制'],
            workDayShow: [],      //根据点击的打卡次数及打卡时间设置显示的数组对象
            workday: '',           //工作日设置
            
        }
    },
    mounted() {
        this.clockGroupData = [{name:'海南大厦26层-8点至17点',clockType:[{id:1,city:'北京',site:'海南大厦',clockType:[0,1,2],gpsDistrict: 100},{id:2,city:'海南',site:'北京大厦',clockType:[0,1]}],
                                clockCount:2,clockTime: [['09:00','17:30'],['09:00','17:30']],workType:0,city:'海口',user:'杨青青',time:'2018-09-09 21:21:21',workday:[true,true,false,false,true,true,false],
                                users:109,specialDate:[{date:'2019-09-09',setting:'休息'},{date:'2019-09-09',setting:'上班'}]}]
    },
    components: {TableData,MyDialog,MyInput,MyForm,InfoTag,SiteTag,TimeTag,SpecialDateTag},
    methods: {
        ...mapMutations({
            setName: 'group/setName'
        }),
        closeCreate: function() {
            this.isShowCreate = false
        },
        cancelCreate: function() {
            this.isShowCreate = false
        },
        showCreate: function() {
            this.isShowCreate = true
        },
        //添加考勤组
        goCreate: function() {
            if(!this.groupData.info) return this.$message.error('请先填写考勤组名称')
            this.isShowCreate = false
            this.$router.push('create_clock_group')
        },
        //搜索考勤组
        search: function() {
            
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
            console.log(scope)
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
        }
    }
}
</script>

<style lang="scss" scoped>
    .clockgroup-manage {
        margin: 0 40px;
        .clockgroup-header {
            margin-bottom: 20px;
            /deep/ .el-form {
                .el-form-item {
                    margin-bottom: 0;
                    &:last-child {
                        position: absolute;
                        right: 100px;
                    }
                }
            }
        }
        .create-group {
            /deep/ .el-dialog__body {
                padding-right: 60px;
            }
            .tip {
                font-size: 13px;
                color: rgb(153, 153, 153);
                white-space: normal;
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
                        font-size: 14px;
                    }
                }
                .radio-wrapper {
                    display: flex;
                    flex-direction: column;
                    margin-left: 20px;
                    .el-radio {
                        &:last-child {
                            margin-top: 40px;
                            /deep/ .el-radio__label {
                                letter-spacing: 5px;
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

