/** * 表格搜索组件 * 用于展示表格的搜索栏，支持自定义搜索配置 */
<template>
  <div v-if="config && config.length" class="pro-table-search">
    <el-form :inline="true" :model="modelValue" class="demo-form-inline">
      <el-form-item v-for="item in config" :key="item.prop" :label="item.label" :prop="item.prop">
        <!-- Input -->
        <el-input
          v-if="item.type === 'input'"
          v-model="modelValue[item.prop]"
          :placeholder="item.placeholder || `请输入${item.label}`"
          clearable
          @keyup.enter="$emit('search')"
        />
        <!-- Select -->
        <el-select
          v-else-if="item.type === 'select'"
          v-model="modelValue[item.prop]"
          :placeholder="item.placeholder || `请选择${item.label}`"
          clearable
          style="width: 180px"
        >
          <el-option
            v-for="opt in item.options"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
        <!-- Date -->
        <el-date-picker
          v-else-if="item.type === 'date'"
          v-model="modelValue[item.prop]"
          type="date"
          :placeholder="item.placeholder || `选择${item.label}`"
          style="width: 180px"
          value-format="YYYY-MM-DD"
        />
        <!-- DateRange -->
        <el-date-picker
          v-else-if="item.type === 'daterange'"
          v-model="modelValue[item.prop]"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 240px"
          value-format="YYYY-MM-DD"
        />
        <!-- Number -->
        <el-input-number
          v-else-if="item.type === 'number'"
          v-model="modelValue[item.prop]"
          :placeholder="item.placeholder"
          style="width: 180px"
          controls-position="right"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="Search" @click="$emit('search')">查询</el-button>
        <el-button icon="Refresh" @click="$emit('reset')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { SearchItem } from '../types'

defineProps<{
  modelValue: Record<string, any>
  config?: SearchItem[]
}>()

defineEmits<{
  (e: 'search'): void
  (e: 'reset'): void
}>()
</script>

<style scoped>
.pro-table-search {
  background: #fafafa;
  padding: 16px;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  margin-bottom: 16px;
}
</style>
