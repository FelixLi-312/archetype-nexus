/** * 表格组件 * 用于展示和操作数据表格，支持分页、搜索、排序、操作列等功能 *
支持自定义配置和权限校验 */
<template>
  <div class="pro-table-wrapper">
    <!-- 1. 工具栏 -->
    <TableToolbar :toolbar="config.toolbar" :exportable="config.exportable" @export="handleExport">
      <template #left><slot name="toolbar-left"></slot></template>
      <template #right><slot name="toolbar-right"></slot></template>
    </TableToolbar>

    <!-- 2. 搜索栏 -->
    <TableSearch
      v-model="searchForm"
      :config="config.searchConfig"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 3. 表格主体 -->
    <el-table
      v-loading="config.loading"
      ref="tableRef"
      :data="data"
      :border="config.border"
      :stripe="config.stripe"
      :row-key="rowKey"
      @selection-change="emitSelectionChange"
      @sort-change="emitSortChange"
      style="width: 100%"
    >
      <el-table-column v-if="config.selection" type="selection" width="55" align="center" />

      <!-- 动态列循环 -->
      <TableColumn v-for="col in config.columns" :key="col.prop" :col="col">
        <!-- 透传插槽给 TableColumn -->
        <template v-for="(_, name) in $slots" #[name]="slotData">
          <slot :name="name" v-bind="slotData"></slot>
        </template>
      </TableColumn>

      <!-- 操作列 -->
      <TableActions
        v-if="config.actions && config.actions.buttonGroup?.length"
        :config="config.actions"
      />

      <slot name="extraColumns"></slot>
    </el-table>

    <!-- 4. 分页 -->
    <TablePagination
      v-if="config.pagination && config.pagination.enabled"
      v-model:current-page="currentPageModel"
      v-model:page-size="pageSizeModel"
      :total="totalModel"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
      :paginationConfig="config.pagination"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import * as XLSX from 'xlsx'
// 引入子组件
import TableToolbar from './components/TableToolbar.vue'
import TableSearch from './components/TableSearch.vue'
import TableColumn from './components/TableColumn.vue'
import TableActions from './components/TableActions.vue'
import TablePagination from './components/TablePagination.vue'

import type { ColumnConfig, ProTableConfig, ProTableEmits, ProTableInstance } from './types'

// Props & Emits (保持原有逻辑)
const props = defineProps<{
  data: any[]
  config: ProTableConfig
  rowKey?: string
}>()

const emit = defineEmits<ProTableEmits>()

// 新增：表格实例引用
const tableRef = ref()
const tableData = ref<any[]>([])

const searchForm = reactive<Record<string, any>>({})

const currentPage = ref(props.config.pagination?.currentPage || 1)
const pageSize = ref(props.config.pagination?.pageSize || 10)

const rowKey = props.rowKey || 'id'
const currentPageModel = ref(props.config.pagination?.currentPage || 1)
const pageSizeModel = ref(props.config.pagination?.pageSize || 10)
const totalModel = ref(props.config.pagination?.total || 0)
if (props.config.searchConfig) {
  props.config.searchConfig.forEach((item) => {
    searchForm[item.prop] = item.defaultValue !== undefined ? item.defaultValue : ''
  })
}

// --- 事件处理逻辑 (从原子组件冒泡上来) ---

const handlePageChange = (page: number) => {
  debugger
  currentPageModel.value = page
  const size = pageSizeModel.value
  // 调 schema 回调
  props.config.pagination?.onChange?.(page, size)
}
const handleSizeChange = (size: number) => {
  pageSizeModel.value = size
  const page = currentPageModel.value
  props.config.pagination?.onChange?.(page, size)
}

const handleSearch = () => {
  currentPageModel.value = 1
  emit('update:currentPage', 1)
  emit('search', { ...searchForm, page: 1, size: pageSizeModel.value })
}

const handleReset = () => {
  if (props.config.searchConfig) {
    props.config.searchConfig.forEach((item) => {
      searchForm[item.prop] = item.defaultValue !== undefined ? item.defaultValue : ''
    })
  }
  emit('reset')
  handleSearch()
}

const emitSelectionChange = (val: any[]) => emit('selection-change', val)
const emitSortChange = (val: any) => emit('sort-change', val)

// --- Excel 导出逻辑 (保留在主组件，因为需要访问全部数据) ---
const handleExport = () => {
  if (!props.data || props.data.length === 0) {
    ElMessage.warning('没有数据可导出')
    return
  }

  // 递归拍平列
  const flatColumns = (cols: ColumnConfig[]): ColumnConfig[] => {
    const result: ColumnConfig[] = []

    const loop = (list: ColumnConfig[]) => {
      list.forEach((col) => {
        if (col.children && col.children.length) {
          loop(col.children)
        } else {
          result.push(col)
        }
      })
    }

    loop(cols)
    return result
  }

  const leafColumns = flatColumns(props.config.columns)

  const headers: Record<string, string> = {}
  const keys: string[] = []

  leafColumns.forEach((col) => {
    if (col.prop) {
      headers[col.prop] = col.label
      keys.push(col.prop)
    }
  })

  const formattedData = props.data.map((row) => {
    const item: any = {}
    keys.forEach((k) => {
      item[k] = k.split('.').reduce((o, i) => o?.[i], row)
    })
    return item
  })

  const ws = XLSX.utils.json_to_sheet(formattedData, { header: keys })

  // 设置中文表头
  keys.forEach((k, i) => {
    const cell = XLSX.utils.encode_cell({ r: 0, c: i })
    ws[cell].v = headers[k]
  })

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

  XLSX.writeFile(wb, props.config.exportFileName || `Export_${Date.now()}.xlsx`)

  emit('export')
}
/**
 * 重新加载数据
 */
const reload = () => {
  emit('page-change', {
    page: currentPage.value,
    size: pageSize.value
  })
}
/**
 * 设置表格数据
 * @param data
 */
const setData = (data: any[]) => {
  tableData.value = data
}
/**
 * 获取表格数据
 * @returns
 */
const getData = () => {
  return tableData.value
}
/**
 * 重置搜索参数
 */
const resetSearch = () => {
  Object.keys(searchForm).forEach((k) => {
    searchForm[k] = undefined
  })

  emit('reset')
  reload()
}

/**
 * 设置搜索参数
 * @param params
 */
const setSearchParams = (params: Record<string, any>) => {
  Object.assign(searchForm, params)
}
/**
 * 获取搜索参数
 * @returns
 */
const getSearchParams = () => {
  return { ...searchForm }
}
/**
 * 获取选中行数据
 * @returns
 */
const getSelectionRows = () => {
  return tableRef.value?.getSelectionRows?.() || []
}
/**
 * 清除选中行
 */
const clearSelection = () => {
  tableRef.value?.clearSelection?.()
}
/**
 * 切换选中行
 * @param row
 * @param selected
 */
const toggleRowSelection = (row: any, selected?: boolean) => {
  tableRef.value?.toggleRowSelection?.(row, selected)
}
/**
 * 设置当前页码
 * @param page
 */
const setPage = (page: number) => {
  currentPage.value = page
  reload()
}
/**
 * 设置分页大小
 * @param size
 */
const setPageSize = (size: number) => {
  pageSize.value = size
  reload()
}

/**
 * 滚动到顶部
 */
const scrollToTop = () => {
  const el = tableRef.value?.$el?.querySelector('.el-scrollbar__wrap')
  el?.scrollTo({ top: 0, behavior: 'smooth' })
}

defineExpose<ProTableInstance>({
  reload,
  setData,
  getData,
  resetSearch,
  getSearchParams,
  setSearchParams,
  getSelectionRows,
  clearSelection,
  toggleRowSelection,
  setPage,
  setPageSize,
  scrollToTop
})
</script>

<style scoped>
.pro-table-wrapper {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
