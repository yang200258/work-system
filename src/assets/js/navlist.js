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
        name: '创建考勤组',
        auth: '',
        path: '/checkgroup',
        // child: [{
        //         path: '/manager/manager',
        //         name: '管理员管理',
        //     },
        //     {
        //         path: '/manager/oganization',
        //         name: '机构管理',
        //     },
        //     {
        //         path: '/manager/signTeacher',
        //         name: '报名老师管理',
        //     }
        // ]
    },
    {
        name: '用户权限管理',
        auth: '',
        path: '/work23',
        child: [{
                path: '/manager/manager',
                name: '管理员管理',
            },
            {
                path: '/manager/oganization',
                name: '机构管理',
            },
            {
                path: '/manager/signTeacher',
                name: '报名老师管理',
            }
        ]
    },
    {
        name: '假期管理',
        auth: '',
        path: '/work28',
        child: [{
                path: '/manager/manager',
                name: '管理员管理',
            },
            {
                path: '/manager/oganization',
                name: '机构管理',
            },
            {
                path: '/manager/signTeacher',
                name: '报名老师管理',
            }
        ]
    },
    {
        name: '系统设置',
        auth: '',
        path: '/work245',
        child: [{
                path: '/manager/manager',
                name: '管理员管理',
            },
            {
                path: '/manager/oganization',
                name: '机构管理',
            },
            {
                path: '/manager/signTeacher',
                name: '报名老师管理',
            }
        ]
    },
]

export default [{
    data: data
}]