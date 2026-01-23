/**
 * 防抖和节流工具函数
 * 提供统一的防抖和节流功能，优化用户交互体验
 */

import lodashDebounce from 'lodash/debounce'
import lodashThrottle from 'lodash/throttle'

/**
 * 防抖函数类型
 */
export type DebouncedFunction<T extends (...args: unknown[]) => unknown> = (
  ...args: Parameters<T>
) => void

/**
 * 节流函数类型
 */
export type ThrottledFunction<T extends (...args: unknown[]) => unknown> = (
  ...args: Parameters<T>
) => void

/**
 * 创建防抖函数
 * @param fn 要防抖的函数
 * @param wait 等待时间（毫秒），默认300ms
 * @param options 配置选项
 * @returns 防抖处理后的函数
 * @example
 * const debouncedFn = debounce(() => {
 *   console.log('执行防抖函数')
 * }, 300)
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  wait: number = 300,
  options: Parameters<typeof lodashDebounce>[2] = {}
): DebouncedFunction<T> {
  return lodashDebounce(fn, wait, options)
}

/**
 * 创建节流函数
 * @param fn 要节流的函数
 * @param wait 等待时间（毫秒），默认300ms
 * @param options 配置选项
 * @returns 节流处理后的函数
 * @example
 * const throttledFn = throttle(() => {
 *   console.log('执行节流函数')
 * }, 300)
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  wait: number = 300,
  options: Parameters<typeof lodashThrottle>[2] = {}
): ThrottledFunction<T> {
  return lodashThrottle(fn, wait, options)
}

/**
 * 带响应式状态的防抖函数（适用于Vue 3）
 * @param value 响应式值
 * @param callback 回调函数
 * @param wait 等待时间（毫秒），默认300ms
 * @returns 响应式值的引用
 * @example
 * const inputValue = ref('')
 * const debouncedValue = useDebouncedRef(inputValue, (newValue) => {
 *   console.log('防抖处理后的值:', newValue)
 * }, 300)
 */
export function useDebouncedRef<T>(
  value: { value: T },
  callback: (value: T) => void,
  wait: number = 300
): { value: T } {
  const debouncedCallback = debounce((...args: unknown[]) => {
    callback(args[0] as T)
  }, wait)
  
  // 监听值变化
  let currentValue = value.value
  
  // 返回一个类似ref的对象
  return {
    get value() {
      return currentValue
    },
    set value(newValue: T) {
      currentValue = newValue
      debouncedCallback(newValue)
    }
  }
}

/**
 * 防抖钩子（适用于Vue 3）
 * @param callback 回调函数
 * @param wait 等待时间（毫秒），默认300ms
 * @returns 防抖处理后的函数
 * @example
 * const handleSearch = useDebounce((query: string) => {
 *   // 执行搜索操作
 * }, 300)
 */
export function useDebounce<T extends (...args: unknown[]) => unknown>(
  callback: T,
  wait: number = 300
): DebouncedFunction<T> {
  return debounce(callback, wait)
}

/**
 * 节流钩子（适用于Vue 3）
 * @param callback 回调函数
 * @param wait 等待时间（毫秒），默认300ms
 * @returns 节流处理后的函数
 * @example
 * const handleScroll = useThrottle(() => {
 *   // 执行滚动操作
 * }, 300)
 */
export function useThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T,
  wait: number = 300
): ThrottledFunction<T> {
  return throttle(callback, wait)
}