import { inject, provide } from 'vue'

export interface ProTableContextValue {
  tableName?: string
  refresh?: () => void
}

export const NxTableContextKey = Symbol('NxTableContext')

export function provideProTableContext(context: ProTableContextValue) {
  provide(NxTableContextKey, context)
}

export function useProTableContext() {
  const context = inject<ProTableContextValue>(NxTableContextKey)
  if (!context) {
    throw new Error('useProTableContext must be used inside a NxTable provider')
  }
  return context
}
