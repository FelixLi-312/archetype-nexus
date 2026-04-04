<template>
  <div class="pro-table-demo">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>ProTable 示例展示</span>
        </div>
      </template>

      <ProTable
        ref="tableRef"
        :config="tableConfig"
      >
        <!-- 自定义列插槽 -->
        <template #status="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>

        <!-- 工具栏左侧插槽 -->
        <template #toolbar-left>
          <el-button type="primary" icon="Plus">新增用户</el-button>
        </template>
      </ProTable>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ProTable, type ProTableConfig } from '@nexus/ui'

const tableRef = ref()

// 模拟 API 请求
const mockApi = async (params: any) => {
  console.log('请求参数:', params)
  // 模拟延迟
  await new Promise(resolve => setTimeout(resolve, 800))

  const total = 50
  const data = Array.from({ length: params.size }).map((_, index) => ({
    id: (params.page - 1) * params.size + index + 1,
    name: `用户_${(params.page - 1) * params.size + index + 1}`,
    age: Math.floor(Math.random() * 20) + 20,
    email: `user${index}@example.com`,
    status: Math.random() > 0.3 ? 1 : 0,
    createTime: new Date().toISOString().split('T')[0]
  }))

  return { data, total }
}

const tableConfig = reactive<ProTableConfig>({
  height: '100%',
  columns: [
    { prop: 'id', label: 'ID', width: 80, sortable: true },
    { prop: 'name', label: '用户名', minWidth: 120 },
    { prop: 'age', label: '年龄', width: 80 },
    { prop: 'email', label: '邮箱', minWidth: 180 },
    { 
      prop: 'status', 
      label: '状态', 
      width: 100, 
      slot: 'status',
      exportFormat: (row) => row.status === 1 ? '启用' : '禁用'
    },
    { prop: 'createTime', label: '创建时间', width: 150 },
    { 
      prop: 'exportOnly', 
      label: '导出备注', 
      visible: false, 
      exportVisible: true,
      exportFormat: () => '这是一条导出专用数据'
    }
  ],
  searchConfig: {
    items: [
      { prop: 'name', label: '用户名', type: 'input', placeholder: '请输入用户名' },
      {
        prop: 'status',
        label: '状态',
        type: 'select',
        options: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 }
        ]
      },
      { prop: 'createTime', label: '日期', type: 'date' },
      { prop: 'age', label: '年龄', type: 'number' }
    ],
    collapsed: true,
    defaultShowCount: 2
  },
  actions: {
    label: '操作',
    width: 250,
    fixed: 'right',
    buttonGroup: [
      {
        label: '编辑',
        type: 'primary',
        onClick: (row) => console.log('编辑:', row)
      },
      {
        label: '删除',
        type: 'danger',
        confirm: '确定要删除吗？',
        onClick: (row) => console.log('删除:', row)
      },
      {
        label: '更多',
        dropdown: [
          { label: '重置密码', onClick: (row) => console.log('重置密码:', row) },
          { label: '分配角色', onClick: (row) => console.log('分配角色:', row) }
        ]
      }
    ]
  },
  pagination: {
    enabled: true,
    pageSize: 10
  },
  request: mockApi,
  immediate: true,
  exportable: true,
  exportFileName: '用户列表'
})

const getStatusType = (status: number) => {
  return status === 1 ? 'success' : 'danger'
}
</script>

<style scoped>
.pro-table-demo {
  /* 
      页面高度 = 100vh 
      - 导航栏高度 (Navbar) = 60px 
      - AppMain 的 padding = 40px (上下各 20px)
   */
  height: calc(100vh - 60px - 40px);
  display: flex;
  flex-direction: column;
}

:deep(.el-card) {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

:deep(.el-card__body) {
  flex: 1;
  overflow: hidden;
  padding: 0; /* 内部 ProTable 已经有 padding */
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
