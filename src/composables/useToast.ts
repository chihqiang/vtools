import { createApp, h, ref } from 'vue'
import ToastMessage from '@/components/ToastMessage.vue'

interface ToastOptions {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  customClass?: string
  customStyle?: Record<string, string | number>
}

const toastContainer = ref<HTMLElement | null>(null)
const toastQueue = ref<ToastOptions[]>([])
const isProcessing = ref(false)

// 处理队列中的Toast
async function processQueue() {
  if (isProcessing.value || toastQueue.value.length === 0) {
    return
  }

  isProcessing.value = true
  const options = toastQueue.value.shift()!

  if (!toastContainer.value) {
    toastContainer.value = document.createElement('div')
    document.body.appendChild(toastContainer.value)
  }

  const toastApp = createApp({
    setup() {
      const onClose = () => {
        toastApp.unmount()
        if (toastContainer.value?.children.length === 0) {
          document.body.removeChild(toastContainer.value!)
          toastContainer.value = null
        }
        // 处理下一个Toast
        isProcessing.value = false
        processQueue()
      }

      return () =>
        h(ToastMessage, {
          ...options,
          onClose,
        })
    },
  })

  toastApp.mount(toastContainer.value)
}

export function useToast() {
  const show = (options: ToastOptions) => {
    // 添加到队列
    toastQueue.value.push(options)
    // 开始处理队列
    processQueue()
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

  // 清空队列
  const clear = () => {
    toastQueue.value = []
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
