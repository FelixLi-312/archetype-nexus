import { request } from '../core/request' 
import { setToken, removeToken } from '../utils/token' 

export const login = async (data: { username: string; password: string }) => { 
  const res = await request.post<{ token: string }>('/auth/login', data) 
  setToken(res.token) 
  return res 
} 

export const logout = () => { 
  removeToken() 
} 
