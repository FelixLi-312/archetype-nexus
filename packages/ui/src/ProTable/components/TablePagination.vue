<template>
  <div class="pro-table-pagination">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { PaginationConfig } from '../types'

const props = defineProps<{
  total: number
  currentPage?: number
  pageSize?: number
  paginationConfig?: PaginationConfig
}>()

const emit = defineEmits<{
  (e: 'update:currentPage', val: number): void
  (e: 'update:pageSize', val: number): void
  (e: 'current-change', val: number): void
  (e: 'size-change', val: number): void
}>()

const currentPage = ref(props.currentPage || 1)
const pageSize = ref(props.pageSize || 10)

watch(
  () => props.currentPage,
  (val) => {
    if (val) currentPage.value = val
  }
)
watch(
  () => props.pageSize,
  (val) => {
    if (val) pageSize.value = val
  }
)

const handleSizeChange = (val: number) => {
  emit('update:pageSize', val)
  emit('size-change', val)
  emit('current-change', currentPage.value)
}

const handleCurrentChange = (val: number) => {
  emit('update:currentPage', val)
  emit('current-change', val)
}
</script>

<style scoped>
.pro-table-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
