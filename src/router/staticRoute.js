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
        component: resolve => require(['@/views/home'], resolve)
    }
]

export default staticRoute