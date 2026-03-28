<template>
  <div class="sidebar-container">
    <div class="logo-container">
      <transition name="logo-fade">
        <div v-if="!isCollapse" class="logo-title">My System</div>
        <div v-else class="logo-icon">MS</div>
      </transition>
    </div>

    <el-menu
      :default-active="activeMenu"
      :collapse="isCollapse"
      unique-opened
      router
      class="el-menu-vertical-demo"
    >
      <template v-for="route in menuRoutes" :key="route.path">
        <!-- 递归或判断是否有子菜单 -->
        <el-sub-menu v-if="hasChildren(route)" :index="resolvePath(route.path)">
          <template #title>
            <el-icon>
              <component :is="getIconComponent(route.meta?.icon as string)" />
            </el-icon>
            <span>{{ route.meta?.title }}</span>
          </template>

          <el-menu-item
            v-for="child in route.children"
            :key="child.path"
            :index="resolvePath(route.path, child.path)"
          >
            <span>{{ child.meta?.title }}</span>
          </el-menu-item>
        </el-sub-menu>

        <el-menu-item v-else :index="resolvePath(route.path)">
          <el-icon>
            <component :is="getIconComponent(route.meta?.icon as string)" />
          </el-icon>
          <template #title>
            <span>{{ route.meta?.title }}</span>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter, type RouteRecordRaw } from 'vue-router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { Document } from '@element-plus/icons-vue' // 默认图标

// 接收父组件传来的折叠状态
defineProps<{
  isCollapse: boolean
}>()

const route = useRoute()
const router = useRouter()

// 模拟 CSS 变量，实际项目中可以从 scss 变量文件导入或直接在 style 中定义
// const variables = {
//   menuBg: '#304156',
//   menuText: '#bfcbd9',
//   menuActiveText: '#409EFF'
// }

// 当前激活的菜单路径
const activeMenu = computed(() => route.path)

// 获取需要显示的菜单路由
const menuRoutes = computed(() => {
  // 假设根路由 '/' 的子路由就是我们要展示的菜单
  const rootRoute = router.options.routes.find((r) => r.path === '/')
  return rootRoute?.children?.filter((r: RouteRecordRaw) => !r.meta?.hidden) || []
})

// 判断是否有子菜单（且子菜单不是 hidden）
const hasChildren = (route: RouteRecordRaw) => {
  if (!route.children) return false
  const visibleChildren = route.children.filter((c) => !c.meta?.hidden)
  return visibleChildren.length > 0
}

// 拼接路径，确保 index 与 route.path 一致
const resolvePath = (basePath: string, childPath?: string) => {
  if (!childPath) return basePath
  if (childPath.startsWith('/')) return childPath
  return `${basePath}/${childPath}`.replace(/\/+/g, '/')
}

// 动态获取图标组件
const getIconComponent = (iconName?: string) => {
  if (!iconName) return Document
  // 从 Element Plus 图标库中查找，找不到则返回默认
  return (ElementPlusIconsVue as any)[iconName] || Document
}
</script>

<style scoped>
.sidebar-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background-color: #2b3a4b; */
  overflow: hidden;
}

.logo-title {
  color: var(--el-menu-text-color);
  font-size: 20px;
  font-weight: bold;
  white-space: nowrap;
}

.logo-icon {
  color: #fff;
  font-size: 24px;
  font-weight: bold;
}

.logo-fade-enter-active,
.logo-fade-leave-active {
  transition: opacity 0.3s;
}
.logo-fade-enter-from,
.logo-fade-leave-to {
  opacity: 0;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 100%;
  /* 注意：这里不需要固定 200px，由父容器 el-aside 控制宽度 */
}
</style>
