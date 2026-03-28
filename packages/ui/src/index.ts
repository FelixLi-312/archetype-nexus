// packages/ui/src/index.ts
// export * from './DynamicForm/index.vue'
// export * from './Map/index.vue'
// export * from './ProTable/index.vue'

// 如果想按模块导出
// export * as DynamicForm from './DynamicForm'
// export * as Map from './Map'
// export * as ProTable from './ProTable'
export { default as DynamicForm } from './DynamicForm'
export * from './DynamicForm'

export { default as Map } from './Map'
export * from './Map'

export { default as ProTable } from './ProTable'
export * from './ProTable'

export * from './install'
