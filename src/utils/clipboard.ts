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
    // 只在有简短标签时显示标签，避免把完整长文本塞进 Toast
    getToast().success(displayText ? `${displayText} 已复制` : '已复制到剪贴板')
  } catch {
    getToast().error('复制失败')
  } finally {
    options.onLoading?.(false)
  }
}

export const copyText = async (text: string) => {
  // 优先使用现代 Clipboard API（需要安全上下文 HTTPS / localhost）
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text)
    return
  }
  // 降级方案：通过临时 textarea + execCommand 兼容非安全上下文
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.top = '-9999px'
  textarea.style.left = '-9999px'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  try {
    const ok = document.execCommand('copy')
    if (!ok) throw new Error('execCommand copy failed')
  } finally {
    document.body.removeChild(textarea)
  }
}
