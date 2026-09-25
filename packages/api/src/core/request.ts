import axios, { type AxiosInstance, type AxiosRequestConfig, type CreateAxiosDefaults } from 'axios'
import { setupInterceptors } from './interceptors'
import { API_CONFIG, AI_API_CONFIG } from './config'

export interface RequestInstance extends Omit<
  AxiosInstance,
  'get' | 'post' | 'put' | 'patch' | 'delete' | 'request'
> {
  <T = unknown>(config: AxiosRequestConfig): Promise<T>
  <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>
  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>
  request<T = unknown>(config: AxiosRequestConfig): Promise<T>
}

export function createRequest(config: CreateAxiosDefaults): RequestInstance {
  const instance = axios.create(config)
  setupInterceptors(instance)
  return instance as unknown as RequestInstance
}

export const request = createRequest(API_CONFIG)
export const aiRequest = createRequest(AI_API_CONFIG)
