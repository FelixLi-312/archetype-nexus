<template>
  <div class="app-wrapper">
    <el-container class="main-container">
      <!-- 侧边栏 -->
      <el-aside :width="sideWidth" class="sidebar-wrapper">
        <Sidebar :is-collapse="isCollapse" />
      </el-aside>

      <el-container class="main-content">
        <!-- 顶部导航 -->
        <Navbar :is-collapse="isCollapse" @toggle="toggleCollapse" />

        <!-- 主内容 -->
        <AppMain />
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Sidebar from './components/Sidebar.vue'
import Navbar from './components/Navbar.vue'
import AppMain from './components/AppMain.vue'

// 状态管理：侧边栏折叠
const isCollapse = ref(false)

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 动态计算侧边栏宽度
const sideWidth = computed(() => {
  return isCollapse.value ? '64px' : '210px'
})
</script>

<style scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
}

.main-container {
  height: 100vh;
  width: 100%;
  position: relative;
}

.sidebar-wrapper {
  transition: width 0.3s cubic-bezier(0.39, 0.58, 0.57, 1);
  overflow: hidden;
  /* background-color: #304156; */
  /* box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35); */
  z-index: 10;
}

.main-content {
  overflow: hidden; /* 防止内容溢出 */
  flex-direction: column;
}
</style>
