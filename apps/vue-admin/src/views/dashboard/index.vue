/**
 * 实现日期选择器的右侧自定义图标，隐藏默认左侧图标
*/
<script setup lang="ts">
import { ref } from 'vue'
import { Calendar } from '@element-plus/icons-vue'

const date = ref('')
</script>

<template>
  <div class="p-4">
    <el-date-picker
      v-model="date"
      type="date"
      :prefix-icon="Calendar"
      placeholder="请选择日期"
      class="custom-date-picker"
    />
  </div>
</template>

<style lang="scss" scoped>
.custom-date-picker {
  width: 100%;

  :deep(.el-input__wrapper) {
    display: flex !important;
    padding-left: 12px !important; // 恢复左侧正常的内边距
    padding-right: 8px !important;

    // 1. 将原本在左边的 prefix 移到右边
    .el-input__prefix {
      order: 2; // 提高排序权重，使其排在 input 后面
      margin-right: 0;
      margin-left: 4px; // 与输入框保持间距
    }

    // 2. 将输入框排在前面
    .el-input__inner {
      order: 1;
      flex: 1;
    }

    // 3. 如果有清除按钮 (suffix)，确保它在最右侧
    .el-input__suffix {
      order: 3;
    }
  }
}
</style>