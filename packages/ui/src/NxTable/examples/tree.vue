<template>
  <div class="tree-example">
    <h3>树形表格示例</h3>
    <NxProTable
      :data="tableData"
      :toolbar="true"
      tree-config="{ children: 'children' }"
      name="TreeTable"
    >
      <vxe-column field="name" title="名称" tree-node />
      <vxe-column field="status" title="状态" />
      <vxe-column field="createTime" title="创建时间" />
    </NxProTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ProTable as NxProTable } from '../index'

const tableData = ref([
  {
    id: 1,
    name: '模块A',
    status: '启用',
    createTime: '2024-01-01',
    children: [
      { id: 2, name: '模块A-1', status: '启用', createTime: '2024-01-02' },
      { id: 3, name: '模块A-2', status: '禁用', createTime: '2024-01-03' }
    ]
  },
  {
    id: 4,
    name: '模块B',
    status: '启用',
    createTime: '2024-01-04',
    children: [{ id: 5, name: '模块B-1', status: '启用', createTime: '2024-01-05' }]
  }
])
</script>

<style scoped>
.tree-example {
  padding: 16px;
}
</style>
