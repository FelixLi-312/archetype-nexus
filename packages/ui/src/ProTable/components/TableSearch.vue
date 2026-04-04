/** * 表格搜索组件 * 用于展示表格的搜索栏，支持响应式网格布局、折叠功能 */
<template>
  <div v-if="searchItems.length" class="pro-table-search">
    <el-form
      ref="formRef"
      :model="modelValue"
      :label-width="configProps.labelWidth || '100px'"
      class="search-form"
    >
      <el-row :gutter="20">
        <el-col
          v-for="(item, index) in visibleItems"
          :key="item.prop"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="item.span || 6"
        >
          <el-form-item :label="item.label" :prop="item.prop" v-bind="item.formItemProps">
            <!-- Input -->
            <el-input
              v-if="item.type === 'input'"
              v-model="modelValue[item.prop]"
              :placeholder="item.placeholder || `请输入${item.label}`"
              clearable
              v-bind="item.componentProps"
              @keyup.enter="$emit('search')"
            />
            <!-- Select -->
            <el-select
              v-else-if="item.type === 'select'"
              v-model="modelValue[item.prop]"
              :placeholder="item.placeholder || `请选择${item.label}`"
              clearable
              v-bind="item.componentProps"
              style="width: 100%"
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
              style="width: 100%"
              value-format="YYYY-MM-DD"
              v-bind="item.componentProps"
            />
            <!-- DateRange -->
            <el-date-picker
              v-else-if="item.type === 'daterange'"
              v-model="modelValue[item.prop]"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 100%"
              value-format="YYYY-MM-DD"
              v-bind="item.componentProps"
            />
            <!-- Number -->
            <el-input-number
              v-else-if="item.type === 'number'"
              v-model="modelValue[item.prop]"
              :placeholder="item.placeholder"
              style="width: 100%"
              controls-position="right"
              v-bind="item.componentProps"
            />
          </el-form-item>
        </el-col>

        <!-- 按钮组 -->
        <el-col :xs="24" :sm="12" :md="8" :lg="6" class="search-actions">
          <el-form-item label-width="0">
            <el-button type="primary" icon="Search" @click="$emit('search')">查询</el-button>
            <el-button icon="Refresh" @click="$emit('reset')">重置</el-button>
            <el-button
              v-if="searchItems.length > (configProps.defaultShowCount || 3)"
              type="primary"
              link
              @click="isCollapsed = !isCollapsed"
            >
              {{ isCollapsed ? '展开' : '收起' }}
              <el-icon class="el-icon--right">
                <component :is="isCollapsed ? 'ArrowDown' : 'ArrowUp'" />
              </el-icon>
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { SearchItem, SearchConfig } from '../types'

const props = defineProps<{
  modelValue: Record<string, any>
  config?: SearchItem[] | SearchConfig
}>()

defineEmits<{
  (e: 'search'): void
  (e: 'reset'): void
}>()

const configProps = computed(() => {
  if (Array.isArray(props.config)) {
    return { items: props.config } as SearchConfig
  }
  return props.config || ({ items: [] } as SearchConfig)
})

const searchItems = computed(() => configProps.value.items || [])

const isCollapsed = ref(configProps.value.collapsed ?? true)

const visibleItems = computed(() => {
  if (!isCollapsed.value) return searchItems.value
  const count = configProps.value.defaultShowCount || 3
  return searchItems.value.slice(0, count)
})
</script>

<style scoped>
.pro-table-search {
  background: #fafafa;
  padding: 24px 24px 4px 24px;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  margin-bottom: 16px;
}
.search-form {
  overflow: hidden;
}
.search-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 18px;
}
</style>
