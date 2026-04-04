<template>
  <section class="app-main">
    <div class="main-content">
      <router-view v-slot="{ Component, route }">
        <component :is="Component" :key="route.path" />
      </router-view>
    </div>
  </section>
</template>

<script setup lang="ts">
// 逻辑很简单，主要是样式和过渡
</script>

<style scoped>
.app-main {
  background-color: #f0f2f5;
  height: calc(100vh - 60px); /* 减去 header 高度 */
  padding: 20px;
  position: relative;
  overflow: hidden;
}
.main-content {
  background-color: #fff;
  height: 100%;
}

/* 页面切换动画 */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>
