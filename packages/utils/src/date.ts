type DateInput = Date | string | number | null | undefined

const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

const pad2 = (n: number) => n.toString().padStart(2, '0')

function toDate(input: DateInput): Date | null {
  if (input == null || input === '') return null
  if (input instanceof Date) {
    return Number.isNaN(input.getTime()) ? null : input
  }
  const date = new Date(input)
  return Number.isNaN(date.getTime()) ? null : date
}

/**
 * 格式化日期
 * @param date 日期对象 / 时间戳 / ISO 字符串
 * @param fmt  格式化字符串，默认 'YYYY-MM-DD HH:mm:ss'
 */
export function formatDate(date: DateInput, fmt = 'YYYY-MM-DD HH:mm:ss'): string {
  const d = toDate(date)
  if (!d) return ''

  const replacements: Record<string, string> = {
    YYYY: d.getFullYear().toString(),
    MM: pad2(d.getMonth() + 1),
    DD: pad2(d.getDate()),
    HH: pad2(d.getHours()),
    mm: pad2(d.getMinutes()),
    ss: pad2(d.getSeconds())
  }

  return fmt.replace(/YYYY|MM|DD|HH|mm|ss/g, (match) => replacements[match] ?? match)
}

/**
 * 获取当前星期几
 */
export function getCurrentWeekday(): string {
  return WEEKDAYS[new Date().getDay()]
}

/**
 * 计算两个日期之间的相差天数
 */
export function getDiffDays(date1: DateInput, date2: DateInput): number | null {
  const d1 = toDate(date1)
  const d2 = toDate(date2)
  if (!d1 || !d2) return null
  const diffTime = d2.getTime() - d1.getTime()
  return Math.round(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * 获取当前周的起止日期（周一到周日）
 */
export function getCurrentWeekRange(): { start: Date; end: Date } {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek
  const start = new Date(today)
  start.setDate(today.getDate() + diffToMonday)
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return { start, end }
}

/**
 * 时间戳转字符串
 */
export function timestampToString(timestamp: number): string {
  return formatDate(timestamp)
}

/**
 * 字符串转日期对象
 */
export function stringToDate(str: string): Date | null {
  return toDate(str)
}
