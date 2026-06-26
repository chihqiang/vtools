import { debounce, throttle } from '@/utils/debounce'

type DebouncedFunction<T extends (...args: unknown[]) => unknown> = (...args: Parameters<T>) => void

type ThrottledFunction<T extends (...args: unknown[]) => unknown> = (...args: Parameters<T>) => void

export function useDebouncedRef<T>(
  value: { value: T },
  callback: (value: T) => void,
  wait: number = 300,
): { value: T } {
  const debouncedCallback = debounce((...args: unknown[]) => {
    callback(args[0] as T)
  }, wait)

  let currentValue = value.value

  return {
    get value() {
      return currentValue
    },
    set value(newValue: T) {
      currentValue = newValue
      debouncedCallback(newValue)
    },
  }
}

export function useDebounce<T extends (...args: unknown[]) => unknown>(
  callback: T,
  wait: number = 300,
): DebouncedFunction<T> {
  return debounce(callback, wait)
}

export function useThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T,
  wait: number = 300,
): ThrottledFunction<T> {
  return throttle(callback, wait)
}
