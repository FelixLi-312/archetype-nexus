<template>
  <div class="nx-column-setting">
    <el-scrollbar max-height="300px" class="popover-scrollbar-y">
      <el-tree
        node-key="id"
        :default-checked-keys="checkedKeys"
        :data="columns"
        default-expand-all
        :props="treeProps"
        show-checkbox
        @check-change="handleCheckChange"
      />
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NxTableColumnSetting',
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    checkedKeys: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['check-change'],
  setup(props, { emit }) {
    const handleCheckChange = (data: any, checked: boolean) => {
      emit('check-change', data, checked)
    }

    return {
      treeProps: {
        label: (item: any) => (item.type === 'seq' ? '#' : item.title || item.field),
        children: 'children',
      },
      handleCheckChange,
    }
  },
})
</script>

<style lang="scss" scoped>
.nx-column-setting {
  padding: 8px 0;
}
</style>
