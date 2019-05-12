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
            name: 'home',
            component: resolve => require(['@/views/home'], resolve),
            meta: { title: '首页' }
        }]
    },
    {
        path: '/usermanage',
        component: layout,
        children: [{
            path: '',
            name: 'usermanageex',
            component: resolve => require(['@/views/usermanage'], resolve),
            meta: { title: '用户管理' }
        }]
    },
    {
        path: '/work1',
        component: layout,
        children: [{
            path: '',
            name: 'work1',
            component: resolve => require(['@/views/holiday'], resolve),
            meta: { title: '节假日' }
        }]
    },
    {
        path: '/checkgroup',
        component: layout,
        children: [{
                path: '/checkgroup',
                component: resolve => require(['@/views/checkgroup'], resolve),
                name: 'cerategroup',
                meta: { title: '创建考勤组' }
            },
            {
                path: '/checksite',
                component: resolve => require(['@/views/checkgroup/checksite'], resolve),
                name: 'ceratesite',
                meta: { title: '创建考勤地点' }
            },
        ]
    }
]

export default staticRoute