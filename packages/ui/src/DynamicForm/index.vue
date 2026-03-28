<!-- src/components/DynamicForm/index.vue -->
<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import type { DynamicFormExpose, DynamicFormProps, FormItemSchema } from './types'
import { ElCol, ElForm, ElFormItem, ElRow } from 'element-plus'
import { computed, ref } from 'vue'
import { componentMap, hasOptionsTypes, optionComponentMap } from './componentMap'

const props = withDefaults(defineProps<DynamicFormProps>(), {
  inline: false,
  labelWidth: '100px',
  size: 'default',
  disabled: false,
  labelPosition: 'right',
  gutter: 20
})

const emit = defineEmits(['update:modelValue'])
const formRef = ref<FormInstance>()

// 1. 双向绑定核心：Computed Getter/Setter
const internalModel = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 2. 过滤可见表单项
const visibleSchema = computed(() => {
  return props.schema.filter((item) => {
    if (typeof item.visible === 'function') {
      return item.visible(internalModel.value)
    }
    return item.visible !== false
  })
})

// 3. 动态生成校验规则
const computedRules = computed<FormRules>(() => {
  const rules: FormRules = {}
  visibleSchema.value.forEach((item) => {
    if (item.rules && item.rules.length) {
      rules[item.prop] = item.rules
    }
  })
  return rules
})

// 工具：获取组件
function getComponent(type: string) {
  return componentMap[type] || componentMap.input
}

// 工具：获取子选项组件名
function getOptionComponent(type: string) {
  return optionComponentMap[type] || 'el-option'
}

// 工具：智能生成 Placeholder
function getPlaceholder(item: FormItemSchema) {
  if (item.placeholder) return item.placeholder
  const action = ['select', 'radio', 'checkbox', 'date', 'time', 'cascader'].includes(item.type)
    ? '请选择'
    : '请输入'
  return `${action}${item.label || ''}`
}

// 工具：处理组件 Props (清洗和转换)
function getComponentProps(item: FormItemSchema) {
  // 关键修改 1：断言为 Record<string, any>
  // 这样 TS 就不会去检查 InputProps 和 SelectProps 的冲突，允许我们自由操作
  const extraProps = { ...(item.props as Record<string, any>) }

  // 移除不应该直接透传给主组件的属性 (options 是我们自定义的配置)
  delete extraProps.options

  // 特殊类型处理
  if (item.type === 'textarea') {
    extraProps.type = 'textarea'
  } else if (item.type === 'number') {
    // ElInputNumber 不需要 type 属性，如果有则删除
    delete extraProps.type
  } else if (['date', 'datetime', 'time'].includes(item.type)) {
    // 设置 date-picker 或 time-picker 的 type
    if (!extraProps.type) {
      extraProps.type = item.type === 'datetime' ? 'datetime' : item.type
    }
  }

  //  关键修改 2：返回时再次断言为 any 或 Record<string, any>
  // 因为返回的对象混合了不同组件的属性逻辑，严格类型无法描述它
  return extraProps as Record<string, any>
}

// 4. 暴露方法
async function validate(): Promise<boolean> {
  if (!formRef.value) return false
  try {
    await formRef.value.validate()
    return true
  } catch (error) {
    console.error('Form validation failed:', error)
    return false
  }
}

function resetFields() {
  formRef.value?.resetFields()
}

function clearValidate(props?: string | string[]) {
  formRef.value?.clearValidate(props)
}

function getFormData() {
  return { ...internalModel.value }
}

defineExpose<DynamicFormExpose>({
  validate,
  resetFields,
  clearValidate,
  getFormData
})
</script>

<template>
  <ElForm
    ref="formRef"
    :model="internalModel"
    :rules="computedRules"
    :inline="inline"
    :label-width="labelWidth"
    :size="size"
    :label-position="labelPosition"
    :disabled="disabled"
    v-bind="$attrs"
    class="dynamic-form-container"
  >
    <ElRow :gutter="gutter">
      <template v-for="item in visibleSchema" :key="item.prop">
        <ElCol :span="item.span || (inline ? undefined : 24)">
          <ElFormItem :label="item.label" :prop="item.prop" :label-width="item.labelWidth">
            <!-- 1. 自定义渲染插槽 (最高优先级) -->
            <component :is="item.render" v-if="item.render" :model="internalModel" :field="item" />

            <!-- 2. 默认组件渲染 -->
            <component
              :is="getComponent(item.type)"
              v-else
              v-model="internalModel[item.prop]"
              :placeholder="getPlaceholder(item)"
              :disabled="item.props?.disabled || disabled"
              :clearable="item.props?.clearable ?? true"
              v-bind="getComponentProps(item)"
              class="width-full"
            >
              <!-- 处理 Options (Select/Radio/Checkbox/Cascader) -->
              <template v-if="hasOptionsTypes.includes(item.type) && item.props?.options">
                <component
                  :is="getOptionComponent(item.type)"
                  v-for="opt in item.props.options"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                  :disabled="opt.disabled"
                >
                  {{ opt.label }}
                  <!-- 级联选择器的 children 递归通常由组件内部处理，这里主要处理扁平列表 -->
                </component>
              </template>

              <!-- 级联选择器特殊处理 (如果需要手动展开 children) -->
              <template v-if="item.type === 'cascader' && item.props?.options">
                <!-- Cascader 通常直接通过 props 传递 options，不需要内部插槽循环，除非是自定义节点 -->
              </template>
            </component>
          </ElFormItem>
        </ElCol>
      </template>

      <!-- 操作按钮插槽 -->
      <slot name="action" :validate="validate" :reset="resetFields" :model="internalModel" />
    </ElRow>
  </ElForm>
</template>

<style scoped>
.dynamic-form-container :deep(.el-form-item) {
  margin-bottom: 22px;
}
/* 确保输入框在栅格内占满宽度 */
.dynamic-form-container :deep(.el-input),
.dynamic-form-container :deep(.el-select),
.dynamic-form-container :deep(.el-cascader),
.dynamic-form-container :deep(.el-date-editor) {
  width: 100%;
}
</style>
