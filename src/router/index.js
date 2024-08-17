import { createRouter, createWebHistory } from 'vue-router';

import TaskList from '../components/TaskListComponent.vue'
import Home from '../views/Home.vue'
import LoginView from '../views/LoginView.vue';
import TaskForm from '../components/TaskForm.vue';

const routes = [
    {
        path: '/',
        name: 'Login',
        component: LoginView
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'TaskList',
                component: TaskList,
                meta: { requiresAuth: true }

            },
            {
                path: '/tasks/create',
                name: 'CreateTask',
                component: TaskForm,
            },
            {
                path: '/task/edit/:id',
                name: 'EditTask',
                component: TaskForm,
                props: true,
                meta: { requiresAuth: true }

            },
        ]
    },
    {
        path: '/:catchAll(.*)',  // Catch-all route for unmatched paths
        redirect: to => {
            const isAuthenticated = true; // Replace with your actual authentication check
            return isAuthenticated ? '/home' : '/'; // Redirect to home if authenticated, else login
        }
    }

]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const isAuthenticated = true;

    if (to.meta.requiresAuth && !isAuthenticated) {
        next({ name: 'Login' });
    } else {
        next();
    }
})

export default router