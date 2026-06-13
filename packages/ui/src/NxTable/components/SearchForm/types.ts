export interface SearchFormConfig {
  keywords?: string
  filters?: Record<string, any>
}

export interface SearchFormInstance {
  getValues(): SearchFormConfig
  setValues(values: SearchFormConfig): void
  reset(): void
}
