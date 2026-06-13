<template>
  <div class="full-demo">
    <h3>完整功能示例</h3>
    <NxProTable
      :data="tableData"
      :toolbar="true"
      :custom-column="true"
      :export-menu="exportMenu"
      :print="true"
      :pagination-options="paginationOptions"
      :quick-search="searchText"
      name="FullDemoTable"
      @refresh="handleRefresh"
      @add="handleAdd"
      @update:quick-search="searchText = $event"
      @quick-search="handleSearch"
    >
      <!-- Search Form Slot -->
      <template #search>
        <div style="padding: 12px; background: #f5f5f5;">
          <el-row :gutter="12">
            <el-col :xs="24" :sm="12" :md="6">
              <el-input v-model="filters.name" placeholder="名称" />
            </el-col>
            <el-col :xs="24" :sm="12" :md="6">
              <el-input v-model="filters.email" placeholder="邮箱" />
            </el-col>
            <el-col :xs="24" :sm="12" :md="6">
              <el-button type="primary" @click="handleAdvancedSearch">查询</el-button>
              <el-button @click="handleResetFilters">重置</el-button>
            </el-col>
          </el-row>
        </div>
      </template>

      <!-- Table Columns -->
      <vxe-column type="seq" title="序号" width="60" />
      <vxe-column type="checkbox" title="选择" width="50" />
      <vxe-column field="name" title="名称" sortable />
      <vxe-column field="age" title="年龄" />
      <vxe-column field="email" title="邮箱" />
      <vxe-column field="createTime" title="创建时间" />
      <vxe-column field="status" title="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === '启用' ? 'success' : 'info'">
            {{ row.status }}
          </el-tag>
        </template>
      </vxe-column>
      <vxe-column title="操作" width="150">
        <template #default>
          <el-button type="primary" size="small" @click="handleEdit">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete">删除</el-button>
        </template>
      </vxe-column>
    </NxProTable>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ProTable as NxProTable } from '../index'

const tableData = ref([
  {
    id: 1,
    name: '张三',
    age: 25,
    email: 'zhangsan@example.com',
    createTime: '2024-01-01',
    status: '启用',
  },
  {
    id: 2,
    name: '李四',
    age: 30,
    email: 'lisi@example.com',
    createTime: '2024-01-02',
    status: '启用',
  },
  {
    id: 3,
    name: '王五',
    age: 28,
    email: 'wangwu@example.com',
    createTime: '2024-01-03',
    status: '禁用',
  },
])

const searchText = ref('')
const filters = reactive({
  name: '',
  email: '',
})

const exportMenu = [
  { label: 'CSV', handle: 'csv' as any },
  { label: 'Excel', handle: 'xlsx' as any },
  { label: 'HTML', handle: 'html' as any },
]

const paginationOptions = {
  currentPage: 1,
  pageSize: 10,
  total: 30,
  layout: 'total, sizes, prev, pager, next, jumper',
}

const handleRefresh = () => {
  console.log('刷新表格')
}

const handleAdd = () => {
  console.log('添加新行')
}

const handleSearch = (keyword: string) => {
  console.log('快速搜索:', keyword)
}

const handleAdvancedSearch = () => {
  console.log('高级搜索:', filters)
}

const handleResetFilters = () => {
  filters.name = ''
  filters.email = ''
}

const handleEdit = () => {
  console.log('编辑行')
}

const handleDelete = () => {
  console.log('删除行')
}
</script>

<style scoped>
.full-demo {
  padding: 16px;
}
</style>
