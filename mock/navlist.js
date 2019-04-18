var data = [{
        path: '/home',
        name: '首页'
    },
    {
        name: '报名管理',
        path: '/signup',
    },
    {
        name: '用户管理',
        path: '',
        child: [{
            path: '',
            name: '',
        }]
    },
    {
        name: '考勤统计',
        child: [{
            path: '',
            name: '',
        }]
    },
    {
        name: '考勤组',
        child: [{
            path: '',
            name: '',
        }]
    },
    {
        name: '假期管理',
        child: [{
            path: '',
            name: '',
        }]
    },
    {
        name: '规则配置',
        path: ''
    }
]

export default [{
    path: '/user/navlist',
    data: data
}]