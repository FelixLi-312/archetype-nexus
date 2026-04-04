import { ref, type Ref } from 'vue' 
import type { ApiError } from '../core/error' 

export interface UseRequestReturn<T> {
  loading: Ref<boolean>
  data: Ref<T | null>
  error: Ref<ApiError | null>
  run: () => Promise<void>
}

export function useRequest<T>(apiFn: () => Promise<T>): UseRequestReturn<T> { 
  const loading = ref(false) 
  const data = ref<T | null>(null) as Ref<T | null>
  const error = ref<ApiError | null>(null) as Ref<ApiError | null>

  const run = async () => { 
    loading.value = true 
    try { 
      data.value = await apiFn() 
    } catch (err: any) { 
      error.value = err 
    } finally { 
      loading.value = false 
    } 
  } 

  return { loading, data, error, run } 
} 
