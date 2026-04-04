<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h1 class="title">Nexus Admin</h1>
        <p class="subtitle">欢迎回来，请登录您的账号</p>
      </div>
      
      <el-form 
        ref="loginFormRef" 
        :model="loginForm" 
        :rules="loginRules" 
        class="login-form"
        label-position="top"
      >
        <el-form-item label="用户名" prop="username">
          <el-input 
            v-model="loginForm.username" 
            placeholder="请输入用户名" 
            :prefix-icon="User"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="请输入密码" 
            :prefix-icon="Lock"
            show-password
            clearable
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        
        <div class="form-footer">
          <el-checkbox v-model="rememberMe">记住我</el-checkbox>
          <el-link type="primary" :underline="false">忘记密码？</el-link>
        </div>
        
        <el-form-item>
          <el-button 
            type="primary" 
            :loading="loading" 
            class="login-button" 
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
        
        <div class="register-link">
          还没有账号？<el-link type="primary" @click="$router.push('/register')">立即注册</el-link>
        </div>
      </el-form>
      
      <div class="social-login">
        <p class="divider-text">其他登录方式</p>
        <div class="social-icons">
          <el-button circle class="icon-btn">
            <el-icon><ChatDotRound /></el-icon>
          </el-button>
          <el-button circle class="icon-btn">
            <el-icon><ChatLineRound /></el-icon>
          </el-button>
          <el-button circle class="icon-btn">
            <el-icon><ChatRound /></el-icon>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, ChatDotRound, ChatLineRound, ChatRound } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loginFormRef = ref()
const loading = ref(false)
const rememberMe = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名长度不能小于 3 位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于 6 位', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate()
  
  loading.value = true
  try {
    await userStore.login(loginForm)
    ElMessage.success('登录成功')
    
    const redirect = route.query.redirect as string || '/'
    router.push(redirect)
  } catch (error: any) {
    ElMessage.error(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  .login-box {
    width: 450px;
    padding: 40px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    
    .login-header {
      text-align: center;
      margin-bottom: 30px;
      
      .title {
        margin: 0;
        font-size: 32px;
        color: #333;
        font-weight: 800;
        letter-spacing: 1px;
      }
      
      .subtitle {
        margin-top: 10px;
        color: #666;
        font-size: 14px;
      }
    }
    
    .login-form {
      .form-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        font-size: 14px;
      }
      
      .login-button {
        width: 100%;
        height: 45px;
        font-size: 16px;
        font-weight: 600;
        border-radius: 8px;
        background: linear-gradient(to right, #667eea, #764ba2);
        border: none;
        transition: transform 0.2s, box-shadow 0.2s;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(118, 75, 162, 0.4);
        }
        
        &:active {
          transform: translateY(0);
        }
      }
      
      .register-link {
        text-align: center;
        margin-top: 20px;
        font-size: 14px;
        color: #666;
      }
    }
    
    .social-login {
      margin-top: 30px;
      text-align: center;
      
      .divider-text {
        position: relative;
        font-size: 12px;
        color: #999;
        margin-bottom: 20px;
        
        &::before, &::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 25%;
          height: 1px;
          background-color: #eee;
        }
        
        &::before { left: 0; }
        &::after { right: 0; }
      }
      
      .social-icons {
        display: flex;
        justify-content: center;
        gap: 20px;
        
        .icon-btn {
          font-size: 20px;
          color: #666;
          border-color: #eee;
          
          &:hover {
            color: #764ba2;
            border-color: #764ba2;
            background-color: rgba(118, 75, 162, 0.05);
          }
        }
      }
    }
  }
}
</style>
