import { ref } from 'vue'

export function useToolbar() {
  const visible = ref(true)

  return {
    visible,
    toggle() {
      visible.value = !visible.value
    }
  }
}
