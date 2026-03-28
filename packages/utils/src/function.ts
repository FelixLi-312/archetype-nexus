/**
 * 防抖函数
 * @param fn 要防抖的函数
 * @param delay 防抖延迟时间，默认值为 300 毫秒
 * @returns 防抖后的函数
 * @description 该函数返回一个新函数，该新函数在调用时会延迟执行 fn 函数，直到最后一次调用距离当前时间超过 delay 毫秒。
 */
export function debounce<T extends (...args: any[]) => any>(fn: T, delay = 300): T {
  let timer: ReturnType<typeof setTimeout>
  return function (this: any, ...args: any[]) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  } as T
}
/**
 * 节流函数
 * @param fn 要节流的函数
 * @param delay 节流延迟时间，默认值为 300 毫秒
 * @returns 节流后的函数
 * @description 该函数返回一个新函数，该新函数在调用时会限制其执行频率，最多每 delay 毫秒执行一次。
 */
export function throttle<T extends (...args: any[]) => any>(fn: T, delay = 300): T {
  let last = 0
  return function (this: any, ...args: any[]) {
    const now = Date.now()
    if (now - last > delay) {
      last = now
      fn.apply(this, args)
    }
  } as T
}

/**
 * 异步重试函数
 * @param fn 要重试的异步函数
 * @param times 重试次数，默认值为 3 次
 * @param interval 重试间隔时间，默认值为 1000 毫秒
 * @returns 重试后的 Promise 对象
 * @description 该函数返回一个新的 Promise 对象，该 Promise 对象在调用 fn 函数时会进行重试，最多重试 times 次，每次重试间隔 interval 毫秒。如果重试次数超过最大次数，Promise 对象将被拒绝，否则将被解析。
 */
export function retryAsync<T>(fn: () => Promise<T>, times = 3, interval = 1000): Promise<T> {
  return new Promise((resolve, reject) => {
    let count = 0
    const retry = () => {
      fn()
        .then(resolve)
        .catch(() => {
          count++
          if (count >= times) reject(new Error('重试次数超过最大次数'))
          else setTimeout(retry, interval)
        })
    }
    retry()
  })
}

/**
 * 只执行一次函数
 * @param fn 要只执行一次的函数
 * @returns 只执行一次后的函数
 * @description 该函数返回一个新函数，该新函数只能执行一次，后续调用将返回 undefined。
 */
export function once<T extends (...args: any[]) => any>(fn: T): T {
  let called = false
  return function (this: any, ...args: any[]) {
    if (!called) {
      called = true
      return fn.apply(this, args)
    }
  } as T
}
