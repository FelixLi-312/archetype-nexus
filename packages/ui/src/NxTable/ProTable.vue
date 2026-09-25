<template>
  <div v-resize="getTableHeight" class="nx-pro-table" :class="meClass">
    <!-- Toolbar Section -->
    <NxTableToolbar
      v-if="toolbar"
      ref="toolbarRef"
      :search="quickSearch"
      :searchable="!!$slots.search"
      :show-refresh="true"
      :show-add="true"
      :show-column-setting="customColumn"
      :show-tools="customColumn || (exportMenu?.length ?? 0) > 0 || !!print"
      :export-menu="exportMenu as any"
      :printable="!!print"
      @search="handleQuickSearch"
      @update:search="$emit('update:quickSearch', $event)"
      @refresh="$emit('refresh')"
      @add="$emit('add')"
      @print="handlePrint"
      @export="handleExport"
      @toggle-search="toggleSearch"
    >
      <template #column-setting>
        <NxTableColumnSetting
          :columns="collectColumn"
          :checked-keys="defaultChecked"
          @check-change="checkChange"
        />
      </template>
    </NxTableToolbar>

    <!-- Search Form Section -->
    <NxTableSearchForm v-if="$slots.search" :visible="showSearch">
      <slot name="search" />
    </NxTableSearchForm>

    <!-- Base Table Section -->
    <div class="nx-table-body">
      <NxBaseTable ref="baseTableRef" :max-height="tableHeight" v-bind="$attrs">
        <slot />
      </NxBaseTable>
    </div>

    <!-- Pagination Section -->
    <NxPagination
      v-if="paginationOptions && paginationOptions.change"
      ref="paginationRef"
      :options="paginationOptions as any"
      class="nx-table-pagination"
    />
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, getCurrentInstance, nextTick, onMounted, ref, useTemplateRef } from 'vue'
import { debounce } from 'lodash-es'
import type { VxeTableDefines, VxeTableInstance, VxeTablePropTypes } from 'vxe-table'
import resize from './directives/resize'
import { getFullHeight } from './utils/helper'
import NxTableToolbar from './components/Toolbar/Toolbar.vue'
import NxTableSearchForm from './components/SearchForm/SearchForm.vue'
import NxBaseTable from './components/BaseTable/BaseTable.vue'
import NxTableColumnSetting from './components/ColumnSetting/ColumnSetting.vue'
import NxPagination from './components/TablePagination/Pagination.vue'
import type { ExportMenuItem } from './components/Toolbar/props'
import './install'

interface Props {
  meClass?: string | string[]
  name?: string
  exportMenu?: ExportMenuItem[]
  print?: VxeTablePropTypes.PrintConfig | boolean
  customColumn?: boolean
  defaultShowSearch?: boolean
  toolbar?: boolean
  quickSearch?: string
  quickSearchPlaceholder?: string | ((t: (key: string) => string) => string)
  paginationOptions?: Record<string, any>
  autoHeight?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  name: 'NxProTable',
  customColumn: true,
  toolbar: true,
  quickSearch: undefined,
  quickSearchPlaceholder: '快捷搜索',
  autoHeight: true,
  print: false,
  defaultShowSearch: false,
  exportMenu: () => [
    { label: 'CSV', handle: 'csv' as any },
    { label: 'HTML', handle: 'html' as any }
  ]
})

const emit = defineEmits<{
  quickSearch: [value: string]
  refresh: []
  add: []
  'update:quickSearch': [value: string]
}>()

const instance = getCurrentInstance()
const $t = instance?.appContext.config.globalProperties.$t || ((key: string) => key)

// Template refs
const baseTableRef = useTemplateRef<InstanceType<typeof NxBaseTable>>('baseTableRef')
const toolbarRef = useTemplateRef<InstanceType<typeof NxTableToolbar>>('toolbarRef')
const paginationRef = useTemplateRef<InstanceType<typeof NxPagination>>('paginationRef')

// State
const showSearch = ref(props.defaultShowSearch)
const collectColumn = ref<VxeTableDefines.ColumnInfo[]>([])
const defaultChecked = ref<string[]>([])
const tableHeight = ref<number>()

// Debounced column refresh
const refreshColumn = debounce(() => {
  const vxeTable = (baseTableRef.value as any)?.vxeTableRef
  vxeTable?.refreshColumn()
}, 500)

// Handle column visibility change
const checkChange = (data: VxeTableDefines.ColumnInfo, checked: boolean) => {
  data.visible = checked
  refreshColumn()
}

// Toggle search visibility
const toggleSearch = () => {
  showSearch.value = !showSearch.value
}

// Handle quick search
const handleQuickSearch = (value: string) => {
  emit('quickSearch', value)
}

// Handle export
const handleExport = (item: ExportMenuItem) => {
  const vxeTable = (baseTableRef.value as any)?.vxeTableRef
  if (!vxeTable) return

  if (typeof item.handle === 'string') {
    vxeTable.exportData?.({
      type: item.handle as any,
      filename: item.filename || props.name,
      data:
        (vxeTable.getCheckboxRecords?.().length ?? 0 > 0)
          ? vxeTable.getCheckboxRecords?.()
          : undefined
    })
  } else if (item.handle) {
    item.handle(vxeTable, item.filename || props.name || 'export')
  }
}

// Handle print
const handlePrint = () => {
  const vxeTable = (baseTableRef.value as any)?.vxeTableRef
  if (!vxeTable || !props.print) return

  vxeTable.print?.(
    Object.assign(
      {
        sheetName: props.name,
        data:
          (vxeTable.getCheckboxRecords?.().length ?? 0 > 0)
            ? vxeTable.getCheckboxRecords?.()
            : undefined
      },
      typeof props.print === 'boolean' ? {} : props.print
    )
  )
}

// Calculate table height based on container resize
const getTableHeight = (data: { width: number; height: number }) => {
  if (!props.autoHeight) return

  let totalHeight = data.height
  // Subtract toolbar height if visible
  if (toolbarRef.value?.$el) {
    totalHeight -= getFullHeight(toolbarRef.value.$el as HTMLDivElement)
  }
  // Subtract pagination height if visible
  if (paginationRef.value?.$el) {
    totalHeight -= getFullHeight(paginationRef.value.$el as HTMLDivElement)
  }
  tableHeight.value = Math.max(totalHeight, 200)
}

// Initialize on mount
onMounted(async () => {
  await nextTick()
  const vxeTable = (baseTableRef.value as any)?.vxeTableRef
  if (vxeTable) {
    try {
      const { collectColumn: cols, fullColumn } = vxeTable.getTableColumn?.() || {
        collectColumn: [],
        fullColumn: []
      }
      collectColumn.value = cols
      defaultChecked.value = fullColumn
        .filter((col: any) => col.visible !== false)
        .map((col: any) => col.id)
    } catch (e) {
      console.warn('Failed to get table columns:', e)
    }
  }
})

// Expose public API
defineExpose({
  getVxeTable() {
    return (baseTableRef.value as any)?.vxeTableRef
  },
  refresh() {
    emit('refresh')
  }
})
</script>

<style lang="scss" scoped>
.nx-pro-table {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;

  .nx-table-body {
    flex: 1;
    overflow: hidden;
    min-height: 0;
  }

  .nx-table-pagination {
    flex-shrink: 0;
    margin-top: 12px;
    text-align: center;
  }
}
</style>
