<template>
    <div class="login-container">
        <article class="login-content">
            <el-form :model="loginForm" :rules="loginRule" ref="loginForm" label-position="right">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="loginForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="loginForm.password"></el-input>
                </el-form-item>
            </el-form>
        </article>
        
    </div>
</template>

<script>
export default {
    data() {
        return {
            loginForm: {username:'',password: ''},
            loginRule: {username: [{required: true,message: '请输入用户名',trigger: 'blur'}],
                        password: [{required: true,message: '请输入密码',trigger: 'blur'},
                                   { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }]}
        }
    }
}
</script>

<style lang="scss" scoped>
    .login-container {
        .login-content {
            .el-input {
                // width: 15%;
            }
        }
    }
</style>
