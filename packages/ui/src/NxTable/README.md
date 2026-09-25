# NxTable 组件架构说明

## 📦 目录结构

```
src/NxTable/
├── index.ts                    # 统一导出入口
├── ProTable.vue                # ⭐ 总控组件（编排层）
├── ProTableContext.ts          # provide/inject 上下文
│
├── core/                        # ⭐ 核心引擎（非常关键）
│   ├── createTable.ts          # 创建表格实例
│   ├── lifecycle.ts            # 生命周期管理
│   ├── plugin.ts               # 插件系统实现
│   └── event.ts                # 事件中心（发布订阅）
│
├── components/                  # UI 组件层（纯展示）
│   ├── BaseTable/               # ⭐ vxe-table 基础封装
│   │   ├── BaseTable.vue
│   │   ├── props.ts
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── TablePagination/          # 分页组件
│   │   ├── Pagination.vue
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── SearchForm/               # 搜索表单（支持高级查询）
│   │   ├── SearchForm.vue
│   │   ├── props.ts
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── Toolbar/                  # 工具栏（刷新/导出/打印）
│   │   ├── Toolbar.vue
│   │   ├── props.ts
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── ColumnSetting/            # 列配置（显隐/排序）
│   │   ├── ColumnSetting.vue
│   │   ├── props.ts
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── Empty/                     # 空状态
│   │   ├── Empty.vue
│   │   ├── props.ts
│   │   └── index.ts
│   │
│   └── index.ts                  # 组件统一导出
│
├── hooks/                         # ⭐ 核心能力层（逻辑）
│   ├── useTable.ts              # 数据管理
│   ├── usePagination.ts         # 分页逻辑
│   ├── useSearch.ts             # 搜索过滤
│   ├── useColumns.ts            # 列管理
│   ├── useToolbar.ts            # 工具栏
│   ├── useEditable.ts           # 行/单元格编辑
│   ├── useSelection.ts          # 多选/单选
│   ├── useSort.ts               # 排序
│   ├── useFilter.ts             # 筛选
│   ├── useTree.ts               # 树形表格
│   ├── useVirtualScroll.ts      # 虚拟滚动
│   ├── useSpan.ts               # 合并单元格
│   ├── useRowKey.ts             # 行键管理
│   ├── useLoading.ts            # 加载状态
│   └── useEvent.ts              # 事件管理
│
├── plugins/                       # ⭐ 插件层（高级能力扩展）
│   ├── editable.plugin.ts       # 编辑插件
│   ├── selection.plugin.ts      # 选择插件
│   ├── sort.plugin.ts           # 排序插件
│   ├── filter.plugin.ts         # 筛选插件
│   ├── tree.plugin.ts           # 树表插件
│   ├── virtual.plugin.ts        # 虚拟滚动插件
│   ├── span.plugin.ts           # 合并单元格插件
│   ├── export.plugin.ts         # 导出
│   └── columnSetting.plugin.ts  # 列设置
│
├── utils/                         # 工具层
│   ├── helper.ts                # DOM/高度计算工具
│   └── ...
│
├── types/                         # ⭐ 类型系统
│   ├── table.ts
│   ├── column.ts
│   ├── request.ts
│   ├── search.ts
│   ├── editable.ts
│   ├── selection.ts
│   ├── sort.ts
│   ├── filter.ts
│   ├── tree.ts
│   ├── virtual.ts
│   ├── span.ts
│   └── index.ts
│
├── constants/                     # 默认配置
│   ├── defaultProps.ts
│   ├── defaultColumns.ts
│   └── config.ts
│
├── styles/
│   ├── index.less
│   ├── table.less
│   ├── form.less
│   └── toolbar.less
│
└── examples/                      # 使用示例
    ├── basic.vue               # 基础使用
    ├── editable.vue            # 可编辑表格
    ├── tree.vue                # 树形表格
    ├── virtual.vue             # 虚拟滚动
    ├── span.vue                # 合并单元格
    └── full-demo.vue           # 完整功能示例
```

## 🎯 核心设计原则

### 1. **分层架构**

- **编排层**：ProTable.vue - 组织和管理子组件
- **组件层**：展示组件 - BaseTable、Toolbar、SearchForm 等
- **逻辑层**：Hooks - 可复用的业务逻辑
- **核心层**：Core - 表格实例创建、生命周期、事件系统

### 2. **独立职责**

- 每个子组件只负责单一功能
- 通过 Props + Emits 进行通信
- 降低耦合度，提高可维护性

### 3. **可扩展性**

- 插件系统支持功能扩展
- Hook 组合实现复杂逻辑
- 上下文 Context 传递全局状态

## 💻 主要组件

### ProTable（编排层）

```vue
<NxProTable
  :data="tableData"
  :toolbar="true"
  :custom-column="true"
  :export-menu="exportMenu"
  :pagination-options="paginationOptions"
  @refresh="handleRefresh"
  @add="handleAdd"
>
  <!-- 搜索表单插槽 -->
  <template #search>
    <!-- 自定义搜索表单 -->
  </template>

  <!-- 表格列定义 -->
  <vxe-column field="name" title="名称" />
</NxProTable>
```

### BaseTable（基础表格）

```vue
<NxBaseTable ref="tableRef" :max-height="500">
  <vxe-column field="name" title="名称" />
</NxBaseTable>
```

### Toolbar（工具栏）

- 刷新按钮
- 添加按钮
- 快速搜索
- 导出功能
- 打印功能
- 列设置弹窗

### SearchForm（搜索表单）

- 可展/缩
- 支持自定义表单内容

### ColumnSetting（列设置）

- 列的显示/隐藏
- 通过树形结构管理

### Pagination（分页）

- 基于 Element Plus 封装
- 支持页码和页容量切换

## 🎨 样式架构

```
styles/
├── index.less              # 入口样式
├── table.less              # 表格容器样式
├── form.less               # 搜索表单样式
└── toolbar.less            # 工具栏样式
```

## 🔌 导出 API

```typescript
// 主组件
export { default as ProTable } from './ProTable.vue'

// 子组件
export { BaseTable, Toolbar, SearchForm, ColumnSetting, Pagination }

// Hooks
export { useTable, usePagination, useSearch, useColumns, ... }

// Core APIs
export { createTable, onTableMounted, createPlugin, onEvent, ... }

// Types
export { NxTableOptions, NxTableColumn, NxTableTreeConfig, ... }

// Constants
export { defaultProps, defaultColumns, defaultConfig }
```

## 📝 使用示例

### 基础示例

```vue
<script setup>
import { ref } from 'vue'
import { NxProTable } from '@nexus/ui'

const data = ref([
  { id: 1, name: '张三', age: 25 },
  { id: 2, name: '李四', age: 30 }
])
</script>

<template>
  <NxProTable :data="data" :toolbar="true">
    <vxe-column type="seq" title="序号" width="60" />
    <vxe-column field="name" title="名称" />
    <vxe-column field="age" title="年龄" />
  </NxProTable>
</template>
```

### 完整示例（见 examples/full-demo.vue）

- 搜索表单
- 工具栏
- 表格数据
- 分页控制
- 导出功能

## 🚀 后续优化方向

1. **插件系统完善** - 实现更多插件功能
2. **Hook 增强** - 添加更多业务逻辑 Hook
3. **类型完善** - 补充所有组件的完整类型定义
4. **性能优化** - 虚拟滚动、懒加载等
5. **国际化支持** - i18n 集成
6. **主题定制** - CSS 变量化支持
