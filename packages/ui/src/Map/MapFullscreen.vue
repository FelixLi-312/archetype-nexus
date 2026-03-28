<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  /** 按钮位置 */
  position: {
    type: String as () => 'topright' | 'topleft' | 'bottomright' | 'bottomleft',
    default: 'topright'
  },
  /** 全屏的目标元素选择器，如果不提供则默认为父级地图容器 */
  target: {
    type: String,
    default: ''
  }
})

const isFullscreen = ref(false)
const containerRef = ref<HTMLElement | null>(null)

const toggleFullscreen = () => {
  const element = props.target 
    ? document.querySelector(props.target) 
    : containerRef.value?.parentElement

  if (!element) return

  if (!document.fullscreenElement) {
    element.requestFullscreen().catch(err => {
      console.error(`Error attempting to enable full-screen mode: ${err.message}`)
    })
  } else {
    document.exitFullscreen()
  }
}

const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})
</script>

<template>
  <div ref="containerRef" :class="['map-fullscreen', position]">
    <div class="fullscreen-btn" @click="toggleFullscreen" :title="isFullscreen ? '退出全屏' : '全屏'">
      <svg v-if="!isFullscreen" viewBox="0 0 24 24" width="20" height="20">
        <path fill="currentColor" d="M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z" />
      </svg>
      <svg v-else viewBox="0 0 24 24" width="20" height="20">
        <path fill="currentColor" d="M14,14H19V16H16V19H14V14M5,14H10V19H8V16H5V14M8,5H10V10H5V8H8V5M19,8V10H14V5H16V8H19Z" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.map-fullscreen {
  position: absolute;
  z-index: 1000;
  margin: 10px;
}

.topright { top: 44px; right: 0; } /* 避开复位按钮 */
.topleft { top: 0; left: 0; }
.bottomright { bottom: 0; right: 0; }
.bottomleft { bottom: 0; left: 0; }

.fullscreen-btn {
  width: 34px;
  height: 34px;
  background: #fff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 1px 5px rgba(0,0,0,0.4);
  color: #333;
}

.fullscreen-btn:hover {
  background: #f4f4f4;
  color: #409eff;
}
</style>
