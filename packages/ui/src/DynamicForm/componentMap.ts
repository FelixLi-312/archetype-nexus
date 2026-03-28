import type { Component } from 'vue'
// src/components/DynamicForm/componentMap.ts
import {
  ElCascader,
  // ElCheckbox,
  ElCheckboxGroup,
  ElDatePicker,
  ElInput,
  ElInputNumber,
  // ElOption,
  // ElRadio,
  ElRadioGroup,
  ElSelect,
  ElSlider,
  ElSwitch,
  ElTimePicker
} from 'element-plus'

export const componentMap: Record<string, Component> = {
  input: ElInput,
  textarea: ElInput,
  number: ElInputNumber,
  select: ElSelect,
  radio: ElRadioGroup,
  checkbox: ElCheckboxGroup,
  date: ElDatePicker,
  datetime: ElDatePicker,
  time: ElTimePicker,
  switch: ElSwitch,
  cascader: ElCascader,
  slider: ElSlider
}

// 需要内部循环渲染 Option/Checkbox/Radio 的类型
export const hasOptionsTypes = ['select', 'radio', 'checkbox']

// 获取子组件名称映射
export const optionComponentMap: Record<string, string> = {
  select: 'el-option',
  radio: 'el-radio',
  checkbox: 'el-checkbox'
}
