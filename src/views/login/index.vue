<template>
    <div class="login-container">
        <article class="login-content">
            <el-form :model="loginForm" :rules="loginRule" ref="loginForm" label-position="left" label-width="0px">
                <h3 class="title">考勤系统登录</h3>
                <el-form-item prop="username">
                    <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="请输入密码" v-on:keyup.enter.native="loginRequest"></el-input>
                </el-form-item>
                <el-form-item prop="identityCode" v-if="identityCode">
                    <el-input type="text" v-model="loginForm.identityCode" auto-complete="off" placeholder="验证码"></el-input>
                    <img src="" alt="">
                </el-form-item>
                <el-checkbox v-model="checked" class="remember">记住密码</el-checkbox>
                <el-form-item style="width:100%;">
                    <el-button type="primary" style="width:100%;" @click.native.prevent="loginRequest" :loading="logining">登录</el-button>
                </el-form-item>
            </el-form>
        </article>
    </div>
</template>

<script>
import {mapMutations,mapActions} from 'vuex'
// import MyForm from '@/components/common/MyForm'
export default {
    data() {
        return {
            loginForm: {username:'',password: '',identityCode: ''},
            loginRule: {username: [{required: true,message: '请输入用户名',trigger: 'blur'}],
                        password: [{required: true,message: '请输入密码',trigger: 'blur'}]},
            logining: false,
            checked: false,
            identityCode: ''
        }
    },
    methods: {
        ...mapMutations({
            setRootNode: 'setRootNode'
        }),
        ...mapActions({
            login:'auth/login',
            getAccountDetail: 'auth/getAccountDetail',
            getOrganization: 'getOrganization'
        }),
        //登录请求
        loginRequest: function() {
            this.$refs.loginForm.validate(valid=> {
                if(valid) {
                    this.logining = true
                    this.authLogin(this.loginForm.username,this.loginForm.password)
                } else {
                    this.logining = false
                }
            })
        },
        //登录封装方法(登录、获取用户详情、获取机构信息)
        async authLogin(username,password) {
            let login = await this.login({username,password})
            if(login) {
                let detail = await this.getAccountDetail()
                if(detail.userId) {
                    this.logining = false
                    this.$message.success('登录成功！')
                    this.$router.push('home')
                    //获取最高层级机构信息
                    let res = await this.getOrganization({id:0,level:0})
                    this.setRootNode(res)
                } else {
                    this.$message.error(detail.msg)
                    this.logining = false
                }
            } else {
                this.$message.error('登录异常')
                this.logining = false
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .login-container {
        background-image: url('../../assets/images/login.jpeg');
        background-repeat: no-repeat;
        background-size: 100%;
        background-attachment: fixed;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .login-content {
            -webkit-border-radius: 5px;
            border-radius: 5px;
            -moz-border-radius: 5px;
            background-clip: padding-box;
            margin: 0 auto;
            width: 25%;
            padding: 35px 35px 15px 35px;
            background: #fff;
            border: 1px solid #eaeaea;
            box-shadow: 0 0 25px #cac6c6;
            .title {
                margin: 0px auto 40px auto;
                text-align: center;
                color: #505458;
            }
        }
        .remember {
            margin: 0px 0px 35px 0px;
        }
    }
</style>
