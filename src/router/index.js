import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/home',
            name: 'Home',
            component: () => import('../components/Base.vue')
        },
        {
            path: '/main',
            name: 'Main',
            component: () => import('../components/Main.vue')
        },
        {
            path: '/list',
            name: 'List',
            component: () => import('../components/List.vue')
        },
        {
            path: '/menu',
            name: 'Menu',
            component: () => import('../components/Menu.vue')
        },
        {
            path: '/config',
            name: 'Config',
            component: () => import('../components/Config.vue')
        },
        {
            path: '/splite',
            name: 'Splite',
            component: () => import('../components/Splite.vue')
        },
        { path: '/', redirect: { name: 'Menu' } }
    ]
})

export default router

