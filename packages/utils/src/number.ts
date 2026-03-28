/**
 * 金额格式化
 * @param value 金额数值
 * @param locale 地区语言环境，如 'en-US' 表示英文美国
 * @param currency 货币单位，如 'USD' 表示美元
 * @returns 格式化后的金额字符串，如 '$1,234.56'
 */
export function formatCurrency(value: number, locale: string, currency: string) {
  return value.toLocaleString(locale, { style: 'currency', currency })
}

/**
 * 保留小数位
 * @param value 数值
 * @param digits 保留的小数位数
 * @returns 保留小数位后的数值字符串
 */
export function toFixedNumber(value: number, digits: number) {
  return value.toFixed(digits)
}

/**
 * 随机整数
 * @param min 最小值（包含）
 * @param max 最大值（包含）
 * @returns 随机整数
 */
export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 随机小数
 * @param min 最小值（包含）
 * @param max 最大值（包含）
 * @param digits 保留的小数位数
 * @returns 随机小数
 */
export function randomFloat(min: number, max: number, digits: number) {
  return parseFloat((Math.random() * (max - min + 1) + min).toFixed(digits))
}
