import type { VxeTableInstance } from 'vxe-table'

export interface BaseTableInstance {
  vxeTableRef: VxeTableInstance | undefined
  getVxeTable(): VxeTableInstance | undefined
}
