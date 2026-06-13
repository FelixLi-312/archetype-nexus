<template>
  <div class="nx-toolbar">
    <div class="nx-toolbar-buttons">
      <el-button v-if="showRefresh" @click="$emit('refresh')">
        <mel-icon-refresh />
      </el-button>
      <el-button v-if="showAdd" type="primary" @click="$emit('add')">
        <mel-icon-plus />
      </el-button>
      <slot name="buttons" />
    </div>

    <div class="nx-toolbar-tools">
      <el-input
        v-if="searchable"
        :model-value="search"
        :placeholder="searchPlaceholder"
        prefix-icon="mel-icon-search"
        class="nx-toolbar-search"
        @update:model-value="$emit('update:search', $event)"
        @change="$emit('search', $event)"
      />

      <el-button-group v-if="showTools">
        <el-popover
          v-if="showColumnSetting"
          :teleported="false"
          placement="bottom"
          trigger="click"
          width="auto"
        >
          <template #reference>
            <el-button icon="mel-icon-grid" :title="t('自定义列')" />
          </template>
          <slot name="column-setting" />
        </el-popover>

        <el-popover
          v-if="exportMenu?.length"
          pure
          placement="bottom"
          trigger="click"
          popper-class="nx-export-popover el-dropdown__popper"
        >
          <template #reference>
            <el-button icon="mel-icon-download" :title="t('导出')" />
          </template>
          <template #default>
            <ul class="el-dropdown-menu">
              <li
                v-for="(item, idx) in (exportMenu as ExportMenuItem[])"
                :key="idx"
                class="el-dropdown-menu__item"
                @click="$emit('export', item)"
              >
                {{ item.label }}
              </li>
            </ul>
          </template>
        </el-popover>

        <el-button
          v-if="printable"
          icon="mel-icon-printer"
          :title="t('打印')"
          @click="$emit('print')"
        />

        <slot name="tools" />
      </el-button-group>

      <el-button
        v-if="searchable"
        :title="t('更多筛选')"
        @click="$emit('toggle-search')"
      >
        <mel-icon-search />
      </el-button>

      <slot name="tools-button" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue'
import type { VxeTableInstance } from 'vxe-table'

export interface ExportMenuItem {
  label: string
  filename?: string
  handle?: (vxeTable: VxeTableInstance, filename: string) => void | 'csv' | 'html' | 'xml' | 'txt'
}

export default defineComponent({
  name: 'NxTableToolbar',
  props: {
    search: String,
    searchPlaceholder: {
      type: [String, Function],
      default: '快捷搜索',
    },
    searchable: {
      type: Boolean,
      default: false,
    },
    showRefresh: {
      type: Boolean,
      default: true,
    },
    showAdd: {
      type: Boolean,
      default: true,
    },
    showColumnSetting: {
      type: Boolean,
      default: true,
    },
    showTools: {
      type: Boolean,
      default: true,
    },
    exportMenu: {
      type: Array,
      default: () => [],
    },
    printable: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['refresh', 'add', 'update:search', 'search', 'export', 'print', 'toggle-search'],
  setup() {
    const instance = getCurrentInstance()
    const $t = instance?.appContext.config.globalProperties.$t || ((key: string) => key)

    const t = (key: string) => {
      return typeof $t === 'function' ? $t(key) : key
    }

    return {
      t,
    }
  },
})
</script>

<style lang="scss" scoped>
.nx-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;

  .nx-toolbar-buttons {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .nx-toolbar-tools {
    display: flex;
    align-items: center;
    gap: 8px;

    .nx-toolbar-search {
      width: 200px;
    }
  }
}

:global(.nx-export-popover) {
  width: max-content !important;
  min-width: unset !important;
}

:global(.nx-export-popover .el-dropdown-menu__item:not(.is-disabled):hover) {
  background-color: var(--el-dropdown-menuItem-hover-fill);
  color: var(--el-dropdown-menuItem-hover-color);
}
</style>
