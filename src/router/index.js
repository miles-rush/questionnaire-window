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
            path: '/hello',
            name: 'Hello',
            component: () => import('../components/HelloWorld.vue')
        },
        { path: '/', redirect: { name: 'Hello' } }
    ]
})

export default router

