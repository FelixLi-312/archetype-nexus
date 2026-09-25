<script setup lang="ts">
import { onMounted } from 'vue'
import { Calendar, User, Message, Timer } from '@element-plus/icons-vue'
import { useRequest, userApi } from '@nexus/api'

// 使用 @nexus/api 提供的 useRequest 钩子
const { data: userInfo, loading, error, run: fetchProfile } = useRequest(() => userApi.getProfile())

onMounted(() => {
  fetchProfile()
})
</script>

<template>
  <div class="dashboard-container p-6">
    <el-row :gutter="20">
      <!-- 个人信息卡片 -->
      <el-col :span="8">
        <el-card shadow="hover" v-loading="loading">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-bold">用户信息 (via useRequest)</span>
              <el-button type="primary" link @click="fetchProfile">刷新</el-button>
            </div>
          </template>
          
          <div v-if="error" class="text-red-500">
            加载失败: {{ error.message }}
          </div>
          
          <div v-else-if="userInfo" class="user-profile">
            <div class="flex items-center mb-4">
              <el-avatar :size="64" :src="userInfo.avatar" :icon="User" />
              <div class="ml-4">
                <h3 class="m-0 text-lg">{{ userInfo.username }}</h3>
                <p class="m-0 text-gray-500">ID: {{ userInfo.id }}</p>
              </div>
            </div>
            
            <div class="info-list">
              <div class="info-item flex items-center mb-2">
                <el-icon class="mr-2 text-gray-400"><Message /></el-icon>
                <span>{{ (userInfo as any).email || '未绑定邮箱' }}</span>
              </div>
              <div class="info-item flex items-center">
                <el-icon class="mr-2 text-gray-400"><Timer /></el-icon>
                <span>最后登录: {{ new Date().toLocaleString() }}</span>
              </div>
            </div>
          </div>
          
          <div v-else class="text-gray-400 text-center py-4">
            暂无数据
          </div>
        </el-card>
      </el-col>

      <!-- 原有的日期选择器演示 -->
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header>
            <span class="font-bold">组件演示</span>
          </template>
          <div class="p-4">
            <p class="mb-4 text-gray-500">日期选择器 (自定义图标在右侧):</p>
            <el-date-picker
              type="date"
              :prefix-icon="Calendar"
              placeholder="请选择日期"
              class="custom-date-picker"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-container {
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.custom-date-picker {
  width: 100%;

  :deep(.el-input__wrapper) {
    display: flex !important;
    padding-left: 12px !important;
    padding-right: 8px !important;

    .el-input__prefix {
      order: 2;
      margin-right: 0;
      margin-left: 4px;
    }

    .el-input__inner {
      order: 1;
      flex: 1;
    }

    .el-input__suffix {
      order: 3;
    }
  }
}

.user-profile {
  .info-item {
    color: #606266;
    font-size: 14px;
  }
}
</style>
