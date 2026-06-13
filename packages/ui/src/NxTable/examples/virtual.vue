<template>
  <div class="virtual-example">
    <h3>虚拟滚动示例（大数据）</h3>
    <NxProTable
      :data="tableData"
      :toolbar="true"
      virtual-config="{ enabled: true, rowHeight: 40 }"
      name="VirtualTable"
    >
      <vxe-column type="seq" title="序号" width="60" />
      <vxe-column field="name" title="名称" />
      <vxe-column field="index" title="索引" />
      <vxe-column field="timestamp" title="时间戳" />
    </NxProTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ProTable as NxProTable } from '../index'

// 生成大量测试数据
const tableData = ref(
  Array.from({ length: 10000 }).map((_, i) => ({
    id: i + 1,
    name: `用户${i + 1}`,
    index: i,
    timestamp: Date.now() + i * 1000,
  })),
)
</script>

<style scoped>
.virtual-example {
  padding: 16px;
}
</style>
