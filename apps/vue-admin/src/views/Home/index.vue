<template>
  <div class="main-container">
    <div class="dynamic-form-contaniner">
      <div class="flex justify-between items-center">
        <span class="text-lg font-bold">用户信息录入 (动态表单演示)</span>
        <el-button @click="handleReset">重置表单</el-button>
      </div>

      <!-- 动态表单组件 -->
      <DynamicForm
        ref="formRef"
        v-model="formData"
        :schema="formSchema"
        :inline="false"
        label-width="120px"
        size="default"
        @update:modelValue="onModelChange"
      >
        <!-- 底部操作栏插槽 -->
        <template #action="{ validate, reset }">
          <el-col :span="24" class="mt-4 flex justify-end gap-2">
            <el-button @click="reset">重置</el-button>
            <el-button type="primary" :loading="submitting" @click="handleSubmit(validate)">
              提交保存
            </el-button>
          </el-col>
        </template>
      </DynamicForm>

      <div class="mt-6 p-4 bg-gray-800 text-green-400 rounded font-mono text-sm">
        <div class="mb-2 text-white">当前表单数据 (Real-time):</div>
        <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
      </div>
    </div>
    <div class="pro-table-container">
      <Table />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { DynamicForm } from '@nexus/ui'
import type { FormItemSchema } from '@nexus/ui'
import { debounce, deepClone, formatDate } from '@nexus/utils'
import Table from './Table.vue'
const formRef = ref<InstanceType<typeof DynamicForm>>()
const submitting = ref(false)

// 1. 定义响应式表单数据
const formData = reactive({
  username: '',
  age: undefined,
  role: '',
  hobby: [],
  status: true,
  birthday: '',
  description: '',
  region: [], // 级联选择
  isVip: false
})

// 2. 定义 Schema 配置
const formSchema: FormItemSchema[] = [
  {
    prop: 'username',
    label: '用户名',
    type: 'input',
    span: 12,
    placeholder: '请输入登录账号',
    rules: [
      { required: true, message: '用户名不能为空', trigger: 'blur' },
      { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
    ],
    props: {
      maxlength: 20,
      showWordLimit: true,
      clearable: true // 💡 优化：增加清空按钮，提升体验
    }
  },
  {
    prop: 'age',
    label: '年龄',
    type: 'number',
    span: 12,
    // 💡 优化：给一个默认值，避免显示 NaN 或空
    // 注意：需要在父组件 model 中初始化，或者在这里不传默认值由表单控制
    rules: [
      { required: true, message: '请填写年龄', trigger: 'blur' },
      { type: 'number', min: 1, max: 120, message: '年龄必须在 1-120 之间', trigger: 'blur' }
    ],
    props: {
      min: 1,
      max: 120,
      controlsPosition: 'right',
      step: 1, // 💡 优化：明确步长为 1
      placeholder: '请输入年龄' // 💡 优化：Number 组件也需要 placeholder
    }
  },
  {
    prop: 'role',
    label: '角色权限',
    type: 'select',
    span: 12,
    placeholder: '请选择用户角色',
    rules: [{ required: true, message: '请选择角色', trigger: 'change' }],
    props: {
      clearable: true,
      filterable: true,
      options: [
        { label: '超级管理员', value: 'admin' },
        { label: '普通编辑', value: 'editor' },
        { label: '访客', value: 'guest', disabled: true }
      ],
      onChange: (val) => {
        console.log(`[动态事件] 角色变更为: ${val}`)
        // 示例：根据角色动态修改其他字段的值或状态
        if (val === 'admin') {
          // 假设你有方法可以访问 formData
          // formData.permissionLevel = 'full';
          console.log('赋予最高权限')
        }
      },
      onVisibleChange: (visible: boolean) => {
        console.log('下拉框展开/收起:', visible)
      }
    }
  },
  {
    prop: 'hobby',
    label: '兴趣爱好',
    type: 'checkbox',
    span: 12,
    // 💡 重要：CheckboxGroup 的 v-model 必须是数组 []
    // 确保你的 formData.hobby 初始化为 []
    props: {
      options: [
        { label: '阅读', value: 'reading' },
        { label: '运动', value: 'sports' },
        { label: '音乐', value: 'music' },
        { label: '编程', value: 'coding' }
      ],
      onChange: (val) => {
        console.log(`[动态事件] 兴趣爱好变更为: ${val}`)
      }
    }
  },
  {
    prop: 'status',
    label: '账户状态',
    type: 'switch',
    span: 12,
    // 💡 重要：Switch 默认绑定 boolean (true/false)
    // 如果你的业务需要 '1'/'0' 或 'on'/'off'，必须配置 active-value / inactive-value
    props: {
      activeText: '启用',
      inactiveText: '禁用',
      // style 属性在 Vue 中通常作为对象传递，或者使用内联样式类
      // 这里直接透传 style 字符串可能无效，建议用 class 或在父级控制
      inlinePrompt: true, // 💡 优化：文字显示在开关内部，更紧凑
      disabled: true
    }
  },
  {
    prop: 'birthday',
    label: '出生日期',
    type: 'date',
    span: 12,
    rules: [{ required: true, message: '请选择出生日期', trigger: 'change' }],
    props: {
      placeholder: '选择年份',
      type: 'month',
      onVisibleChange: (visible: boolean) => {
        console.log('日期选择器展开/收起:', visible)
      }
    }
  },
  {
    prop: 'description',
    label: '个人简介',
    type: 'textarea',
    span: 24,
    props: {
      rows: 4,
      maxlength: 200,
      showWordLimit: true,
      resize: 'none' // 💡 优化：禁止手动拖拽大小，保持布局整洁
    }
  },
  {
    prop: 'isVip',
    label: '是否 VIP',
    type: 'radio',
    span: 12,
    // 💡 优化：给一个默认值，否则单选框可能看起来都没选中
    props: {
      options: [
        { label: '是', value: true },
        { label: '否', value: false }
      ]
    }
  },

  {
    prop: 'vipLevel',
    label: 'VIP 等级',
    type: 'select',
    span: 12,
    // visible 函数里的 model 是你自己传进去的，这没问题
    visible: (model) => model.isVip === true,
    rules: [
      {
        required: true,
        message: '请选择 VIP 等级',
        trigger: 'change',

        // 注意：这里要用 formData，而不是 model
        validator: (_rule, value, callback) => {
          // 替换 'formData' 为你实际存储表单数据的变量名
          if (formData.isVip && !value) {
            callback(new Error('请选择 VIP 等级'))
          } else {
            callback()
          }
        }
      }
    ],
    props: {
      placeholder: '请选择等级',
      clearable: true,
      options: [
        { label: '黄金会员', value: 1 },
        { label: '钻石会员', value: 2 },
        { label: '至尊会员', value: 3 } // 💡 增加一个选项
      ]
    }
  }
]

// 监听数据变化
const onModelChange = (_val: any) => {
  // console.log('Form data updated', val);
}

// 提交处理
const handleSubmit = async (validateFn: () => Promise<boolean>) => {
  submitting.value = true
  try {
    const valid = await validateFn()
    if (valid) {
      console.log('提交的数据:', formData)
      ElMessage.success('提交成功！请查看控制台输出。')
      // TODO: 调用 API
    }
  } catch (error: any) {
    ElMessage.error('表单验证失败，请检查填写内容。', error)
  } finally {
    submitting.value = false
  }
}

// 重置处理
const handleReset = () => {
  formRef.value?.resetFields()
  ElMessage.info('表单已重置')
}


onMounted(() => {
  console.log('组件挂载完成')
  console.log(formatDate(new Date()))
  console.log(deepClone(formData))
})
</script>

<style lang="scss" scoped>
.main-container {
  padding: 20px;
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.dynamic-form-contaniner {
  height: 500px;
  width: 100%;
  overflow-y: auto;
}

.pro-table-container {
  height: 500px;
  width: 100%;
  overflow-y: auto;
}
</style>
