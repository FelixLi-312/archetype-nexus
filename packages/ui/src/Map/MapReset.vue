<script setup lang="ts">
import { inject } from 'vue'

const props = defineProps({
  /** 按钮位置 */
  position: {
    type: String as () => 'topright' | 'topleft' | 'bottomright' | 'bottomleft',
    default: 'bottomright'
  }
})

const resetView = inject<() => void>('resetView')

const handleReset = () => {
  if (resetView) {
    resetView()
  }
}
</script>

<template>
  <div :class="['map-reset', position]">
    <div class="reset-btn" @click="handleReset" title="复位">
      <svg viewBox="0 0 24 24" width="20" height="20">
        <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6V18M6,12H18" />
        <path fill="currentColor" d="M12,8L8,12L12,16M12,8L16,12L12,16" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.map-reset {
  position: absolute;
  z-index: 1000;
  margin: 10px;
}

.topright { top: 0; right: 0; }
.topleft { top: 0; left: 0; }
.bottomright { bottom: 0; right: 0; }
.bottomleft { bottom: 0; left: 0; }

.reset-btn {
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

.reset-btn:hover {
  background: #f4f4f4;
  color: #409eff;
}
</style>
