import { ref } from 'vue'

export function useEvent() {
  const listeners = ref<Record<string, Function>>({})
  return {
    listeners,
    on(name: string, handler: Function) {
      listeners.value[name] = handler
    },
    off(name: string) {
      delete listeners.value[name]
    },
  }
}
