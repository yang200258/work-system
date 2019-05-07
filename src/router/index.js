import Vue from 'vue'
import store from '../store'
import VueRouter from 'vue-router'
import routes from './staticRoute'
import NProgress from 'nprogress'
import Auth from '@/utils/auth'
import whiteList from './whiteList'

Vue.use(VueRouter)
NProgress.configure({ showSpinner: false });
const router = new VueRouter({
        mode: 'history',
        base: (process.env.NODE_ENV === 'production') ? '/home/' : '/',
        routes
    })
    // let permissionList = []

// function initRoute(router) {
//     console.log('router', router);
//     return new Promise((resolve) => {
//         if (permissionList.length == 0) {
//             console.log("没有权限数据，正在获取")
//             store.dispatch('auth/getPermissionList').then((res) => {
//                 console.log("权限列表生成完毕")
//                 permissionList = res
//                 console.log('权限列表为：', permissionList)
//                 res.forEach(function(v) {
//                     let routeItem = router.match(v.path)
//                     console.log('routeItem', routeItem)
//                     if (routeItem) {
//                         routeItem.meta.permission = v.permission ? v.permission : []
//                         routeItem.meta.name = v.name
//                     }
//                 })
//                 resolve()
//             })
//         } else {
//             console.log("已有权限数据")
//             resolve()
//         }
//     })
// }
// 路由跳转前验证
router.beforeEach((to, from, next) => {
    // 开启进度条
    NProgress.start();

    // 判断用户是否处于登录状态
    // debugger
    if (Auth.isLogin()) {
        // 如果当前处于登录状态，并且跳转地址为login，则自动跳回系统首页
        // 这种情况出现在手动修改地址栏地址时
        // console.log('跳转后路径',to);
        console.log('跳转前路径', from);
        if (to.path === '/login') {
            next({ path: "/home", replace: true })
        } else if (to.path.indexOf("/error") >= 0) {
            // 防止因重定向到error页面造成beforeEach死循环
            next()
        } else {
            next()
                // initRoute(router).then(() => {
                //     let isPermission = false
                //     console.log("进入权限判断")
                //     permissionList.forEach((v) => {
                //             // 判断跳转的页面是否在权限列表中
                //             // console.log('to.fullPath',to.fullPath.split('/')[1]);
                //             // console.log('v.path',v.path.split('/')[1]);
                //             if (v.path.split('/')[1] == to.fullPath.split('/')[1]) {
                //                 isPermission = true
                //             }
                //         })
                //         // 没有权限时跳转到401页面
                //     if (!isPermission) {
                //         next({ path: "/error/401", replace: true })
                //     } else {
                //         next()
                //     }
                // })
        }
    } else {
        // 如果是免登陆的页面则直接进入，否则跳转到登录页面
        if (whiteList.indexOf(to.path) >= 0) {
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
            NProgress.done()
        }
    }
})

export default router