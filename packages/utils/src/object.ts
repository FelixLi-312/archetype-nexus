type Primitive = string | number | boolean | null | undefined | bigint | symbol

/**
 * 深拷贝对象
 * @param obj 要拷贝的对象
 * @returns 深拷贝后的对象
 * @description 优先使用原生 structuredClone，回退方案处理常见类型
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(obj)
    } catch {
      // structuredClone 不支持的类型（如 function、Symbol），继续回退
    }
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags) as T
  }
  if (obj instanceof Map) {
    const map = new Map()
    obj.forEach((value, key) => map.set(deepClone(key), deepClone(value)))
    return map as T
  }
  if (obj instanceof Set) {
    const set = new Set()
    obj.forEach((value) => set.add(deepClone(value)))
    return set as T
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as T
  }

  const clonedObj = {} as Record<string, unknown>
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = (obj as Record<string, unknown>)[key]
      if (typeof value === 'function' || typeof value === 'symbol') {
        clonedObj[key] = value
      } else {
        clonedObj[key] = deepClone(value)
      }
    }
  }
  return clonedObj as T
}

/**
 * 判断是否为对象（非 null）
 */
export function isObject(obj: unknown): obj is Record<string, unknown> {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj)
}

/**
 * 判断是否为函数
 */
export function isFunction(fn: unknown): fn is (...args: unknown[]) => unknown {
  return typeof fn === 'function'
}

/**
 * 判断是否为原始类型
 */
export function isPrimitive(value: unknown): value is Primitive {
  return (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'undefined' ||
    typeof value === 'bigint' ||
    typeof value === 'symbol'
  )
}

/**
 * 判断对象是否为空（无自有可枚举属性）
 */
export function isEmptyObject(obj: Record<string, unknown>): boolean {
  if (!isObject(obj)) return true
  return Object.keys(obj).length === 0
}
