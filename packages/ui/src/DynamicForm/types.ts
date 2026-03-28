// src/components/DynamicForm/types.ts
import type { ComponentSize, FormItemRule } from 'element-plus'
import type { Component, VNode } from 'vue'
import type {
  InputProps,
  SelectProps,
  RadioGroupProps,
  CheckboxGroupProps,
  DatePickerProps,
  SwitchProps,
  CascaderProps,
  InputNumberProps,
  // TimePickerProps,
  SliderProps,
  inputEmits,
  selectEmits,
  radioEmits,
  checkboxEmits,
  // datepickerEmits,
  switchEmits,
  cascaderEmits,
  sliderEmits,
  inputNumberEmits
} from 'element-plus'
/**
 * 支持的表单组件类型
 */
export type FieldType =
  | 'input'
  | 'textarea'
  | 'number'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'datetime'
  | 'time'
  | 'switch'
  | 'cascader'
  | 'slider'

/**
 * 下拉选项结构
 */
export interface OptionItem {
  label: string
  value: any
  disabled?: boolean
  children?: OptionItem[] // 用于级联选择器
}

/**
 * 核心逻辑：根据 type 映射对应的 Element Plus 组件 Props
 */
type ComponentPropsMap = {
  input: InputProps
  textarea: InputProps // textarea 复用 InputProps
  number: InputNumberProps
  select: SelectProps
  radio: RadioGroupProps
  checkbox: CheckboxGroupProps
  date: DatePickerProps
  datetime: DatePickerProps
  // time: TimePickerProps;
  switch: SwitchProps
  cascader: CascaderProps
  slider: SliderProps
}

/**
 * 🔧 工具类型：将 kebab-case 转换为 camelCase
 * 例如: "visible-change" -> "visibleChange"
 */
type KebabToCamel<S extends string> = S extends `${infer First}-${infer Rest}`
  ? `${First}${Capitalize<KebabToCamel<Rest>>}`
  : S
/**
 * 🔥 核心工具：将 Emits 对象类型转换为 { onEventName: handler } 格式
 *
 * 原理：
 * 1. keyof T: 获取所有事件名 (如 'change', 'focus')
 * 2. as `on${Capitalize<string & K>}`: 重映射键名为 'onChange', 'onFocus'
 * 3. T[K]: 获取事件处理函数的类型 (通常返回 boolean 或 void)
 * 4. (...args: infer P) => any: 提取参数类型
 * 5. 最终结果: { onChange: (val: any) => void, ... }
 */
type EmitsToEvents<T extends Record<string, any>> = {
  [K in keyof T as K extends string // 1. 先将 K 转为字符串
    ? // 2. 将 kebab-case 转为 camelCase (visible-change -> visibleChange)
      `on${Capitalize<KebabToCamel<K>>}`
    : never]?: T[K] extends (...args: infer P) => any ? (...args: P) => void : never
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const datepickerEmits: {
  'update:modelValue': (value: string) => boolean
  change: (value: string, evt?: Event) => boolean
  focus: (evt: FocusEvent) => boolean
  blur: (evt: FocusEvent) => boolean
  clear: (evt: MouseEvent | undefined) => boolean
  'calendar-change': (value: string[]) => boolean
  'panel-change': (value: string[]) => boolean
  'visible-change': (visible: boolean) => boolean
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const timepickerEmits: {
  'update:modelValue': (value: string) => boolean
  change: (value: string, evt?: Event) => boolean
  focus: (evt: FocusEvent) => boolean
  blur: (evt: FocusEvent) => boolean
  clear: (evt: MouseEvent | undefined) => boolean
  'visible-change': (visible: boolean) => boolean
}

/**
 * 构建组件事件映射表
 * 使用 typeof 获取导出常量的类型，再转换
 */
type ComponentEventsMap = {
  input: EmitsToEvents<typeof inputEmits>
  textarea: EmitsToEvents<typeof inputEmits> // textarea 复用 input emits
  number: EmitsToEvents<typeof inputNumberEmits>
  select: EmitsToEvents<typeof selectEmits>
  radio: EmitsToEvents<typeof radioEmits>
  checkbox: EmitsToEvents<typeof checkboxEmits>
  date: EmitsToEvents<typeof datepickerEmits>
  datetime: EmitsToEvents<typeof datepickerEmits>
  time: EmitsToEvents<typeof timepickerEmits> // 确保引入了 timepickerEmits
  switch: EmitsToEvents<typeof switchEmits>
  cascader: EmitsToEvents<typeof cascaderEmits>
  slider: EmitsToEvents<typeof sliderEmits>
}

/**
 * 单个表单项的配置 Schema
 */
export type FormItemSchema = {
  [T in FieldType]: {
    /** 字段名 */
    prop: string
    /** 标签文本 */
    label?: string
    /** 组件类型 (当前分支固定为 T) */
    type: T
    /** 占位符 */
    placeholder?: string
    /** 校验规则 */
    rules?: FormItemRule[]
    /**
     * 组件属性：
     * 1. 自动继承对应 Element 组件的 Props (如 InputProps)
     * 2. 额外允许传入 options (用于 select/radio/checkbox)
     * 3. 额外允许传入事件处理函数 (如 onChange, onFocus)
     * 4. 允许传入任意其他属性 (兜底)
     */
    props?: Partial<ComponentPropsMap[Extract<T, keyof ComponentPropsMap>]> & {
      // 2. 组件事件 (全部可选)
      [K in keyof ComponentEventsMap[T]]?: ComponentEventsMap[T][K]
    } & {
      options?: OptionItem[]
      [key: string]: any
    }
    /** 栅格占比 */
    span?: number
    /** 动态显示控制 */
    visible?: boolean | ((model: Record<string, any>) => boolean)
    /** 自定义渲染 */
    render?: (scope: { model: Record<string, any>; field: FormItemSchema }) => VNode | Component
    /** 标签宽度 */
    labelWidth?: string | number
  }
}[FieldType]
/**
 * 动态表单组件 Props
 */
export interface DynamicFormProps {
  /** 表单配置 Schema 数组 */
  schema: FormItemSchema[]
  /** 表单数据对象 (支持 v-model) */
  modelValue: Record<string, any>
  /** 是否行内表单 */
  inline?: boolean
  /** 标签宽度 */
  labelWidth?: string | number
  /** 组件尺寸 */
  size?: ComponentSize
  /** 是否禁用所有表单项 */
  disabled?: boolean
  /** 标签位置 */
  labelPosition?: 'left' | 'right' | 'top'
  /** 栅格间隔 */
  gutter?: number
}

/**
 * 暴露给父组件的方法
 */
export interface DynamicFormExpose {
  validate: () => Promise<boolean>
  resetFields: () => void
  clearValidate: (props?: string | string[]) => void
  getFormData: () => Record<string, any>
}
