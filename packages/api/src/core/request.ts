import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios' 
import { setupInterceptors } from './interceptors' 
import { API_CONFIG, AI_API_CONFIG } from './config' 

export interface RequestInstance extends Omit<AxiosInstance, 'get' | 'post' | 'put' | 'patch' | 'delete' | 'request'> {
  <T = any>(config: AxiosRequestConfig): Promise<T>;
  <T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  request<T = any>(config: AxiosRequestConfig): Promise<T>;
}

export function createRequest(config: any): RequestInstance { 
  const instance = axios.create(config) 
  setupInterceptors(instance) 
  return instance as unknown as RequestInstance 
} 

export const request = createRequest(API_CONFIG) 
export const aiRequest = createRequest(AI_API_CONFIG) 
