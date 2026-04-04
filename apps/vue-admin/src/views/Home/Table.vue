<template>
  <div class="demo-page">
    <h2>企业级配置化表格演示</h2>

    <ProTable :data="tableData" :config="tableConfig" @search="handleSearch">
      <!-- 左侧工具栏插槽 -->
      <template #toolbar-left>
        <el-tag type="info">管理员视图</el-tag>
      </template>

      <!-- 自定义列渲染：价格 -->
      <template #priceRender="{ row }">
        <span style="color: #f56c6c; font-weight: bold">¥{{ row.price }}</span>
      </template>

      <!-- 自定义列渲染：状态 -->
      <template #statusSlot="{ row }">
        <el-tag :type="row.status === 1 ? 'success' : 'danger'">
          {{ row.status === 1 ? '正常' : '停用' }}
        </el-tag>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ProTable } from '@nexus/ui'
import { ElMessage } from 'element-plus'
import type { ProTableConfig } from '@nexus/ui'

const tableData = ref<any[]>([])
const total = ref(0)
const pageSize = ref(10)

// 自定义 Render 函数示例
const priceRenderFunc = (h: any, { row }: any) => {
  return h('span', { style: { color: '#67c23a', fontWeight: 'bold' } }, `$${row.price}`)
}

interface User {
  id: number
  username: string
  price: number
  status: number
  email: string
  phone: string
  province: string
  city: string
  address: string
}

const tableConfig = reactive<ProTableConfig<User>>({
  loading: false,
  border: true,
  stripe: true,
  selection: true,
  exportable: true,
  exportFileName: '用户数据报表.xlsx',
  // 1. 工具栏配置 (分左右)
  toolbar: [
    {
      label: '批量删除',
      type: 'danger',
      icon: 'Delete',
      position: 'left',
      onClick: () => {
        ElMessage.success(`点击了批量删除`)
      }
    },
    {
      label: '导入数据',
      type: 'primary',
      icon: 'Upload',
      position: 'right',
      onClick: () => ElMessage.success('点击了导入数据')
    },
    {
      label: '打印预览',
      type: 'info',
      icon: 'Printer',
      position: 'right',
      onClick: () => ElMessage.success('点击了打印预览')
    }
  ],

  // 2. 搜索栏配置
  searchConfig: [
    { prop: 'username', label: '用户名', type: 'input', placeholder: '输入用户名' },
    {
      prop: 'status',
      label: '状态',
      type: 'select',
      options: [
        { label: '正常', value: 1 },
        { label: '停用', value: 0 }
      ]
    },
    { prop: 'regDate', label: '注册日期', type: 'date' }
  ],

  // 3. 列配置
  columns: [
    { prop: 'id', label: 'ID', width: 80 },
    { prop: 'username', label: '用户名', minWidth: 120 },
    {
      prop: 'price',
      label: '价格',
      width: 100,
      align: 'right',
      render: priceRenderFunc // 使用函数渲染
    },
    {
      prop: 'status',
      label: '状态',
      width: 100,
      slot: 'statusSlot'
    },
    {
      label: '用户详细信息', // 父级标题
      align: 'center',
      children: [
        { prop: 'email', label: '邮箱', ellipsis: true },
        { prop: 'phone', label: '电话', width: 120 },
        // 嵌套分组也是支持的
        {
          label: '地址信息',
          children: [
            { prop: 'province', label: '省份', width: 100 },
            { prop: 'city', label: '城市', width: 100 },
            { prop: 'address', label: '详细地址', minWidth: 200 }
          ]
        }
      ]
    }
  ],

  // 4. 扁平化操作列配置
  actions: {
    label: '管理操作',
    width: 240,
    fixed: 'right',
    align: 'center',
    gap: 10,
    buttonGroup: [
      {
        label: '编辑',
        type: 'primary',
        icon: 'Edit',
        onClick: (row: any) => ElMessage.success(`点击了编辑 - 用户: ${row.username}`),
        gap: 15
      },
      {
        label: '查看',
        type: 'info',
        tag: 'el-link',
        onClick: (row: any) => ElMessage.success(`点击了查看 - 用户: ${row.username}`)
      },
      {
        label: '更多',
        type: 'text',
        icon: 'MoreFilled',
        dropdown: [
          {
            label: '审核日志',
            icon: 'Document',
            onClick: (row: any) => ElMessage.success(`点击了审核日志 - 用户: ${row.username}`)
          },
          {
            label: '导出数据',
            icon: 'Download',
            onClick: (row: any) => ElMessage.success(`点击了导出数据 - 用户: ${row.username}`)
          },
          {
            label: '删除账号',
            icon: 'Delete',
            divided: true,
            onClick: (row: any) => ElMessage.success(`点击了删除账号 - 用户: ${row.username}`)
          }
        ]
      }
    ]
  },

  // 分页配置
  pagination: {
    enabled: true,
    total: total.value,
    pageSize: pageSize.value,
    layout: 'total, sizes, prev, pager, next, jumper',
    size: 'small',
    background: false,
    onChange: (page, size) => {
      console.log('page, size ==> ', page, size)
    }
  }
})

const fetchData = () => {
  tableConfig.loading = true
  setTimeout(() => {
    tableData.value = Array.from({ length: 10 }).map((_, i) => ({
      id: i + 1,
      username: `User_${i}`,
      price: (Math.random() * 1000).toFixed(2),
      status: i % 2,
      email: `user${i}@example.com`,
      regDate: '2023-01-01',
      phone: `1380000${i}`,
      province: `省份${i}`,
      city: `城市${i}`,
      address: `详细地址${i}`
    }))
    total.value = 100
    tableConfig.pagination && Object.assign(tableConfig.pagination, { total: total.value })
    tableConfig.loading = false
  }, 500)
}

const handleSearch = (form: any) => {
  console.log('搜索:', form)
  fetchData()
}

fetchData()
</script>

<style scoped>
.demo-page {
  padding: 20px;
  min-height: 100vh;
}
</style>
