<script setup lang="ts">
import { ref } from 'vue'
import type { MapType } from './types'

defineProps({
  /** 当前地图类型 */
  modelValue: {
    type: String as () => MapType,
    default: 'tdt'
  },
  /** 面板位置 */
  position: {
    type: String as () => 'topright' | 'topleft' | 'bottomright' | 'bottomleft',
    default: 'topright'
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const options: { label: string; value: MapType; icon?: string }[] = [
  { label: '标准地图', value: 'tdt' },
  { label: '天地图影像', value: 'tdt_img' },
  { label: '地形晕渲', value: 'tdt_terrain' },
]

const isOpen = ref(false)

const select = (val: MapType) => {
  emit('update:modelValue', val)
  emit('change', val)
  isOpen.value = false
}
</script>

<template>
  <div :class="['map-switcher', position]">
    <div class="switcher-btn" @click="isOpen = !isOpen">
      <svg viewBox="0 0 24 24" width="20" height="20">
        <path fill="currentColor" d="M12 2L1 7L12 12L23 7L12 2M1 12L12 17L23 12M1 17L12 22L23 17" />
      </svg>
    </div>

    <div v-if="isOpen" class="switcher-panel">
      <div 
        v-for="opt in options" 
        :key="opt.value"
        :class="['switcher-item', { active: modelValue === opt.value }]"
        @click="select(opt.value)"
      >
        {{ opt.label }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.map-switcher {
  position: absolute;
  z-index: 1000;
  margin: 10px;
}

.topright { top: 0; right: 0; }
.topleft { top: 0; left: 0; }
.bottomright { bottom: 0; right: 0; }
.bottomleft { bottom: 0; left: 0; }

.switcher-btn {
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
  margin-left: auto;
}

.switcher-btn:hover {
  background: #f4f4f4;
}

.switcher-panel {
  margin-top: 5px;
  background: #fff;
  border-radius: 4px;
  padding: 5px;
  box-shadow: 0 1px 5px rgba(0,0,0,0.4);
  min-width: 100px;
}

.switcher-item {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 13px;
  color: #333;
  border-radius: 2px;
}

.switcher-item:hover {
  background: #f0f0f0;
}

.switcher-item.active {
  color: #409eff;
  font-weight: bold;
  background: #ecf5ff;
}
</style>
