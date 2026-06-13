<template>
  <vxe-table ref="vxeTableRef" :max-height="maxHeight" v-bind="$attrs">
    <slot />
    <template v-if="$slots.loading" #loading>
      <slot name="loading" />
    </template>
    <template v-if="$slots.empty" #empty>
      <slot name="empty" />
    </template>
  </vxe-table>
</template>

<script lang="ts">
import { defineComponent, useTemplateRef } from 'vue'
import type { VxeTableInstance } from 'vxe-table'

export default defineComponent({
  name: 'NxBaseTable',
  inheritAttrs: false,
  props: {
    maxHeight: {
      type: [Number, String],
      default: '100%',
    },
  },
  setup(props, { expose }) {
    const vxeTableRef = useTemplateRef<VxeTableInstance>('vxeTableRef')

    const getVxeTable = () => {
      return vxeTableRef.value
    }

    expose({
      vxeTableRef,
      getVxeTable,
    })

    return {
      vxeTableRef,
    }
  },
})
</script>
