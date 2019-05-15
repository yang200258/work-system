var data = [{
        name: '用户管理',
        path: '/userManage',
        auth: '',
    },
    {
        name: '节假日',
        auth: '',
        path: '/work1',
    },
    {
        name: '系统设置',
        auth: '',
        path: '',
        child: [{
                path: '/checkgroup',
                name: '创建考勤组',
            },
            {
                path: '/clocksite',
                name: '考勤地点管理',
            },
        ]
    },
]

export default [{
    data: data
}]