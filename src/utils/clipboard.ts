/**
 * 剪贴板工具模块
 * 提供文本复制功能，支持复制到剪贴板并显示操作反馈
 */

import { useToast } from '@/composables/useToast'
const toast = useToast()

/**
 * 复制文本到剪贴板并显示操作反馈
 * @param {string} text - 要复制的文本内容
 * @param {string} [displayText] - 显示在提示信息中的文本，默认使用text
 * @returns {Promise<void>} - 复制操作的Promise
 * @description 该函数会先检查文本是否为空，然后尝试复制文本到剪贴板
 * 复制成功时显示成功提示，失败时显示错误提示
 * 当提供了displayText时，提示信息会使用displayText而不是text
 */
export const toastCopy = async (text: string, displayText: string = '') => {
  if (!text) return
  try {
    await copyText(text)
    const showText = displayText ?? text
    toast.success(`${showText} 已复制`)
  } catch {
    toast.error('复制失败')
  }
}

/**
 * 复制文本到剪贴板（核心功能）
 * @param {string} text - 要复制的文本内容
 * @returns {Promise<void>} - 复制操作的Promise
 * @description 直接调用navigator.clipboard.writeText API复制文本
 * 不包含任何错误处理和UI反馈，由调用方负责处理
 */
export const copyText = async (text: string) => {
  await navigator.clipboard.writeText(text)
}
