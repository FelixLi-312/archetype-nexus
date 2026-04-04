import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userApi, type User } from '@/api/user'

export const useUserStore = defineStore(
  'nexus-user',
  () => {
    const token = ref('')
    const userInfo = ref<User | null>(null)

    // Getters
    const isLoggedIn = computed(() => !!token.value)
    const username = computed(() => userInfo.value?.username || 'Admin')
    const userAvatar = computed(() => userInfo.value?.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png')

    // Actions
    const login = async (loginData: any) => {
      const res = await userApi.login(loginData)
      const { accessToken, user } = res
      token.value = accessToken
      userInfo.value = user
      // Token is also managed by @nexus/api interceptor via localStorage
      localStorage.setItem('token', accessToken)
    }

    const logout = async () => {
      try {
        await userApi.logout()
      } finally {
        resetState()
      }
    }

    const getInfo = async () => {
      const res = await userApi.getInfo()
      userInfo.value = res
      return res
    }

    const resetState = () => {
      token.value = ''
      userInfo.value = null
      localStorage.removeItem('token')
    }

    const clearToken = () => {
      resetState()
    }

    return {
      token,
      userInfo,
      isLoggedIn,
      username,
      userAvatar,
      login,
      logout,
      getInfo,
      resetState,
      clearToken
    }
  },
  {
    persist: {
      key: 'nexus-user-store',
      storage: localStorage,
      pick: ['token', 'userInfo']
    }
  }
)
