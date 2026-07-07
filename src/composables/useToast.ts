import { createApp, h, reactive } from 'vue'
import ToastMessage from '@/components/ToastMessage.vue'

export interface ToastItem {
  id: number
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration: number
  customClass?: string
  customStyle?: Record<string, string | number>
}

export interface ToastOptions {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  customClass?: string
  customStyle?: Record<string, string | number>
}

// 全局响应式 Toast 列表，支持多个 Toast 同时堆叠显示
const toastList = reactive<ToastItem[]>([])
let toastId = 0

let hostApp: ReturnType<typeof createApp> | null = null
let hostEl: HTMLElement | null = null

function ensureHost() {
  if (hostApp) return
  hostEl = document.createElement('div')
  hostEl.id = 'toast-host'
  document.body.appendChild(hostEl)

  hostApp = createApp({
    setup() {
      const removeToast = (id: number) => {
        const idx = toastList.findIndex((t) => t.id === id)
        if (idx !== -1) toastList.splice(idx, 1)
      }
      return () =>
        h(
          'div',
          {
            class:
              'fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 w-full max-w-sm sm:max-w-md pointer-events-none',
          },
          toastList.map((item) =>
            h(ToastMessage, {
              key: item.id,
              message: item.message,
              type: item.type,
              duration: item.duration,
              customClass: item.customClass,
              customStyle: item.customStyle,
              onClose: () => removeToast(item.id),
            }),
          ),
        )
    },
  })
  hostApp.mount(hostEl)
}

function addToast(options: ToastOptions) {
  ensureHost()
  const item: ToastItem = {
    id: ++toastId,
    message: options.message,
    type: options.type ?? 'info',
    duration: options.duration ?? 3000,
    customClass: options.customClass,
    customStyle: options.customStyle,
  }
  toastList.push(item)
  // 限制最多同时显示 5 条，避免堆积过多
  if (toastList.length > 5) {
    toastList.splice(0, toastList.length - 5)
  }
}

export function useToast() {
  const show = (options: ToastOptions) => {
    addToast(options)
  }

  const success = (
    message: string,
    duration?: number,
    customClass?: string,
    customStyle?: Record<string, string | number>,
  ) => {
    show({ message, type: 'success', duration, customClass, customStyle })
  }

  const error = (
    message: string,
    duration?: number,
    customClass?: string,
    customStyle?: Record<string, string | number>,
  ) => {
    show({ message, type: 'error', duration, customClass, customStyle })
  }

  const warning = (
    message: string,
    duration?: number,
    customClass?: string,
    customStyle?: Record<string, string | number>,
  ) => {
    show({ message, type: 'warning', duration, customClass, customStyle })
  }

  const info = (
    message: string,
    duration?: number,
    customClass?: string,
    customStyle?: Record<string, string | number>,
  ) => {
    show({ message, type: 'info', duration, customClass, customStyle })
  }

  // 清空所有 Toast
  const clear = () => {
    toastList.splice(0, toastList.length)
  }

  return {
    show,
    success,
    error,
    warning,
    info,
    clear,
  }
}
