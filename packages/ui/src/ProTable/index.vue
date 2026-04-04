/** * 表格组件 * 用于展示和操作数据表格，支持分页、搜索、排序、操作列等功能 *
支持自定义配置和权限校验 */
<template>
  <div class="pro-table-wrapper">
    <!-- 1. 工具栏 -->
    <TableToolbar
      :toolbar="config.toolbar"
      :exportable="config.exportable"
      :columns="config.columns"
      @export="handleExport"
      @column-sort="handleColumnSort"
    >
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
      v-loading="loading"
      ref="tableRef"
      :data="tableData"
      :border="config.border"
      :stripe="config.stripe"
      :row-key="rowKey"
      :height="config.height"
      :max-height="config.maxHeight"
      @selection-change="emitSelectionChange"
      @sort-change="emitSortChange"
      style="width: 100%"
      :class="{ 'flex-table': config.height === '100%' }"
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
import { ref, reactive, onMounted, watch } from 'vue'
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
  data?: any[]
  config: ProTableConfig
  rowKey?: string
}>()

const emit = defineEmits<ProTableEmits>()

// 新增：表格实例引用
const tableRef = ref()
const tableData = ref<any[]>(props.data || [])
const loading = ref(props.config.loading || false)

const searchForm = reactive<Record<string, any>>({})

const rowKey = props.rowKey || 'id'

// 分页 Model (优先取 config 中的配置)
const currentPageModel = ref(props.config.pagination?.currentPage || 1)
const pageSizeModel = ref(props.config.pagination?.pageSize || 10)
const totalModel = ref(props.config.pagination?.total || 0)

// 监听 props.data 的变化，保持同步
watch(
  () => props.data,
  (newData) => {
    if (newData) tableData.value = newData
  },
  { deep: true }
)

// 监听 config.loading
watch(
  () => props.config.loading,
  (newLoading) => {
    loading.value = !!newLoading
  }
)

/**
 * 请求自动化逻辑
 */
const requestData = async () => {
  if (!props.config.request) return

  loading.value = true
  try {
    const params = {
      ...searchForm,
      page: currentPageModel.value,
      size: pageSizeModel.value
    }
    const { data, total } = await props.config.request(params)
    tableData.value = data
    totalModel.value = total
    // 同步给 config.pagination 以便外部感知
    if (props.config.pagination) {
      props.config.pagination.total = total
    }
  } catch (error) {
    console.error('ProTable Request Error:', error)
  } finally {
    loading.value = false
  }
}

// 初始化搜索表单默认值
const initSearchForm = () => {
  const config = props.config.searchConfig
  if (!config) return

  const items = Array.isArray(config) ? config : config.items
  items?.forEach((item) => {
    if (item.defaultValue !== undefined) {
      searchForm[item.prop] = item.defaultValue
    }
  })
}

initSearchForm()

onMounted(() => {
  if (props.config.immediate !== false) {
    requestData()
  }
})

// --- 事件处理逻辑 ---

const handlePageChange = (page: number) => {
  currentPageModel.value = page
  if (props.config.request) {
    requestData()
  } else {
    props.config.pagination?.onChange?.(page, pageSizeModel.value)
    emit('page-change', { page, size: pageSizeModel.value })
  }
}

const handleSizeChange = (size: number) => {
  pageSizeModel.value = size
  if (props.config.request) {
    requestData()
  } else {
    props.config.pagination?.onChange?.(currentPageModel.value, size)
    emit('size-change', size)
  }
}

const handleSearch = () => {
  currentPageModel.value = 1
  if (props.config.request) {
    requestData()
  } else {
    emit('search', { ...searchForm, page: 1, size: pageSizeModel.value })
  }
}

const handleReset = () => {
  // 清空表单
  Object.keys(searchForm).forEach((key) => {
    delete searchForm[key]
  })
  // 重新加载默认值
  initSearchForm()
  emit('reset')

  currentPageModel.value = 1
  if (props.config.request) {
    requestData()
  } else {
    handleSearch()
  }
}

const emitSelectionChange = (val: any[]) => emit('selection-change', val)
const emitSortChange = (val: any) => emit('sort-change', val)

const handleColumnSort = (newColumns: ColumnConfig[]) => {
  props.config.columns = newColumns
}

// --- Excel 导出逻辑 (保留在主组件，因为需要访问全部数据) ---
const handleExport = () => {
  if (!tableData.value || tableData.value.length === 0) {
    ElMessage.warning('没有数据可导出')
    return
  }

  // 递归拍平列，只导出可见列
  const flatColumns = (cols: ColumnConfig[]): ColumnConfig[] => {
    const result: ColumnConfig[] = []

    const loop = (list: ColumnConfig[]) => {
      list.forEach((col) => {
        // 优先取 exportVisible，其次取 visible
        const isVisible = col.exportVisible !== undefined ? col.exportVisible : col.visible !== false
        if (!isVisible) return

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

  const formattedData = tableData.value.map((row) => {
    const item: any = {}
    leafColumns.forEach((col) => {
      if (!col.prop) return
      
      const val = col.prop.split('.').reduce((o, i) => o?.[i], row)
      
      // 1. 优先使用自定义导出格式化函数
      if (col.exportFormat) {
        item[col.prop] = col.exportFormat(row)
      } 
      // 2. 其次使用 valueEnum 枚举映射
      else if (col.valueEnum && val !== undefined) {
        const enumItem = col.valueEnum[String(val)]
        item[col.prop] = enumItem ? enumItem.text : val
      }
      // 3. 最后使用原始值
      else {
        item[col.prop] = val
      }
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
  const fileName  = props.config.exportFileName ? props.config.exportFileName + '.xlsx' : `Export_${Date.now()}.xlsx`
  XLSX.writeFile(wb, fileName)
  emit('export')
}
/**
 * 重新加载数据
 */
const reload = () => {
  if (props.config.request) {
    requestData()
  } else {
    emit('page-change', {
      page: currentPageModel.value,
      size: pageSizeModel.value
    })
  }
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
  handleReset()
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
  currentPageModel.value = page
  reload()
}
/**
 * 设置分页大小
 * @param size
 */
const setPageSize = (size: number) => {
  pageSizeModel.value = size
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
  height: 100%; /* 让包装容器也能充满父级 */
  box-sizing: border-box;
  overflow: hidden; /* 防止内部内容溢出 */
}

.flex-table {
  flex: 1;
  overflow: hidden;
}
</style>
