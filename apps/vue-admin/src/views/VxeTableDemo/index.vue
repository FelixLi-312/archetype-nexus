<template>
  <div class="vxe-table-demo">
    <h2>NxTable 组件使用示例</h2>
    <NxTable
      :columns="tableColumn"
      :data="tableData"
      :pagination-options="paginationOptions"
      :quick-search="quickSearch"
      @update:quickSearch="quickSearch = $event"
      @quickSearch="handleQuickSearch"
      @refresh="handleRefresh"
      @add="handleAdd"
    >
      <template #buttons>
        <el-button type="success" @click="handleCustomAction">自定义操作</el-button>
      </template>
      <template #search>
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="姓名">
            <el-input v-model="searchForm.name" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="年龄">
            <el-input v-model="searchForm.age" placeholder="请输入年龄" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </template>
    </NxTable>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { NxTable } from '@nexus/ui'

interface RowVO {
  id: number
  name: string
  role: string
  sex: string
  age: number
  address: string
}

const tableColumn = ref<any>([
  { type: 'checkbox', width: 60 },
  { type: 'seq', width: 70 },
  { field: 'name', title: '姓名', sortable: true },
  { field: 'sex', title: '性别' },
  { field: 'age', title: '年龄', sortable: true },
  { field: 'role', title: '角色' },
  { field: 'address', title: '地址' },
  {
    title: '操作',
    width: 120,
    slots: {
      default: 'action'
    }
  }
])

const tableData = ref<RowVO[]>([
  { id: 10001, name: '张三', role: '开发', sex: '男', age: 28, address: '北京市' },
  { id: 10002, name: '李四', role: '测试', sex: '女', age: 22, address: '广州市' },
  { id: 10003, name: '王五', role: '产品', sex: '男', age: 32, address: '上海市' },
  { id: 10004, name: '赵六', role: '设计', sex: '女', age: 24, address: '上海市' }
])

const quickSearch = ref('')
const searchForm = reactive({
  name: '',
  age: ''
})

const paginationOptions = ref({
  total: 100,
  currentPage: 1,
  pageSize: 10,
  pageSizes: [10, 20, 50, 100],
  layout: 'total, sizes, prev, pager, next, jumper'
})

const handleQuickSearch = (value: string) => {
  console.log('快速搜索:', value)
  // 实现搜索逻辑
}

const handleRefresh = () => {
  console.log('刷新数据')
  // 实现刷新逻辑
}

const handleAdd = () => {
  console.log('添加数据')
  // 实现添加逻辑
}

const handleCustomAction = () => {
  console.log('自定义操作')
  // 实现自定义逻辑
}

const handleSearch = () => {
  console.log('高级搜索:', searchForm)
  // 实现高级搜索逻辑
}
</script>

<style lang="scss" scoped>
.vxe-table-demo {
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;

  h2 {
    margin-bottom: 20px;
  }

  .demo-form-inline {
    margin-bottom: 20px;
  }
}
</style>
