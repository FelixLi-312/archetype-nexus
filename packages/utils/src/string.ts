export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * 驼峰转短横线
 * @param str 驼峰字符串
 * @returns 短横线字符串
 * @description 该函数将驼峰字符串转换为短横线字符串，例如 'camelCase' 转换为 'camel-case'。
 */
export function camelToKebab(str: string) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

/**
 * 短横线转驼峰
 * @param str 短横线字符串
 * @returns 驼峰字符串
 * @description 该函数将短横线字符串转换为驼峰字符串，例如 'camel-case' 转换为 'camelCase'。
 */
export function kebabToCamel(str: string) {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * 截断字符串
 * @param str 要截断的字符串
 * @param length 截断长度
 * @param suffix 截断后缀，默认值为 '...'
 * @returns 截断后的字符串
 * @description 该函数返回一个截断后的字符串，该字符串的长度不超过指定的截断长度。如果原始字符串长度大于截断长度，则在截断位置添加指定的后缀。
 */
export function truncate(str: string, length: number, suffix: string = '...') {
  return str.length > length ? str.slice(0, length) + suffix : str
}

/**
 * 判断空字符串
 * @param str 要判断的字符串
 * @returns 如果字符串为空则返回 true，否则返回 false
 * @description 该函数返回一个布尔值，指示传入的字符串是否为空。
 */
export function isEmptyString(str: string): boolean {
  return str.trim().length === 0
}
