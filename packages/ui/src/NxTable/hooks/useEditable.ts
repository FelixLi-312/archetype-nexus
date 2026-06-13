import { ref } from 'vue'

export function useEditable() {
  const editable = ref(false)
  return {
    editable,
    toggleEditable() {
      editable.value = !editable.value
    },
  }
}
