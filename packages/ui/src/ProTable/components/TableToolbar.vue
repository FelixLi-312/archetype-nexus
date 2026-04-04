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

      <!-- 列设置 -->
      <el-popover placement="bottom" :width="200" trigger="click">
        <template #reference>
          <el-button icon="Setting" size="small">列设置</el-button>
        </template>
        <div class="column-setting-list" ref="columnListRef">
          <div v-for="(col, index) in columns" :key="col.prop || index" class="column-setting-item">
            <el-icon class="drag-handle" style="cursor: move; margin-right: 8px"><Operation /></el-icon>
            <el-checkbox v-model="col.visible" :label="col.label" />
          </div>
        </div>
      </el-popover>

      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {  Operation } from '@element-plus/icons-vue'
import type { ToolbarButtonConfig, ColumnConfig } from '../types'
import Sortable, { SortableEvent } from 'sortablejs'

const props = defineProps<{
  toolbar?: ToolbarButtonConfig[]
  exportable?: boolean
  columns?: ColumnConfig[]
}>()

const emit = defineEmits<{
  (e: 'export'): void
  (e: 'column-sort', columns: ColumnConfig[]): void
}>()

const columnListRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (columnListRef.value) {
    Sortable.create(columnListRef.value, {
      animation: 150,
      handle: '.drag-handle',
      onEnd: (evt: SortableEvent) => {
        const { oldIndex, newIndex } = evt
        if (oldIndex !== undefined && newIndex !== undefined && props.columns) {
          const newColumns = [...props.columns]
          const [movedItem] = newColumns.splice(oldIndex, 1)
          newColumns.splice(newIndex, 0, movedItem)
          emit('column-sort', newColumns)
        }
      }
    })
  }
})

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
.column-setting-list {
  max-height: 300px;
  overflow-y: auto;
}
.column-setting-item {
  padding: 4px 0;
  display: flex;
  align-items: center;
}
.drag-handle {
  color: #909399;
}
</style>
