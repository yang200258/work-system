import layout from '@/views/layout'
const staticRoute = [{
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: resolve => require(['@/views/login'], resolve)
    },
    {
        path: '/home',
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
        component: layout,
        children: [{
                path: '',
                name: 'checkgroup',
                component: resolve => require(['@/views/checkgroup'], resolve),
                meta: { name: '创建考勤组' }
            },
            {
                path: '/checksite',
                component: resolve => require(['@/views/checkgroup/checksite'], resolve),
                meta: { name: '创建考勤地点' }
            },
        ]
    }
]

export default staticRoute