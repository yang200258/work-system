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
            name: 'home',
            component: resolve => require(['@/views/home'], resolve),
            meta: { name: 'home' }
        }]

    }
]

export default staticRoute