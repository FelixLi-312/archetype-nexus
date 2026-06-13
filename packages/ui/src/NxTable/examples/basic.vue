<template>
  <div class="basic-example">
    <h3>基础表格示例</h3>
    <NxProTable
      :data="tableData"
      :toolbar="true"
      :custom-column="true"
      name="BasicTable"
    >
      <vxe-column type="seq" title="序号" width="60" />
      <vxe-column field="name" title="名称" />
      <vxe-column field="age" title="年龄" />
      <vxe-column field="email" title="邮箱" />
    </NxProTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ProTable as NxProTable } from '../index'

const tableData = ref([
  { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
  { id: 2, name: '李四', age: 30, email: 'lisi@example.com' },
  { id: 3, name: '王五', age: 28, email: 'wangwu@example.com' },
])
</script>

<style scoped>
.basic-example {
  padding: 16px;
}
</style>
