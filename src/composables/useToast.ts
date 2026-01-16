import { createApp, h, ref } from 'vue'
import ToastMessage from '@/components/ToastMessage.vue'

interface ToastOptions {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

const toastContainer = ref<HTMLElement | null>(null)

export function useToast() {
  const show = (options: ToastOptions) => {
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

  const success = (message: string, duration?: number) => {
    show({ message, type: 'success', duration })
  }

  const error = (message: string, duration?: number) => {
    show({ message, type: 'error', duration })
  }

  const warning = (message: string, duration?: number) => {
    show({ message, type: 'warning', duration })
  }

  const info = (message: string, duration?: number) => {
    show({ message, type: 'info', duration })
  }

  return {
    show,
    success,
    error,
    warning,
    info,
  }
}
