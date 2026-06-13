import type { ExportMenuItem } from './props'

export interface ToolbarEmits {
  refresh: []
  add: []
  'update:search': [value: string]
  search: [value: string]
  export: [item: ExportMenuItem]
  print: []
  'toggle-search': []
}
