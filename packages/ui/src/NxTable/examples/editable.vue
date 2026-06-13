<template>
  <div class="editable-example">
    <h3>可编辑表格示例</h3>
    <NxProTable
      :data="tableData"
      :toolbar="true"
      name="EditableTable"
    >
      <vxe-column type="seq" title="序号" width="60" />
      <vxe-column field="name" title="名称" :edit-render="{ name: 'input' }" />
      <vxe-column field="age" title="年龄" :edit-render="{ name: 'input' }" />
      <vxe-column field="email" title="邮箱" :edit-render="{ name: 'input' }" />
    </NxProTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ProTable as NxProTable } from '../index'

const tableData = ref([
  { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
  { id: 2, name: '李四', age: 30, email: 'lisi@example.com' },
])
</script>

<style scoped>
.editable-example {
  padding: 16px;
}
</style>
