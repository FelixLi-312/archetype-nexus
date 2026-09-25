import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true, title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/login/register.vue'),
    meta: { hidden: true, title: '注册' }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error-page/404.vue'),
    meta: { hidden: true, title: '404' }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard/index.vue'),
        meta: { title: '仪表盘', icon: 'Location' }
      },
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/Home/index.vue'),
        meta: { title: '首页', icon: 'Home' }
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('@/views/About/index.vue'),
        meta: { title: '关于', icon: 'About' }
      },
      {
        path: 'pro-table',
        name: 'ProTableDemo',
        component: () => import('@/views/ProTableDemo/index.vue'),
        meta: { title: 'ProTable 示例', icon: 'Menu' }
      },
      {
        path: 'vxe-table',
        name: 'VxeTableDemo',
        component: () => import('@/views/VxeTableDemo/index.vue'),
        meta: { title: 'VxeTable 示例', icon: 'Menu' }
      },
      {
        path: 'report-table',
        name: 'report-table',
        component: () => import('@/views/Report/index.vue'),
        meta: { title: '报表示例', icon: 'Menu' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: { hidden: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
