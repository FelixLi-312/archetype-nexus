/**
 * 获取 URL 参数对象
 * @param url 包含查询参数的 URL 字符串
 * @returns 查询参数对象，键值对表示参数名和参数值
 */
export function getQueryParams(url: string) {
  const queryString = url.split('?')[1]
  if (!queryString) return {}
  return queryString.split('&').reduce((params, param) => {
    const [key, value] = param.split('=')
    params[key] = decodeURIComponent(value)
    return params
  }, {} as Record<string, string>)
}
/**
 * 拼接 URL 参数
 * @param url 原始 URL 字符串
 * @param params 查询参数对象，键值对表示参数名和参数值
 * @returns 拼接后的 URL 字符串，包含查询参数
 */
export function setQueryParams(url: string, params: Record<string, string>) {
  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&')
  return `${url}?${queryString}`
}
/**
 * 下载文件
 * @param url 文件 URL 字符串
 * @param filename 下载后的文件名
 * @description 该函数通过创建一个隐藏的 <a> 元素，设置其 href 属性为文件 URL，download 属性为文件名，然后模拟点击该元素来触发文件下载。
 */
export function downloadFile(url: string, filename: string) {
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
}
/**
 * 带超时请求
 * @param url 请求 URL 字符串
 * @param options 请求选项对象，与 fetch 函数的第二个参数相同
 * @param timeout 超时时间，单位为毫秒
 * @returns 请求响应对象 Promise
 * @description 该函数返回一个 Promise 对象，该 Promise 对象在调用 fetch 函数进行请求时会设置超时时间。如果请求在超时时间内未完成，Promise 对象将被拒绝，否则将被解析。
 */
export function fetchWithTimeout(url: string, options: RequestInit, timeout: number) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('请求超时')), timeout)
    )
  ])
}
