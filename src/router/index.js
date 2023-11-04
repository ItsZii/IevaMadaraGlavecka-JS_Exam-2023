import { createRouter, createWebHistory } from 'vue-router'
import {useAuthStore} from "../stores/auth.js";

// Importējam vēlamos skatus kurus gribam izmantot
import Login from '../views/Login.vue'
import Songs from '../views/Songs.vue'
import Albums from '../views/Albums.vue'
import About from '../views/About.vue'

const routes = [
    {
        path: '/login',
        name: 'login',
        component: Login,
    },

    {
        path: '/',
        name: 'songs',
        component: Songs,
    },

    {
        path: '/albums',
        name: 'albums',
        component: Albums,
    },

    {
        path: '/about',
        name: 'about',
        component: About,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    if (!useAuthStore().is_authenticated && to.path !== '/login') {
        next('/login'); 
    }else if(useAuthStore().is_authenticated && to.path === '/login'){
        next(from); 
    }else{
        next(); 
    }
});

export default router