import { ref } from 'vue'

export function useTree() {
  const treeConfig = ref({})
  return {
    treeConfig,
    setTreeConfig(config: Record<string, any>) {
      treeConfig.value = config
    },
  }
}
