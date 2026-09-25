<template>
  <el-pagination
    v-bind="options"
    :current-page="currentPage"
    :page-size="pageSize"
    :layout="pageLayout"
    :pager-count="pagerCount"
    @update:current-page="setPage"
    @update:page-size="setSize"
  ></el-pagination>
</template>
<script lang="ts">
import type { ElPagination } from 'element-plus'
import { defineComponent, type PropType, ref, watch, computed } from 'vue'

export default defineComponent({
  name: 'Pagination',
  props: {
    options: {
      type: Object as PropType<
        {
          noAutoLayout?: boolean //关闭手机模式自动更改
          change: (page: number, size: number) => void //page或size改变时触发
        } & InstanceType<typeof ElPagination>['$props']
      >,
      required: true
    }
  },
  setup(props) {
    const currentPage = ref(1)
    watch(
      () => props.options?.currentPage,
      (page) => {
        if (page !== undefined) {
          currentPage.value = page
        }
      },
      { immediate: true }
    )

    const setPage = (page: number) => {
      currentPage.value = page
      props.options?.change?.(currentPage.value, pageSize.value)
    }

    const pageSize = ref(10)
    watch(
      () => props.options?.pageSize,
      (size) => {
        if (size !== undefined) {
          pageSize.value = size
        }
      },
      { immediate: true }
    )

    const setSize = (size: number) => {
      pageSize.value = size
      props.options?.change?.(currentPage.value, pageSize.value)
    }

    // 计算属性用于模板
    const pageLayout = computed(
      () => props.options?.layout || 'total, sizes, prev, pager, next, jumper'
    )
    const pagerCount = computed(() => props.options?.pagerCount || 7)

    return {
      currentPage,
      pageSize,
      setPage,
      setSize,
      pageLayout,
      pagerCount
    }
  }
})
</script>
