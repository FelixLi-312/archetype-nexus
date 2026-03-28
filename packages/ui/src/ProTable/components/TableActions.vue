/** * 表格操作列组件 * 用于展示表格的操作按钮，如编辑、删除等 * 支持自定义按钮配置和权限校验 */
<template>
  <el-table-column
    :label="config.label"
    :width="config.width || calcWidth"
    :min-width="config.minWidth"
    :align="config.align"
    :fixed="config.fixed"
    :show-overflow-tooltip="config.showOverflowTooltip"
    :class-name="config.className"
  >
    <template #default="scope">
      <div
        class="action-buttons-container"
        :style="{
          flexDirection: config.layout === 'vertical' ? 'column' : 'row',
          gap: config.gap + 'px',
          flexWrap: config.layout === 'vertical' ? 'nowrap' : 'wrap',
          alignItems: getAlignItems()
        }"
      >
        <template v-for="(btn, index) in visibleButtons" :key="index">
          <!-- A. 下拉菜单模式 -->
          <!-- <el-dropdown
            v-if="btn.dropdown && btn.dropdown.length"
            trigger="click"
            @command="
              (cmd) => {
                debugger
                cmd.onClick?.(scope.row)
              }
            "
            style="display: inline-block"
          >
            <component
              :is="btn.tag || 'el-button'"
              :type="btn.type"
              :icon="btn.icon"
              :size="btn.size || 'small'"
              :disabled="btn.disabled"
            >
              {{ btn.label }}
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </component>

            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="(sub, sIdx) in btn.dropdown"
                  :key="sIdx"
                  :command="() => sub.onClick?.(scope.row)"
                  :divided="sub.divided"
                  :disabled="sub.disabled"
                >
                  <el-icon v-if="sub.icon" style="margin-right: 5px"
                    ><component :is="sub.icon"
                  /></el-icon>
                  {{ sub.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown> -->

          <!-- B. 普通按钮/链接 -->
          <component
            :is="btn.tag || 'el-button'"
            :type="btn.type"
            :icon="btn.icon"
            :size="btn.size || 'small'"
            :link="btn.tag === 'el-link'"
            :disabled="btn.disabled"
            @click="btn.onClick?.(scope.row)"
            :style="{ marginRight: getButtonMargin(btn, index) }"
          >
            {{ btn.label }}
          </component>
        </template>
      </div>
    </template>
  </el-table-column>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import type { ActionsConfig, ActionButtonConfig } from '../types'

const props = defineProps<{
  config: ActionsConfig
}>()

defineEmits<{
  (e: 'action-click', data: { action: ActionButtonConfig; row: any }): void
  (e: 'dropdown-command', data: { action: any; row: any }): void
}>()

const visibleButtons = computed(() => {
  return props.config.buttonGroup?.filter((btn) => btn.isShow !== false) || []
})

const calcWidth = computed(() => {
  if (props.config.width) return props.config.width
  let estimated = 40
  visibleButtons.value.forEach((btn) => {
    estimated += btn.dropdown ? 80 : 60
    estimated += props.config.gap !== undefined ? props.config.gap : 8
  })
  return Math.min(
    estimated,
    props.config.minWidth !== undefined ? Number(props.config.minWidth) : 999
  )
})

const getButtonMargin = (btn: any, index: number) => {
  if (props.config.layout === 'vertical') return '0'
  if (index === visibleButtons.value.length - 1) return '0'
  return (
    (btn.gap !== undefined ? btn.gap : props.config.gap !== undefined ? props.config.gap : 8) + 'px'
  )
}

const getAlignItems = () => {
  const align = props.config.align
  if (align === 'center') return 'center'
  if (align === 'right') return 'flex-end'
  return 'flex-start'
}
</script>

<style scoped>
.action-buttons-container {
  display: flex;
  width: 100%;
}
</style>
