/**
 * 格式化日期
 * @param date 日期对象
 * @param fmt  格式化字符串，默认值为 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期字符串
 * @description 该函数返回一个格式化后的日期字符串，根据 fmt 参数指定的格式进行格式化。
 */
export function formatDate(date: Date, fmt = 'YYYY-MM-DD HH:mm:ss'): string {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return fmt
    .replace('YYYY', date.getFullYear().toString())
    .replace('MM', pad(date.getMonth() + 1))
    .replace('DD', pad(date.getDate()))
    .replace('HH', pad(date.getHours()))
    .replace('mm', pad(date.getMinutes()))
    .replace('ss', pad(date.getSeconds()))
}

/**
 * 获取当前星期几
 * @returns 当前星期几的字符串表示，例如 '星期一'
 * @description 该函数返回当前日期是星期几的字符串表示，例如 '星期一'。
 */
export function getCurrentWeekday(): string {
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  return weekdays[new Date().getDay()]
}


/**
 * 计算两个日期之间的相差天数
 * @param date1 第一个日期对象
 * @param date2 第二个日期对象
 * @returns 相差天数，为整数
 * @description 该函数返回两个日期之间的相差天数，为整数。
 */
export function getDiffDays(date1: Date, date2: Date): number {
  const diffTime = date2.getTime() - date1.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * 获取当前周的起止日期
 * @returns 当前周的起止日期对象，包含 start 和 end 属性，分别表示本周的第一天和最后一天
 * @description 该函数返回当前周的起止日期对象，包含 start 和 end 属性，分别表示本周的第一天和最后一天。
 */
export function getCurrentWeekRange(): { start: Date; end: Date } {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek
  const start = new Date(today.setDate(today.getDate() + diffToMonday))
  const end = new Date(start.setDate(start.getDate() + 6))
  return { start, end }
}

/**
 * 时间戳转字符串
 * @param timestamp 时间戳，单位为毫秒
 * @returns 格式化后的日期字符串，例如 '2023-01-01 00:00:00'
 * @description 该函数返回一个格式化后的日期字符串，根据 timestamp 参数指定的时间戳进行格式化。
 */
export function timestampToString(timestamp: number): string {
  return formatDate(new Date(timestamp))
}

/**
 * 字符串转日期对象
 * @param str 日期字符串，例如 '2023-01-01 00:00:00'
 * @returns 日期对象
 * @description 该函数返回一个日期对象，根据 str 参数指定的日期字符串进行解析。
 */
export function stringToDate(str: string): Date {
  return new Date(str)
}
