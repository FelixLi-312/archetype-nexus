import { reactive } from 'vue'

export function createTable<T extends object = object>(options: T) {
  return reactive(options) as T
}
