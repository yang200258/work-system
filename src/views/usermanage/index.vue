<template>
    <div class="usermanage-container">
        <el-form :model="queryUser" ref="queryForm" label-position="right" label-width="80px">
            <el-row :gutter="20" justify="center" align="middle">
                <el-col :span="6">
                    <el-form-item prop="username" label="姓名/账号">
                        <el-input type="text" v-model="queryUser.username" auto-complete="off" placeholder="请输入员工姓名/员工账号"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item prop="department">

                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item prop="userType" label="员工类型">
                        <el-select v-model="queryUser.userType" multiple placeholder="全部">
                            <el-option v-for="item in userTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item prop="role" label="角色">
                        <el-select v-model="queryUser.role" multiple placeholder="全部">
                            <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <div class="more-condition">
                    <img src="@/assets/image/Double arrow up.png" alt="">
                </div>
                <el-col :span="2"><el-button type="primary" @click.prevent="queryUserGroup">查询</el-button></el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item prop="checkGroup" label="考勤组">
                        <el-select v-model="queryUser.checkGroup" multiple placeholder="全部">
                            <el-option v-for="item in checkGroupOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item prop="accountStatus" label="账号状态">
                        <el-select v-model="queryUser.accountStatus" multiple placeholder="全部">
                            <el-option v-for="item in accountStatusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-button type="primary" @click="test">添加</el-button>
                <el-button type="primary">导出</el-button>
                <el-button type="primary">导入</el-button>
            </el-row>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            queryUser:{username:'',department:[],userType:[],role:[],checkGroup:[],accountStatus: ''},
            // queryRule: {username: [{required: true,message: '请输入用户名',trigger: 'blur'}]},
            userTypeOptions: [{label:'正式员工',value: 'regular'},{label:'劳派员工',value: 'regular2'},{label:'外包员工',value: 'regular3'}],
            roleOptions: [{label:'正式员工',value: 'regular'},{label:'劳派员工',value: 'regular2'},{label:'外包员工',value: 'regular3'}],
            checkGroupOptions: [{label:'易建科技海口考勤组',value: 'regular'},{label:'易建科技海口考勤组',value: 'regular2'},{label:'易建科技海口考勤组',value: 'regular3'}],
            accountStatusOptions: [{label:'休假',value: 'regular'},{label:'离职',value: 'regular2'},{label:'正常',value: 'regular3'}]
        }
    },
    methods: {
        test: function(){
            this.$axios({
                url:'/organizations',
                method: 'get',
                data: {
                    
                }
            }).then(res=> {
                console.log(res);
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    .usermanage-container {
        .el-row {
            display: flex;
            align-items: center;
            margin-top: 30px;
            .el-form-item {
                margin: 0;
            }
            .more-condition{
                height: 30px;
                width: 30px;
                background-color: #409EFF;
                display: flex;
                align-items: center;
                border-radius: 5px;
                margin-right: 15px;
                img {
                    display: block;
                    margin: 0 auto;

                }
            }
        }
    }
</style>
