import { ref } from 'vue'

export function useSpan() {
  const spanMethod = ref<Function | null>(null)
  return {
    spanMethod,
    setSpanMethod(fn: Function) {
      spanMethod.value = fn
    },
  }
}
