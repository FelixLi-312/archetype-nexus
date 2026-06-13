<template>
  <div class="nx-search-form" :class="{ collapsed: !visible }">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NxTableSearchForm',
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    return {}
  },
})
</script>

<style lang="scss" scoped>
.nx-search-form {
  padding: 16px;
  border-bottom: 1px solid var(--el-border-color);
  transition: all 0.3s ease;

  &.collapsed {
    display: none;
  }
}
</style>
