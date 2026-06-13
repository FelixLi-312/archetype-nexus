export interface NxTablePlugin {
  name: string
  install: () => void
}

export function createPlugin(plugin: NxTablePlugin) {
  return plugin
}
