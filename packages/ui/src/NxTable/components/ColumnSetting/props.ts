import type { VxeTableDefines } from 'vxe-table'

export interface ColumnSettingColumn {
  id: string
  field?: string
  title?: string
  type?: string
  visible?: boolean
  children?: ColumnSettingColumn[]
}

export interface ColumnSettingProps {
  columns?: ColumnSettingColumn[]
  checkedKeys?: string[]
}
