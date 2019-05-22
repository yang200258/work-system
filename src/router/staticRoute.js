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
        path: '/sysset',
        component: layout,
        children: [{
                path: 'clock_group_manage',
                component: resolve => require(['@/views/clockgroupmanage'], resolve),
                name: 'clock_group_manage',
                meta: { title: '考勤组管理' },
            },
            {
                path: 'create_clock_group',
                component: resolve => require(['@/views/clockgroupmanage/createClockGroup'], resolve),
                name: 'create_clock_group',
                meta: { title: '创建考勤组' }
            },
            {
                path: 'create_clock_site',
                component: resolve => require(['@/views/checksite'], resolve),
                name: 'create_clock_site',
                meta: { title: '创建考勤地点' }
            },
            {
                path: 'clocksite',
                component: resolve => require(['@/views/clocksite'], resolve),
                name: 'clocksitemanage',
                meta: { title: '考勤地点管理' }
            },
        ]
    },
    {
        path: '/device_manage',
        component: layout,
        children: [{
                path: 'bluetooth',
                component: resolve => require(['@/views/bluetooth'], resolve),
                name: 'bluetooth',
                meta: { title: '蓝牙设备管理' }
            },
            {
                path: 'wifi',
                component: resolve => require(['@/views/wifi'], resolve),
                name: 'wifi',
                meta: { title: 'WIFI设备管理' }
            }
        ]
    }
]

export default staticRoute