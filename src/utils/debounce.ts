// 防抖函数，用于限制函数调用的频率
export function debounce<T extends (...args: unknown[]) => void>(func: T, wait: number) {
  let timeout: number | undefined
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = window.setTimeout(() => {
      func(...args)
    }, wait)
  }
}
