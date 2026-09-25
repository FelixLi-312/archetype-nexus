/**
 * 数组去重
 */
export function uniqueArray<T>(arr: T[]): T[] {
  return Array.from(new Set(arr))
}

/**
 * 数组分块
 */
export function chunkArray<T>(arr: T[], size: number): T[][] {
  if (size <= 0) return []
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}

/**
 * 扁平化多维数组（支持任意深度）
 */
export function flattenArray<T>(arr: (T | T[])[]): T[] {
  return arr.reduce<T[]>((acc, val) => acc.concat(Array.isArray(val) ? flattenArray(val) : val), [])
}

/**
 * 按对象 key 排序（返回新数组，不改变原数组）
 */
export function sortByKey<T extends Record<string, unknown>>(
  arr: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...arr].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]

    if (aVal == null && bVal == null) return 0
    if (aVal == null) return order === 'asc' ? -1 : 1
    if (bVal == null) return order === 'asc' ? 1 : -1

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return order === 'asc' ? aVal - bVal : bVal - aVal
    }

    const aStr = String(aVal)
    const bStr = String(bVal)
    if (aStr < bStr) return order === 'asc' ? -1 : 1
    if (aStr > bStr) return order === 'asc' ? 1 : -1
    return 0
  })
}

/**
 * 按对象 key 分组
 */
export function groupBy<T extends Record<string, unknown>>(
  arr: T[],
  key: keyof T
): Record<string, T[]> {
  return arr.reduce<Record<string, T[]>>((acc, val) => {
    const rawValue = val[key]
    const groupKeyStr = String(rawValue)
    if (!acc[groupKeyStr]) {
      acc[groupKeyStr] = []
    }
    acc[groupKeyStr].push(val)
    return acc
  }, {})
}
