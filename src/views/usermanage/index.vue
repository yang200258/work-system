<template>
    <div class="usermanage-container">
        <div class="usermanage-head">
            <el-form :model="queryUser" ref="queryForm" label-position="right" label-width="auto">
                <div class="header">
                    <div class="show-info">
                        <el-form-item prop="username" label="姓名/账号" label-width="auto">
                            <el-input style="width:200px;" type="text" v-model="queryUser.username" auto-complete="off" placeholder="请输入员工姓名/员工账号" size="mini"></el-input>
                        </el-form-item>
                        <el-form-item prop="department" label="所属部门">
                            <select-tree :loadNode="loadNode" :id.sync="returnArray" :tipText="tipText"></select-tree>
                        </el-form-item>
                        <el-form-item prop="userType" label="员工类型">
                            <el-select v-model="queryUser.userType" multiple placeholder="全部" collapse-tags size="mini">
                                <el-option v-for="item in userTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="role" label="角色">
                            <el-select v-model="queryUser.role" multiple placeholder="全部" collapse-tags size="mini">
                                <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="query-info">
                        <div class="more-condition">
                            <img v-if="!showMore" src="@/assets/images/arrowup.png" alt="" @click.prevent="showMore = !showMore">
                            <img v-else src="@/assets/images/arrowdown.png" alt=""  @click.prevent="showMore = !showMore">
                        </div>
                        <el-button type="primary" @click.prevent="quertUser" size="mini">查询</el-button>
                    </div>
                </div>
                <transition name="more">
                    <div v-if="showMore" class="more">
                        <el-form-item prop="checkGroup" label="考勤组">
                            <el-select v-model="checkGroup" multiple placeholder="全部" :class="{'demo-select': true}" collapse-tags  size="mini" ref="selectGroup">
                                <el-option v-for="item in checkGroupOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="accountStatus" label="账号状态">
                            <el-select v-model="queryUser.accountStatus" multiple placeholder="全部" collapse-tags  size="mini">
                                <el-option v-for="item in accountStatusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </transition>
            </el-form>
        </div>
        <div class="usermanage-content">
            <el-row>
                <el-button type="primary" size="mini">添加</el-button>
                <el-button type="primary" size="mini">导出</el-button>
                <el-button type="primary" size="mini">导入</el-button>
            </el-row>
            <table-data :head="head" :tableData="tableData" :tableLoading="loading" :isSelected="true" :isOption="true" :isEditTable="true"
             :editTableName="'编辑'" :isDeleteTable="true" :deleteTableName="'停用'" :isPagination="true"  :totalNumber="total" @currentChange="currentChange"
             @editTable="editUser" @deleteTable="stopUse"></table-data>
        </div>
    </div>
</template>

<script>
import SelectTree from '@/components/common/SelectTree.vue'
import TableData from '@/components/common/TableData'
export default {
    data() {
        return {
            queryUser:{username:'',department:[],userType:[],role:[],checkGroup:[],accountStatus: ''},
            queryRule: {username: [{required: true,message: '请输入用户名',trigger: 'blur'}]},
            userTypeOptions: [{label:'正式员工',value: 'regular'},{label:'劳派员工',value: 'regular2'},{label:'外包员工',value: 'regular3'}],
            roleOptions: [{label:'正式员工',value: 'regular'},{label:'劳派员工',value: 'regular2'},{label:'外包员工',value: 'regular3'}],
            checkGroupOptions: [{label:'考勤组1',value: 'regular'},{label:'考勤组2',value: 'regular2'},{label:'考勤组3',value: 'regular3'}],
            accountStatusOptions: [{label:'休假',value: 'regular'},{label:'离职',value: 'regular2'},{label:'正常',value: 'regular3'}],
            isShowSelect: false,
            returnArray: [],
            rootNode:[],
            tipText:'',
            checkGroup: [],
            head: [{key: 'name',name: '姓名'},{key: 'username',name: '账号'},{key: 'organizationName',name: '部门'},{key: 'employeeId',name: '工号'},{key: 'role',name: '角色'},
                    {key: 'type',name: '员工类型'},{key: 'group',name: '考勤组'},{key: 'status',name: '账号状态'}],
            loading: false,
            tableData: [],
            total: 0,
            active: true,
            optionStyle: {},
            editStyle: {},
            delStyle: {},
            showMore: false,
        }
    },
    components: {
        SelectTree,
        TableData,
    },
    watch: {

    },
    mounted() {
        //获取最高层级机构信息
        this.getOrganization().then(res=> {
            this.rootNode = res
            this.tipText = res[0].name
        })
        //获取用户
        this.queryUserGroup()
    },
    methods: {
        //获取机构数据
        getOrganization: function(id = 0,level = 0){
            return new Promise((resolve,reject)=> {
                this.$axios({
                    url:`/sys/organizations?id=${id}&level=${level}`,
                    method: 'get',
                }).then(res=> {
                    console.log('查询到的机构数据',res)
                    if(res && res.length) {
                        resolve(res)
                    } else {
                        reject(res)
                    }
                })
            })
        },
        //异步加载机构数据
        loadNode: function(node,resolve) {
            console.log(node)
            if (node.level === 0) {
                return resolve(this.rootNode)
            } else {
                this.getOrganization(node.data.id,1).then(res=> {
                    let data = this._.dropWhile(res,function(o) {return o.id == node.data.id })
                    return resolve(data)
                })
            }
        },
        //获取用户列表（页面初始数据）
        queryUserGroup: function(oid=0,page=0,size=20) {
            this.loading = true
            this.$axios({
                url: `/sys/users?oid=${oid}&page=${page}&size=${size}`,
                method: 'get',
            }).then(res=> {
                console.log(res);
                if(res && res.content &&res.content.length) {
                    this.tableData = res.content
                    this.total = res.totalPages
                }
                this.loading = false
            }).catch(err=> {
                console.log(err);
            })
        },
        //查询用户
        quertUser: function(page=0 ,search={oid:'',q: ''}, size=20) {
            this.loading = true
            this.$axios({
                url: '/sys/users/_search',
                method: 'post',
                data: {
                    page,size,search
                }
            }).then(res=> {
                if(res) {
                    this.tableData = res.content
                    this.total = res.totalPages
                }
                this.loading = false
            }).catch(err=> {
                console.log(err);
            })
        },
        //翻页
        currentChange: function(val) {
            this.queryUserGroup(0,val,20)
        },
        //编辑用户信息
        editUser: function() {
            this.$message.error('开发中,勿急！')
        },
        stopUse: function() {
            this.$message.error('开发中,勿急！')
        },
        //格式化数据
        // formatter: function(row, column,cellValue, index) {
        //     console.log(row, column,cellValue, index);
        // }
    }
}
</script>
<style lang="scss" scoped>
    .usermanage-container {
        margin:0 4%;
        .usermanage-head {
            //未封装前表单样式
            .header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                position: relative;
                margin-bottom: 20px;
                .show-info {
                    display: flex;
                    align-items: center;
                    .el-form-item {
                        padding-right: 100px;
                        margin-bottom: 0;
                    }
                }
                .query-info {
                    display: flex;
                    align-items: center;
                    padding-right: 100px;
                    .more-condition{
                        height: 20px;
                        width: 20px;
                        background-color: #409EFF;
                        display: flex;
                        align-items: center;
                        border-radius: 5px;
                        margin:0 15px;
                        img {
                            display: block;
                            margin: 0 auto;
                            &:hover {
                                cursor: pointer;
                            }
                        }
                    }
                }
            }
            .more {
                display: flex;
                .el-form-item {
                    padding-right: 107px;
                    margin-bottom: 0;
                }
            }
            .more-enter,.more-leave-to /* .fade-leave-active below version 2.1.8 */ {
                opacity: 0;
                height: 0;
            }
            .more-enter-active, .more-leave-active {
                transition: all .3s;
            }
            .more-enter-to,.more-leave{
                opacity: 1;
                height: 41px;
            }
        }
        .usermanage-content {
            padding-top: 40px;
            .el-row {
                margin-bottom: 30px;
            }
        }
    }
        
</style>
<style lang="scss">
// 添加select选择框全局样式
    .el-select {
        .el-select__tags {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            .el-tag--info {
                width:100%;
                display: flex;
                overflow: hidden;
                text-overflow: ellipsis;
                .el-select__tags-text {
                    width: 80%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .el-icon-close {
                    margin: auto;
                }
            }
        }
    }
</style>
