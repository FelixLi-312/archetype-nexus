// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'
import { useUserStore } from '@/store/modules/user'
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
        component: () => import('@/views/dashboard/index.vue'),
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
      }
    ]
  },
  // 404 page must be placed at the end !!!
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: { hidden: true }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 白名单路由
const whiteList = ['/login', '/register', '/404']

router.beforeEach(async (to) => {
  const userStore = useUserStore()
  const hasToken = userStore.token
  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，跳转到首页
      return { path: '/' }
    } else {
      // 检查是否有用户信息
      const hasUserInfo = !!userStore.userInfo
      if (hasUserInfo) {
        return true
      } else {
        try {
          // 获取用户信息
          await userStore.getInfo()
          return true
        } catch (_error) {
          // 获取信息失败，清除 token 并跳转登录
          await userStore.clearToken()
          return `/login?redirect=${to.path}`
        }
      }
    }
  } else {
    // 没有 token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      return true
    } else {
      // 否则全部重定向到登录页
      return `/login?redirect=${to.path}`
    }
  }
})

export default router
