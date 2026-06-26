import { useToast } from '@/composables/useToast'

let toast: ReturnType<typeof useToast> | null = null

function getToast() {
  if (!toast) {
    toast = useToast()
  }
  return toast
}

export const toastCopy = async (
  text: string,
  displayText: string = '',
  options: { onLoading?: (loading: boolean) => void } = {},
) => {
  if (!text) return
  try {
    options.onLoading?.(true)
    await copyText(text)
    const showText = displayText || text
    getToast().success(`${showText} 已复制`)
  } catch {
    getToast().error('复制失败')
  } finally {
    options.onLoading?.(false)
  }
}

export const copyText = async (text: string) => {
  await navigator.clipboard.writeText(text)
}
