/**
 * 数组去重
 * @param arr 数组
 * @returns 去重后的数组
 */
export function uniqueArray<T>(arr: T[]): T[] {
  return Array.from(new Set(arr))
}
/**
 * 数组分块
 * @param arr 数组
 * @param size 每个块的大小
 * @returns 分块后的数组
 */
export function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}


/**
 * 扁平化多维数组
 * @param arr 多维数组
 * @returns 扁平化后的数组
 */
export function flattenArray<T>(arr: T[][]): T[] {
  return arr.reduce((acc, val) => acc.concat(val), [])
}

/**
 * 按对象 key 排序
 * @param arr 数组
 * @param key 排序键
 * @param order 排序顺序，'asc' 表示升序，'desc' 表示降序
 * @returns 排序后的数组
 */
export function sortByKey<T>(arr: T[], key: keyof T, order: 'asc' | 'desc'): T[] {
  return arr.sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    if (aVal < bVal) return order === 'asc' ? -1 : 1
    if (aVal > bVal) return order === 'asc' ? 1 : -1
    return 0
  })
}

/**
 * 按对象 key 分组
 * @param arr 数组
 * @param key 分组键
 * @returns 分组后的对象，键值对表示分组名和对应元素数组
 * @description 该函数将数组按指定对象 key 进行分组，返回一个对象，键值对表示分组名和对应元素数组。
 */
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((acc, val) => {
    const rawValue = val[key];
    // 1. 强制转换为字符串，确保符合 Record<string, T[]> 的定义
    // 2. 使用新的变量名 groupKeyStr 避免与参数 key 冲突
    const groupKeyStr = String(rawValue); 
    if (!acc[groupKeyStr]) {
      acc[groupKeyStr] = [];
    }
    // 统一使用字符串 key 进行存取
    acc[groupKeyStr].push(val);
    
    return acc;
  }, {} as Record<string, T[]>);
}