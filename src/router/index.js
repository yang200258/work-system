import Vue from 'vue'
import store from '../store'
import VueRouter from 'vue-router'
import routes from './staticRoute'
import Auth from '@/utils/auth'
import whiteList from './whiteList'

Vue.use(VueRouter)
const router = new VueRouter({
    mode: 'hash',
    base: (process.env.NODE_ENV === 'production') ? '/' : '/',
    routes
})

// 路由跳转前验证
router.beforeEach((to, from, next) => {
    // 开启进度条

    // 判断用户是否处于登录状态
    // debugger
    if (Auth.isLogin()) {
        // 如果当前处于登录状态，并且跳转地址为login，则自动跳回系统首页
        // 这种情况出现在手动修改地址栏地址时
        // console.log('跳转后路径',to);
        console.log('跳转路径', from, to)
        if (to.path === '/login') {
            next({ path: "/home", replace: true })
        } else if (to.path.includes("/error")) {
            // 防止因重定向到error页面造成beforeEach死循环
            next()
        } else {
            next()
        }
    } else {
        // 如果是免登陆的页面则直接进入，否则跳转到登录页面
        if (whiteList.includes(to.path)) {
            // console.log('该页面无需登录即可访问')
            next()
        } else {
            console.warn('当前未处于登录状态，请登录')
            next({ path: "/login", replace: true })
                // 如果store中有token，同时Cookie中没有登录状态
            if (store.state.user.token) {
                this.$message.warn({
                    message: '登录超时，请重新登录'
                })
            }
        }
    }
})

export default router