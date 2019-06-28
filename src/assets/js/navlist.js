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
                path: '/sysset/clock_group_manage',
                name: '考勤组管理',
            },
            {
                path: '/sysset/clocksite',
                name: '考勤地点管理',
            },
        ]
    },
    {
        name: '设备管理',
        path: '',
        child: [{
                path: '/device_manage/bluetooth',
                name: '蓝牙设备管理'
            },
            {
                path: '/device_manage/wifi',
                name: 'WIFI设备管理'
            }
        ]
    },
    {
        name: '管理员页面',
        path: '',
        child: [{
            path: '/manager/device_manage',
            name: '设备管理'
        }]
    },
    {
        name: '假期管理',
        path: '',
        child: [{
                path: '/rest/rest_manage',
                name: '假种管理'
            },
            {
                path: '/rest/rest_list',
                name: '请假清单'
            },
            {
                path: '/rest/rest_statics',
                name: '假期统计'
            },
            {
                path: '/rest/rest_num',
                name: '假期额度管理'
            }
        ]
    }
]

export default [{
    data: data
}]