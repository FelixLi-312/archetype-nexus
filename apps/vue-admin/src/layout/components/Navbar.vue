<template>
  <div class="navbar">
    <div class="left-part">
      <el-icon class="hamburger" @click="toggleSidebar">
        <Fold v-if="!isCollapse" />
        <Expand v-else />
      </el-icon>

      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item v-if="currentTitle">{{ currentTitle }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="right-part">
      <el-dropdown trigger="click">
        <div class="avatar-wrapper">
          <el-avatar
            :size="36"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />
          <span class="username">Admin</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="User">Profile</el-dropdown-item>
            <el-dropdown-item icon="Setting">Settings</el-dropdown-item>
            <el-dropdown-item divided icon="SwitchButton">Logout</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Expand, Fold } from '@element-plus/icons-vue'
defineProps<{
  isCollapse: boolean
}>()

const emit = defineEmits<{
  toggle: []
}>()

const route = useRoute()

const currentTitle = computed(() => route.meta?.title)

const toggleSidebar = () => {
  emit('toggle')
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 60px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  flex-shrink: 0;
}

.left-part {
  display: flex;
  align-items: center;
  gap: 20px;
}

.hamburger {
  font-size: 22px;
  cursor: pointer;
  transition: transform 0.3s;
  color: #5a5a5a;
}

.hamburger:hover {
  color: #409eff;
}

.right-part {
  display: flex;
  align-items: center;
}

.avatar-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin-left: 10px;
  font-size: 14px;
  color: #333;
}
</style>
