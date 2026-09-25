<template>
  <div class="span-example">
    <h3>合并单元格示例</h3>
    <NxProTable :data="tableData" :toolbar="true" :span-method="spanMethod" name="SpanTable">
      <vxe-column type="seq" title="序号" width="60" />
      <vxe-column field="group" title="分组" />
      <vxe-column field="name" title="名称" />
      <vxe-column field="value" title="数值" />
    </NxProTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ProTable as NxProTable } from '../index'

const tableData = ref([
  { id: 1, group: '组A', name: '项目1', value: 100 },
  { id: 2, group: '组A', name: '项目2', value: 200 },
  { id: 3, group: '组A', name: '项目3', value: 300 },
  { id: 4, group: '组B', name: '项目4', value: 400 },
  { id: 5, group: '组B', name: '项目5', value: 500 }
])

const spanMethod = ({ rowIndex, columnIndex }: any) => {
  if (columnIndex === 0) {
    if (rowIndex === 0 || rowIndex === 1 || rowIndex === 2) {
      return { rowspan: 3, colspan: 1 }
    } else if (rowIndex === 3 || rowIndex === 4) {
      return { rowspan: 2, colspan: 1 }
    }
  }
}
</script>

<style scoped>
.span-example {
  padding: 16px;
}
</style>
