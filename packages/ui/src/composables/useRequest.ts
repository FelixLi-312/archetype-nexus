import { ref, type Ref } from 'vue'

export interface UseRequestReturn<T> {
  loading: Ref<boolean>
  data: Ref<T | null>
  error: Ref<{ code: number; message: string } | null>
  run: () => Promise<void>
}

export function useRequest<T>(apiFn: () => Promise<T>): UseRequestReturn<T> {
  const loading = ref(false)
  const data = ref<T | null>(null) as Ref<T | null>
  const error = ref<{ code: number; message: string } | null>(null)

  const run = async () => {
    loading.value = true
    try {
      data.value = await apiFn()
    } catch (err) {
      const apiError =
        err && typeof err === 'object' && 'code' in err && 'message' in err
          ? (err as { code: number; message: string })
          : { code: -1, message: err instanceof Error ? err.message : String(err) }
      error.value = apiError
    } finally {
      loading.value = false
    }
  }

  return { loading, data, error, run }
}
