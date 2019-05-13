<template>
    <div class="checkgroup-container">
        <el-form :model="groupInfo" label-position="right" label-width="140px">
            <el-form-item label="考勤组名称" prop="name">
                <el-input size="small" v-model="groupInfo.name" placeholder="如未填写，系统会通过地点、班次类型自动填写（固定班次填时间，排班填“排班制”）"></el-input>
            </el-form-item>
            <el-form-item label="考勤组组员" prop="users" class="group-user">
                <el-input type="textarea" size="small" v-model="groupInfo.users"></el-input>
                <el-button type="primary" size="mini" @click.prevent="editUser.isShowEdit = true">编辑组员</el-button>
            </el-form-item>
            <el-form-item label="考勤地点" prop="site">
                <el-button type="primary" size="small" icon="el-icon-edit" @click.prevent="showAddSite">添加</el-button>
                <div class="site">
                    <site-tag v-for="(item,i) in siteData" :siteData="item" :key="i"></site-tag>
                </div>
            </el-form-item>
            <el-form-item label="班次类型" prop="workType">
                <el-radio-group v-model="groupInfo.workType" class="radio-wrapper">
                    <el-radio :label="1">固定班次<span class="radioTip">每天的考勤时间一样</span></el-radio>
                    <el-radio :label="2">排班制<span class="radioTip">自定义设置考勤时间</span></el-radio>
                </el-radio-group>
            </el-form-item>
            <div class="worktype-container">
                <!-- 固定班次 -->
                <div class="fix" v-if="groupInfo.workType === 1">
                    <!-- 工作时间设置 -->
                    <div class="time">
                        <el-form-item prop="worktime" label="打卡次数">
                            <clock-count :countData="groupInfo.worktime"></clock-count>
                        </el-form-item>
                    </div>
                    <!-- 工作日设置 -->
                    <div class="day">
                        <el-form-item prop="workday" label="工作日设置">
                            <div class="workday">
                                <el-checkbox-group v-model="groupInfo.workday" @change="handleCheckedCitiesChange">
                                    <el-checkbox v-for="day in days" :label="day" :key="day">{{day}}</el-checkbox>
                                </el-checkbox-group>
                                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                            </div>
                            <el-checkbox v-model="groupInfo.autorest" class="autorest">法定节假日自动排休</el-checkbox>
                        </el-form-item>
                    </div>
                    <!-- 特殊日期设置 -->
                    <div class="specialday">
                        <el-form-item prop="specialday" label="特殊日期设置">
                            <special-day v-for="(item,i) in specialtime" :key="item.tipText" :tipText="item.tipText" :showLayer="item.showLayer" @choose="choose(i)" :timeData="timeData" :type="i"
                            @confirm="saveConfirm()" class="special-wrapper"></special-day>
                        </el-form-item>
                    </div>
                </div>
                <!-- 排班制，后期增加 -->
                <div class="scedul" v-if="groupInfo.workType === 2">
                    
                </div>
            </div>
        </el-form>
        <!-- 编辑组员弹窗 -->
        <my-dialog :title="editUser.title" :show.sync="editUser.isShowEdit" :width="'70%'" @close="closeEdit" :center="true" @confirm="confirm" :confirmText="editUser.confirmText"
            :isCancel="true" @cancel="cancel">
            <div class="edit-wrapper" slot="dialog-content" style="position: relative">
                <el-row> <el-button size="mini" plain @click.prevent="isSelectPart = !isSelectPart">按部门添加</el-button> </el-row>
                <select-tree v-if="isSelectPart" style="position: absolute ;top: 0px; left: 8%;z-index:999"></select-tree>
                <el-row>
                    <table-data v-slot:default="props" :head="head" :tableData="tableData" :isSelected="false"  :isEditTable="false" :isDeleteTable="false" :totalNumber="total" :pageSize="pageSize">
                        <img slot="option" src="../../assets/images/del.png" class="delImg" @click.prevent="delUser(props)">
                    </table-data>
                </el-row>
            </div>
        </my-dialog>
        <!-- 添加地点弹窗 -->
        <my-dialog :title="addSite.title" :show.sync="addSite.isShowEdit" :width="'60%'" @close="closeAdd" :center="true" :isConfirm="false">
            <div slot="dialog-content" class="site-wrapper">
                <header>
                    <div class="search">
                        <el-input placeholder="请输入地点名称" suffix-icon="el-icon-search" size="mini" v-model="search"> </el-input>
                        <el-input placeholder="请输入城市" v-model="city" size="mini"> </el-input>
                    </div>
                    <el-button type="primary" size="mini" @click.prevent="createSite">创建</el-button>
                </header>
                <section>
                    <table-data v-slot:default="props" :head="sitehead" :tableData="siteTableData" :isSelected="false"  :isEditTable="false" :isDeleteTable="false" :totalNumber="total" :pageSize="pageSize">
                        <div class="option" slot="option">
                            <el-button type="success" size="mini" @click.prevent="querySite(props)">查看</el-button>
                            <el-button type="primary" size="mini" @click.prevent="chooseSite(props)">选择</el-button>
                        </div>
                    </table-data>
                </section>
            </div>
        </my-dialog>
        <footer>
            <el-button type="primary" size="medium" @click="saveClockGroup">保存</el-button>
        </footer>
    </div>
</template>


<script>
import SpecialDay from '@/components/checkgroup/specialDay'
import SiteTag from '@/components/checkgroup/siteTag'
import ClockCount from '@/components/checkgroup/clockCount'
import MyDialog from '@/components/common/MyDialog'
import TableData from '@/components/common/TableData'
import SelectTree from '@/components/common/SelectTree'

const days = ['周一','周二','周三','周四','周五','周六','周日']
export default {
    data() {
        return {
            // 创建考勤组设置
            groupInfo:{name: '',users: '',site: [],workType:1,worktime:{type: 0,time: []},workday:[],autorest: false,specialday: {work:[],rest: []}},
            // 渲染周一至周日
            days:days,
            // 全选数据
            checkAll: false,
            // 工作日全选设置
            isIndeterminate: true,
            // 渲染指定日期数据源
            specialtime: [{tipText:'指定上班日',showLayer: {title: '添加指定上班日',isShowEdit:false}},{tipText:'指定休息日',showLayer: {title: '添加指定休息日',isShowEdit:false}}],
            // 特殊日期数据
            timeData: {date: '',time: [{worktime:['00:00','23:59'],quit: true,key: new Date(),here: true}]},
            // 地点标签数据
            siteData:[{city: '北京',site: '雍和航星园',type: 'GPS;蓝牙；wifi'},{city: '海口',site: '海南大厦',type: 'GPS;蓝牙；wifi'}], 
            // ----------------编辑考勤组成员数据------------------------
            //渲染编辑考勤组成员
            editUser:{title: '编辑考勤组成员',isShowEdit: false,confirmText: '提交'},
            //是否按部门添加考勤组成员
            isSelectPart: false,
            head: [{key:'avater',name: '头像'},{key:'username',name: '用户账号'},{key:'name',name: '姓名'},{key:'mobile',name: '手机号'},{key:'email',name: '邮箱'},{key:'hisgroup',name: '历史考勤组'},
                    {key:'organ',name: '组织'}],
            //考勤组成员信息
            tableData: [{avater:'https://p.ssl.qhimg.com/dmfd/400_300_/t0120b2f23b554b8402.jpg',username: 'yqq',name: 'qqy',mobile: '888888888',email: '888888888',hisgroup: '1号',organ:'2号'}],
            total: 0,
            pageSize: 0,
            // ------------添加考勤地点数据-------------------
            addSite: {title: '添加考勤地点',isShowEdit: false,confirmText: '提交'},
            //搜索地点信息
            search:'',
            //城市信息
            city:'',
            sitehead: [{key: 'city',name: '城市'},{key: 'sitename',name: '地点名称'},{key: 'style',name: '打卡方式'},{key: 'group',name: '应用考勤组'}],
            siteTableData: [{city: '海口',sitename: '海南大厦',style: 'GPS',group: '产品中心考勤组'}]
        }
    },
    components: {
        SpecialDay,SiteTag,MyDialog,TableData,SelectTree,ClockCount
    },
    methods: {
        //全选按钮工作日激活操作
        handleCheckAllChange(val) {
            this.groupInfo.workday = val ? days : [];
            this.isIndeterminate = false;
        },
         //全部选择工作日激活操作
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.days.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.days.length;
        },
        //点击选择按钮弹出特殊日期类别
        choose: function(i) {
            this.specialtime[i].showLayer.isShowEdit = true
        },
        //特殊日期保存
        saveConfirm: function(data) {
            console.log(data);
        },
        // ----------------编辑考勤组成员方法------------------------
        //关闭编辑考勤组成员页面
        closeEdit: function() {
            this.editUser.isShowEdit = false
        },
        // 提交保存编辑考勤组成员信息
        confirm: function() {
            this.editUser.isShowEdit = false
        },
        // 取消编辑考勤组成员信息
        cancel:function() {
            this.editUser.isShowEdit = false
        },
        //删除考勤组成员
        delUser: function(data) {
            console.log(data);
        },
        // ------------添加考勤地点方法-------------------
        // 关闭
        closeAdd: function() {
            this.addSite.isShowEdit = false
        },
        //展示
        showAddSite: function() {
            this.addSite.isShowEdit = true
        },
        //创建考勤地点
        createSite: function() {
            this.addSite.isShowEdit = false
            this.$router.push('checksite')
        },
        //查看考勤地点
        querySite: function(scope) {
            console.log(scope);
        },
        //选择考勤地点
        chooseSite: function(scope) {
            console.log(scope);
        },
        //保存提交创建考勤组信息
        saveClockGroup: function() {
            
        }
    }
}
</script>


<style lang="scss" scoped>
$leftWidth:80px;
    .checkgroup-container {
        width: 70%;
        .group-user {
            position: relative;
            .el-button {
                background-color: #CBEBF8;
                color: #3366FF;
                border: none;
                position: absolute;
                right: -100px;
                top: 0;
            }
        }
    // 班次设置tip文字样式
    .radioTip {
        color: #bbb;
        font-size: 12px;
        display: inline-block;
        margin-left: 20px;
    }
        
        .worktype-container {
            font-size: 14px;
            color: #606266;
            margin-left: $leftWidth;
            .fix {
                .time {
                    /deep/ .el-form-item__content {
                        margin-left: 180px!important;
                    }
                }
                .day {
                    .el-form-item {
                        /deep/ .el-form-item__content {
                            margin-left: 180px!important;
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
                        .autorest {
                            /deep/ .el-checkbox__label {
                                text-decoration: underline;
                            }
                        }
                    }
                }
                .specialday {
                    .el-form-item {
                        .special-wrapper {
                            margin-left: 40px;
                        }
                    }
                }
            }
        }
        footer {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 100px 0;
        }
        // 编辑考勤组成员中表格距离顶部样式
        .edit-wrapper {
            .el-row {
                &:last-child {
                    margin-top: 20px;
                }
                .delImg {
                    width: 30px;
                }
            }
        }
        .site-wrapper {
            header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 40px;
                .el-input {
                    width: 200px;
                    margin-right: 20px;
                }
                .el-button {
                    position: relative;
                    right: 0;
                    width: 80px;
                }
            }
        }
    }
</style>
