/**
 * 深拷贝对象
 * @param obj 要拷贝的对象
 * @returns 深拷贝后的对象
 * @description 该函数返回一个深拷贝后的对象，该对象与原对象完全独立，不会共享任何引用。
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}
/**
 * 判断是否为对象
 * @param obj 要判断的对象
 * @returns 如果是对象则返回 true，否则返回 false
 * @description 该函数返回一个布尔值，指示传入的参数是否为对象。
 */
export function isObject(obj: any): boolean {
  return obj !== null && typeof obj === 'object'
}

/**
 * 判断是否为函数
 * @param fn 要判断的函数
 * @returns 如果是函数则返回 true，否则返回 false
 * @description 该函数返回一个布尔值，指示传入的参数是否为函数。
 */
export function isFunction(fn: any): boolean {
  return typeof fn === 'function'
}

/**
 * 判断对象是否为空
 * @param obj 要判断的对象
 * @returns 如果对象为空则返回 true，否则返回 false
 * @description 该函数返回一个布尔值，指示传入的对象是否为空。
 */
export function isEmptyObject(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0
}
