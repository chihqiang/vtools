import lodashDebounce from 'lodash/debounce'
import lodashThrottle from 'lodash/throttle'

export type DebouncedFunction<T extends (...args: unknown[]) => unknown> = (
  ...args: Parameters<T>
) => void

export type ThrottledFunction<T extends (...args: unknown[]) => unknown> = (
  ...args: Parameters<T>
) => void

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  wait: number = 300,
  options: Parameters<typeof lodashDebounce>[2] = {},
): DebouncedFunction<T> {
  return lodashDebounce(fn, wait, options)
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  wait: number = 300,
  options: Parameters<typeof lodashThrottle>[2] = {},
): ThrottledFunction<T> {
  return lodashThrottle(fn, wait, options)
}
