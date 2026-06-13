import type { ColumnSettingColumn } from './props'

export interface ColumnSettingInstance {
  getCheckedColumns(): ColumnSettingColumn[]
  setColumns(columns: ColumnSettingColumn[]): void
}
