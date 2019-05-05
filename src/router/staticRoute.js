import layout from '@/views/layout'
const staticRoute = [{
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        component: resolve => require(['@/views/login'], resolve)
    },
    {
        path: '/home',
        name: 'home',
        component: layout,
        children: [{
            path: '',
            name: 'homeed',
            component: resolve => require(['@/views/home'], resolve),
            meta: { name: '首页' }
        }]
    },
    {
        path: '/usermanage',
        name: 'usermanage',
        component: layout,
        children: [{
            path: '',
            name: 'usermanageex',
            component: resolve => require(['@/views/usermanage'], resolve),
            meta: { name: '用户管理' }
        }]
    },
    {
        path: '/work1',
        name: 'work1',
        component: layout,
        children: [{
            path: '',
            name: 'work1',
            component: resolve => require(['@/views/holiday'], resolve),
            meta: { name: '节假日' }
        }]
    },
    {
        path: '/checkgroup',
        name: 'checkgroup',
        component: layout,
        children: [{
            path: '',
            name: 'checkgroup',
            component: resolve => require(['@/views/checkgroup'], resolve),
            meta: { name: '创建考勤组' }
        }]
    }
]

export default staticRoute