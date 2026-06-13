<template>
  <Teleport to="body">
    <!-- 使用 v-show 配合 transition，保持 DOM 存在以便计算位置 -->
    <transition name="fade">
      <div
        v-show="show"
        ref="mapDialog"
        class="map-dialog"
        :style="{
          left: `${left}px`,
          top: `${top}px`,
          width: `${width}px`,
          height: `${height}px`,
        }"
      >
        <!-- 连线层 -->
        <div class="line-container">
          <div class="line-img"></div>
        </div>
        
        <!-- 内容插槽 -->
        <slot></slot>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, nextTick } from 'vue'

// --- 状态定义 ---
const show = ref(false)
const left = ref(0)
const top = ref(0)
const width = ref(0)
const height = ref(0)
const lnglat = ref([])
const map = ref(null)
const offsetX = ref(null)
const offsetY = ref(null)
const mapDialog = ref(null)

// --- 核心方法 ---

/**
 * 打开弹窗
 * @param {Array} latLng - 经纬度坐标 [lat, lng]
 * @param {Object} options - 配置项
 * @param {Number} options.width - 宽度
 * @param {Number} options.height - 高度
 * @param {Object} options.map - 地图实例
 * @param {Number} options.offsetX - 水平偏移量
 * @param {Number} options.offsetY - 垂直偏移量
 */
const open = (latLng, { width: w, height: h, map: m, offsetX: offX, offsetY: offY }) => {
  map.value = m
  close() // 先关闭旧的

  return new Promise((resolve) => {
    // 使用 setTimeout 确保 DOM 清理完成
    setTimeout(() => {
      width.value = w
      height.value = h
      offsetX.value = offX
      offsetY.value = offY
      lnglat.value = latLng
      
      action() // 计算初始位置
      listen() // 绑定地图事件
      show.value = true
      
      nextTick(() => {
        panTo() // 检查并修正位置（包含全向安全距离检测）
        resolve()
      })
    }, 100)
  })
}

const close = () => {
  show.value = false
  if (map.value) {
    map.value.off('zoom', action)
    map.value.off('move', action)
  }
}

// 监听地图变化
const listen = () => {
  if (map.value) {
    map.value.on('zoom', action)
    map.value.on('move', action)
  }
}

// 计算弹窗相对于地图容器的坐标
const action = () => {
  if (!map.value) return
  let { x, y } = map.value.latLngToContainerPoint(lnglat.value)
  
  // 处理偏移量
  if (offsetX.value) {
    left.value = x - offsetX.value
  } else {
    left.value = x + 20 // 默认向右偏移 20px
  }
  
  if (offsetY.value) {
    top.value = y - offsetY.value
  } else {
    top.value = y - height.value / 2 // 默认垂直居中
  }
}

/**
 * 智能调整地图视口
 * 确保弹窗在上下左右四个方向都有安全距离
 */
const panTo = () => {
  const el = mapDialog.value
  if (!el || !map.value) return

  // 1. 获取弹窗信息
  const popupWidth = el.offsetWidth
  const popupHeight = el.offsetHeight
  const popupLeft = el.offsetLeft
  const popupTop = el.offsetTop

  // 2. 获取地图容器信息
  const mapContainer = map.value.getContainer()
  const mapWidth = mapContainer.clientWidth
  const mapHeight = mapContainer.clientHeight

  // 3. 设定安全边距 (可根据需求调整)
  const SAFE_AREA = {
    top: 152,    // 顶部安全距离 (避开顶部控件)
    bottom: 50,  // 底部安全距离
    left: 20,    // 左侧安全距离
    right: 20    // 右侧安全距离
  }

  let panX = 0
  let panY = 0

  // --- 垂直方向检测 ---

  // 顶部越界：弹窗顶部 < 安全距离
  if (popupTop < SAFE_AREA.top) {
    const diff = SAFE_AREA.top - popupTop
    panY -= diff // 地图向下移 (Y轴负方向)
  }

  // 底部越界：弹窗底部 > 地图高度 - 安全距离
  const popupBottom = popupTop + popupHeight
  if (popupBottom > mapHeight - SAFE_AREA.bottom) {
    const diff = popupBottom - (mapHeight - SAFE_AREA.bottom)
    panY += diff // 地图向上移 (Y轴正方向)
  }

  // --- 水平方向检测 ---

  // 左侧越界：弹窗左侧 < 安全距离
  if (popupLeft < SAFE_AREA.left) {
    const diff = SAFE_AREA.left - popupLeft
    panX -= diff // 地图向右移 (X轴负方向)
  }

  // 右侧越界：弹窗右侧 > 地图宽度 - 安全距离
  const popupRight = popupLeft + popupWidth
  if (popupRight > mapWidth - SAFE_AREA.right) {
    const diff = popupRight - (mapWidth - SAFE_AREA.right)
    panX += diff // 地图向左移 (X轴正方向)
  }

  // 执行平移
  if (panX !== 0 || panY !== 0) {
    map.value.panBy([panX, panY])
  }
}

// --- 暴露接口 ---
defineExpose({
  open,
  close,
})
</script>

<style scoped>
.map-dialog {
  position: absolute;
  z-index: 400;
  /* 确保弹窗内容可见，可根据实际内容添加背景、阴影等 */
  /* background: #fff; */
  /* box-shadow: 0 2px 10px rgba(0,0,0,0.2); */
}

/* 连线容器 */
.line-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* 让鼠标事件穿透 */
  z-index: -1; /* 连线在内容后面 */
}

/* 连线图片样式 */
.line-img {
  width: 120px;
  height: 93px;
  position: absolute;
  left: -120px; /* 向左延伸 */
  top: 40px;    /* 垂直居中微调 */
  /* background-image: url(@/assets/img/new-risk/line.png); */
  background-size: 100% 100%;
  pointer-events: none;
}

/* 简单的淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>