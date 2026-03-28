/** * 表格工具栏组件 * 用于展示表格的操作按钮，如新增、删除、导出等 * 支持自定义按钮配置和权限校验
*/
<template>
  <div v-if="hasContent" class="pro-table-toolbar">
    <div class="toolbar-left">
      <slot name="left"></slot>
      <el-button
        v-for="(btn, idx) in leftButtons"
        :key="'l-' + idx"
        v-bind="btn"
        @click="btn.onClick"
      >
        {{ btn.label }}
      </el-button>
    </div>
    <div class="toolbar-right">
      <el-button
        v-for="(btn, idx) in rightButtons"
        :key="'r-' + idx"
        v-bind="btn"
        @click="btn.onClick"
      >
        {{ btn.label }}
      </el-button>

      <!-- 导出按钮 -->
      <el-button
        v-if="exportable"
        icon="Download"
        type="success"
        size="small"
        @click="$emit('export')"
      >
        导出 Excel
      </el-button>

      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ToolbarButtonConfig } from '../types'

const props = defineProps<{
  toolbar?: ToolbarButtonConfig[]
  exportable?: boolean
}>()

defineEmits<{
  (e: 'export'): void
}>()

const hasContent = computed(() => {
  return (props.toolbar && props.toolbar.length > 0) || props.exportable
})

const leftButtons = computed(() => props.toolbar?.filter((b) => b.position !== 'right') || [])
const rightButtons = computed(() => props.toolbar?.filter((b) => b.position === 'right') || [])
</script>

<style scoped>
.pro-table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}
.toolbar-left,
.toolbar-right {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
