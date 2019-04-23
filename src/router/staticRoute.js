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
    }
]

export default staticRoute