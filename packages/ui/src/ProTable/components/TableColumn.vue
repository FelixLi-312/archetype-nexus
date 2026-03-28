/** * 表格列组件 * 用于展示表格的列数据，支持自定义渲染、权限校验等 */
<template>
  <ElTableColumn
    :prop="col.prop"
    :label="col.label"
    :width="col.width"
    :min-width="col.minWidth"
    :sortable="col.sortable"
    :align="col.align || 'left'"
    :header-align="col.headerAlign || col.align || 'center'"
    :show-overflow-tooltip="col.ellipsis"
    v-if="!col.visible"
  >
    <!-- 情况 A: 有子列 -> 递归渲染 (作为分组头) -->
    <template v-if="col.children && col.children.length">
      <TableColumn v-for="child in col.children" :key="child.prop || child.label" :col="child">
      </TableColumn>
    </template>

    <!-- 情况 B: 无子列 -> 渲染具体内容 (叶子节点) -->
    <template v-if="!col.children || !col.children.length" #default="scope">
      <!-- 1. Render 函数 -->
      <component
        v-if="typeof col.render === 'function'"
        :is="renderFunctionWrapper(col.render, scope)"
      />

      <!-- 2. 动态组件 (字符串名称) -->
      <component v-else-if="typeof col.render === 'string'" :is="col.render" v-bind="scope" />

      <!-- 3. 命名插槽 -->
      <slot
        v-else-if="col.slot"
        :name="col.slot"
        :row="scope.row"
        :column="scope.column"
        :$index="scope.$index"
      >
        {{ getValue(scope.row, col.prop!) }}
      </slot>

      <!-- 4. 默认文本 -->
      <span v-else>{{ getValue(scope.row, col.prop!) }}</span>
    </template>
  </ElTableColumn>
</template>

<script setup lang="ts" name="TableColumn">
import { h } from 'vue'
// 引入自身以实现递归
import type { ColumnConfig } from '../types'

// 注意：在 Vue 3 script setup 中递归引用自身通常不需要显式 import，
// 但如果文件名和组件名不一致，可能需要别名。
// 这里假设文件名为 TableColumn.vue，组件名默认为 TableColumn。
// 如果报错，请添加: import TableColumn from './TableColumn.vue'; 并在 components 中注册

defineProps<{
  col: ColumnConfig
}>()

const renderFunctionWrapper = (
  renderFn: (h: typeof import('vue').h, scope: any) => any,
  scope: any
) => {
  return {
    setup() {
      return () => renderFn(h, scope)
    }
  }
}

const getValue = (obj: any, path: string) => {
  if (!path) return ''
  return path.split('.').reduce((prev, curr) => prev?.[curr], obj)
}
</script>
