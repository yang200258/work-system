<template>
    <div class="usermanage-container">
        <div class="usermanage-head">
            <el-form :model="queryUser" ref="queryForm" label-position="right" label-width="80px">
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-form-item prop="username" label="姓名/账号">
                        <el-input type="text" v-model="queryUser.username" auto-complete="off" placeholder="请输入员工姓名/员工账号" size="mini"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item prop="department" label="所属部门">
                        <select-tree :loadNode="loadNode" :id.sync="returnArray" :tipText="tipText"></select-tree>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item prop="userType" label="员工类型">
                        <el-select v-model="queryUser.userType" multiple placeholder="全部" collapse-tags size="mini">
                            <el-option v-for="item in userTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item prop="role" label="角色">
                        <el-select v-model="queryUser.role" multiple placeholder="全部" collapse-tags size="mini">
                            <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <div class="query-info">
                    <div class="more-condition">
                        <img src="@/assets/images/Double arrow up.png" alt="">
                    </div>
                    <el-button type="primary" @click.prevent="quertUser" size="mini">查询</el-button>
                </div>
                
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-form-item prop="checkGroup" label="考勤组">
                        <!-- <select-all :data.sync="queryUser.checkGroup" :options="checkGroupOptions"></select-all> -->
                        <el-select v-model="checkGroup" multiple placeholder="全部" :class="{'demo-select': true}" collapse-tags  size="mini" ref="selectGroup">
                            <el-option v-for="item in checkGroupOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item prop="accountStatus" label="账号状态">
                        <el-select v-model="queryUser.accountStatus" multiple placeholder="全部" collapse-tags  size="mini">
                            <el-option v-for="item in accountStatusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row >
                <el-button type="primary" size="mini">添加</el-button>
                <el-button type="primary" size="mini">导出</el-button>
                <el-button type="primary" size="mini">导入</el-button>
            </el-row>
        </el-form>
        </div>
        <div class="usermanage-content">
            <table-data :head="head" :tableData="tableData" :tableLoading="loading" :isSelected="true" :isOption="true" :isEditTable="true"
             :editTableName="'编辑'" :isDeleteTable="true" :deleteTableName="'停用'" :isPagination="true"  :totalNumber="total" @currentChange="currentChange"
             @editTable="editUser" @deleteTable="stopUse"></table-data>
        </div>
    </div>
</template>

<script>
import SelectTree from '@/components/common/SelectTree.vue'
// import SelectAll from '@/components/common/SelectAll'
import TableData from '@/components/common/tableData'
export default {
    data() {
        return {
            queryUser:{username:'',department:[],userType:[],role:[],checkGroup:[],accountStatus: ''},
            // queryRule: {username: [{required: true,message: '请输入用户名',trigger: 'blur'}]},
            userTypeOptions: [{label:'正式员工',value: 'regular'},{label:'劳派员工',value: 'regular2'},{label:'外包员工',value: 'regular3'}],
            roleOptions: [{label:'正式员工',value: 'regular'},{label:'劳派员工',value: 'regular2'},{label:'外包员工',value: 'regular3'}],
            checkGroupOptions: [{label:'考勤组1',value: 'regular'},{label:'考勤组2',value: 'regular2'},{label:'考勤组3',value: 'regular3'}],
            accountStatusOptions: [{label:'休假',value: 'regular'},{label:'离职',value: 'regular2'},{label:'正常',value: 'regular3'}],
            props: { label: 'name', children: 'zones'},
            isShowSelect: false,
            returnArray: [],
            rootNode:[],
            tipText:'',
            checkGroup: [],
            head: [{key: 'name',name: '姓名'},{key: 'username',name: '账号'},{key: 'organizationName',name: '部门'},{key: 'employeeId',name: '工号'},{key: 'role',name: '角色'},
                    {key: 'type',name: '员工类型'},{key: 'group',name: '考勤组'},{key: 'status',name: '账号状态'}],
            loading: false,
            tableData: [],
            total: 0
        }
    },
    components: {
        SelectTree,
        // SelectAll,
        TableData
    },
    watch: {
        'checkGroup': function(val) {
            console.log(val);
            if(val.length == this.checkGroupOptions.length) {
                // this.queryUser.checkGroup = val
                // this.checkGroup = ['全部']
            }
        }
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
                    url:`/organizations?id=${id}&level=${level}`,
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
            this.$axios({
                url: `/users?oid=${oid}&page=${page}&size=${size}`,
                method: 'get',
            }).then(res=> {
                console.log(res);
                if(res && res.content &&res.content.length) {
                    this.tableData = res.content
                    this.total = res.totalPages
                }
            }).catch(err=> {
                console.log(err);
            })
        },
        //查询用户
        quertUser: function(page=0 ,search={oid:'',q: ''}, size=20) {
            this.$axios({
                url: '/users/_search',
                method: 'post',
                data: {
                    page,size,search
                }
            }).then(res=> {
                if(res) {
                    this.tableData = res.content
                    this.total = res.totalPages
                }
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
        }
    }
}
</script>
<style lang="scss" scoped>
    .usermanage-container {
        margin:0 4%;
        .usermanage-head {
            .el-row {
                display: flex;
                align-items: center;
                margin-top: 30px;
                .el-form-item {
                    margin: 0;
                }
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
                    }
                }
                .query-info {
                    position: absolute;
                    right: 20px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
        }
        .usermanage-content {
            margin-top: 20px;
        }
        
    }
</style>
