<template>
  <div class="report-container">
    <!-- 顶部填报单位 -->
    <div class="report-header">
      <span class="label">填报单位（盖章）：</span>
      <el-input v-model="formData.unitName" placeholder="请输入单位名称" style="width: 300px" />
    </div>

    <!-- 主报表表格 -->
    <table class="custom-table">
      <!-- 表头 -->
      <thead>
        <tr>
          <th style="width: 60px">代码</th>
          <th style="width: 220px">指标名称</th>
          <th style="width: 25%">普查数据</th>
          <th style="width: 25%">2024年更新数据</th>
          <th style="width: 100px">计量单位</th>
        </tr>
      </thead>

      <tbody>
        <!-- 辅助说明行 -->
        <tr class="sub-header-row">
          <td>丙</td>
          <td>甲</td>
          <td>1</td>
          <td></td>
          <td>乙</td>
        </tr>

        <!-- 分类标题 -->
        <tr class="section-title">
          <td colspan="5">一、基本概况</td>
        </tr>

        <!-- 01 学校名称 -->
        <tr>
          <td class="code-cell">01</td>
          <td class="label-cell">学校（机构）名称</td>
          <td class="data-cell"><el-input v-model="formData.name_01" size="small" /></td>
          <td class="data-cell"><el-input v-model="formData.update_name_01" size="small" /></td>
          <td class="unit-cell">（文字说明）</td>
        </tr>

        <!-- 02 详细地址 -->
        <tr>
          <td class="code-cell">02</td>
          <td class="label-cell">学校（机构）详细地址</td>
          <td class="data-cell"><el-input v-model="formData.address_02" size="small" /></td>
          <td class="data-cell"><el-input v-model="formData.update_address_02" size="small" /></td>
          <td class="unit-cell">（文字说明）</td>
        </tr>

        <!-- 03 标识码 -->
        <tr>
          <td class="code-cell">03</td>
          <td class="label-cell">学校（机构）标识码</td>
          <td class="data-cell"><el-input v-model="formData.code_03" size="small" /></td>
          <td class="data-cell"><el-input v-model="formData.update_code_03" size="small" /></td>
          <td class="unit-cell">（文字说明）</td>
        </tr>

        <!-- 04 办学类型（单选） -->
        <tr>
          <td class="code-cell">04</td>
          <td class="label-cell">学校（机构）办学类型（大类）</td>
          <td class="data-cell radio-cell">
            <el-radio-group v-model="formData.type_04" size="small">
              <el-radio label="base">基础教育</el-radio>
              <el-radio label="mid">中等职业</el-radio>
              <el-radio label="high">高等教育</el-radio>
            </el-radio-group>
          </td>
          <td class="data-cell radio-cell">
            <el-radio-group v-model="formData.update_type_04" size="small">
              <el-radio label="base">基础教育</el-radio>
              <el-radio label="mid">中等职业</el-radio>
              <el-radio label="high">高等教育</el-radio>
            </el-radio-group>
          </td>
          <td class="unit-cell">（单选）</td>
        </tr>

        <!-- 05 办学类型（多选） -->
        <tr>
          <td class="code-cell">05</td>
          <td class="label-cell">学校（机构）办学类型（中类）</td>
          <td class="data-cell checkbox-cell">
            <el-checkbox-group v-model="formData.type_05">
              <div class="checkbox-grid">
                <el-checkbox label="kindergarten">幼儿园</el-checkbox>
                <el-checkbox label="primary">小学</el-checkbox>
                <el-checkbox label="middle">初级中学</el-checkbox>
                <el-checkbox label="vocational_mid">职业初中</el-checkbox>
                <el-checkbox label="nine_year">九年一贯制</el-checkbox>
                <el-checkbox label="high_school">高级中学</el-checkbox>
                <el-checkbox label="complete_mid">完全中学</el-checkbox>
              </div>
            </el-checkbox-group>
          </td>
          <td class="data-cell checkbox-cell">
            <el-checkbox-group v-model="formData.update_type_05">
              <div class="checkbox-grid">
                <el-checkbox label="kindergarten">幼儿园</el-checkbox>
                <el-checkbox label="primary">小学</el-checkbox>
                <el-checkbox label="middle">初级中学</el-checkbox>
              </div>
            </el-checkbox-group>
          </td>
          <td class="unit-cell">（多选）</td>
        </tr>
      </tbody>
    </table>

    <!-- 底部签字信息栏 (新增部分) -->
    <div class="footer-signature">
      <!-- 使用 el-row 进行栅格布局 -->
      <el-row :gutter="20" class="info-row">
        <!-- 单位负责人 -->
        <el-col :span="5">
          <span class="field-label">单位负责人：</span>
          <el-input v-model="formData.manager_unit" class="inline-input" placeholder="姓名" />
        </el-col>

        <!-- 统计负责人 -->
        <el-col :span="5">
          <span class="field-label">统计负责人：</span>
          <el-input v-model="formData.manager_stats" class="inline-input" placeholder="姓名" />
        </el-col>

        <!-- 填表人 -->
        <el-col :span="5">
          <span class="field-label">填表人：</span>
          <el-input v-model="formData.form_filler" class="inline-input" placeholder="姓名" />
        </el-col>

        <!-- 联系电话 -->
        <el-col :span="5">
          <span class="field-label">联系电话：</span>
          <el-input v-model="formData.phone" class="inline-input" placeholder="号码" />
        </el-col>

        <!-- 报出日期 -->
        <el-col :span="4">
          <span class="field-label">报出日期：</span>
          <el-input v-model="formData.report_date" class="inline-input" placeholder="yyyy.mm.dd" />
        </el-col>
      </el-row>
    </div>

    <!-- 底部操作按钮 -->
    <div class="footer-actions">
      <el-button type="primary" @click="submitForm">保存数据</el-button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const formData = reactive({
  unitName: '',
  // ... (保持原有的01-05字段不变)
  name_01: '',
  update_name_01: '',
  address_02: '',
  update_address_02: '',
  code_03: '',
  update_code_03: '',
  type_04: 'base',
  update_type_04: '',
  type_05: ['kindergarten'],
  update_type_05: [],

  // --- 新增的底部字段 ---
  manager_unit: '陈莹', // 对应 单位负责人
  manager_stats: '韩婷', // 对应 统计负责人
  form_filler: '屠颖超', // 对应 填表人
  phone: '18161872050', // 对应 联系电话
  report_date: '2025.8.15' // 对应 报出日期
})

const submitForm = () => {
  console.log('提交的数据:', JSON.parse(JSON.stringify(formData)))
}
</script>

<style scoped>
/* ... (保持原有的样式不变) ... */
.report-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family:
    'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑',
    Arial, sans-serif;
}

.report-header {
  margin-bottom: 10px;
  text-align: left;
  font-size: 14px;
}
.report-header .label {
  margin-right: 10px;
  font-weight: bold;
}

/* 表格样式保持不变 */
.custom-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #000;
  margin-bottom: 20px;
}
.custom-table th,
.custom-table td {
  border: 1px solid #000;
  padding: 8px 10px;
  text-align: center;
}
.custom-table thead th {
  background-color: #f2f2f2;
  font-weight: bold;
}
.sub-header-row td {
  text-align: center;
  font-size: 12px;
  color: #666;
  background-color: #fafafa;
}
.section-title td {
  background-color: #eef1f6;
  font-weight: bold;
  text-align: left;
  padding-left: 15px;
}
.code-cell {
  width: 60px;
  background-color: #fafafa;
}
.label-cell {
  text-align: left;
  padding-left: 10px;
}
.data-cell {
  padding: 4px;
}
.unit-cell {
  color: #666;
  font-size: 12px;
}

/* --- 新增样式：底部签字栏 --- */
.footer-signature {
  margin: 20px 0;
  padding: 0 20px;
  text-align: left;
}

.info-row {
  font-size: 14px;
  color: #333;
}

.info-row .el-col {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.field-label {
  font-weight: bold;
  min-width: 70px; /* 保证标签对齐 */
  font-size: 13px;
}

/* 内联输入框样式：去除边框和背景，模拟下划线填空 */
.inline-input :deep(.el-input__wrapper) {
  box-shadow: none !important;
  border: none !important;
  background-color: transparent !important;
  padding: 0 !important;
  height: auto !important;
}

.inline-input :deep(.el-input__inner) {
  border: none !important;
  text-align: center;
  padding: 0 5px;
  background-color: transparent;
  border-bottom: 1px solid #000; /* 保留底部横线，符合报表习惯 */
}

/* 底部按钮 */
.footer-actions {
  text-align: right;
  padding: 0 20px;
  margin-bottom: 20px;
}
</style>
