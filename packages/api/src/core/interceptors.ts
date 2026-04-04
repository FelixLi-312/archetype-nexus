import { ApiError } from './error' 
import { getToken, removeToken } from '../utils/token' 
import type { AxiosInstance, AxiosResponse } from 'axios' 

export function setupInterceptors(instance: AxiosInstance) { 
  instance.interceptors.request.use((config: any) => { 
    const token = getToken() 
    if (token && config.headers) { 
      config.headers.Authorization = `Bearer ${token}` 
    } 
    return config 
  }) 

  instance.interceptors.response.use( 
    <T>(response: AxiosResponse<{ code: number; data: T; message: string }>) => { 
      const res = response.data 
      if (res.code !== 0 && (res.code < 200 || res.code >= 300)) { 
        throw new ApiError(res.code, res.message) 
      } 
      return res.data 
    }, 
    (error) => { 
      let message = error.message 
      let code = -1 

      if (error.response) { 
        code = error.response.status 
        switch (code) { 
          case 401: 
            message = '未授权，请重新登录' 
            removeToken() 
            break 
          case 403: 
            message = '拒绝访问' 
            break 
          case 404: 
            message = '资源不存在' 
            break 
          case 500: 
            message = '服务器错误' 
            break 
        } 
      } 

      return Promise.reject(new ApiError(code, message)) 
    } 
  ) 
} 
