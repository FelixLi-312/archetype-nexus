<template>
  <div class="nx-table-empty">
    <div class="empty-content">
      <melicon-empty-data class="empty-icon" />
      <p class="empty-text">{{ emptyText }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NxTableEmpty',
  props: {
    emptyText: {
      type: String,
      default: '暂无数据',
    },
  },
  setup() {
    return {}
  },
})
</script>

<style lang="scss" scoped>
.nx-table-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;

  .empty-content {
    text-align: center;

    .empty-icon {
      font-size: 48px;
      color: var(--el-text-color-placeholder);
      margin-bottom: 16px;
    }

    .empty-text {
      margin: 0;
      color: var(--el-text-color-secondary);
      font-size: 14px;
    }
  }
}
</style>
