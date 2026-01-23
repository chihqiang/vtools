/**
 * 文件工具模块
 * 提供统一的文件下载功能
 */

/**
 * 下载选项接口
 */
export interface downloaderOptions {
  /** 文件名 */
  filename: string
  /** MIME类型 */
  mimeType?: string
  /** 加载状态回调函数 */
  onLoading?: (loading: boolean) => void
}

/**
 * 文件工具模块
 */
export const downloader = {
  /**
   * 下载文本内容
   * @param {string} content - 要下载的文本内容
   * @param {DownloadOptions} options - 下载选项
   * @example
   * file.text('hello world', { filename: 'example.txt' })
   */
  text: (content: string, options: downloaderOptions): void => {
    const blob = new Blob([content], {
      type: options.mimeType || 'text/plain;charset=utf-8',
    })
    downloader.blob(blob, options)
  },

  /**
   * 下载Blob内容
   * @param {Blob} blob - 要下载的Blob对象
   * @param {downloaderOptions} options - 下载选项
   * @example
   * const blob = new Blob(['hello world'], { type: 'text/plain' })
   * file.blob(blob, { filename: 'example.txt' })
   */
  blob: (blob: Blob, options: downloaderOptions): void => {
    const url = URL.createObjectURL(blob)
    downloader.url(url, options)
    URL.revokeObjectURL(url)
  },

  /**
   * 从URL下载文件
   * @param {string} url - 文件URL
   * @param {downloaderOptions} options - 下载选项
   * @example
   * file.url('https://example.com/image.jpg', { filename: 'image.jpg' })
   */
  url: (url: string, options: downloaderOptions): void => {
    try {
      // 显示加载状态
      options.onLoading?.(true)
      const link = document.createElement('a')
      link.href = url
      link.download = options.filename
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('下载失败:', error)
    } finally {
      // 隐藏加载状态（延迟一下，确保用户能看到加载效果）
      setTimeout(() => {
        options.onLoading?.(false)
      }, 500)
    }
  },

  /**
   * 下载JSON内容
   * @param {unknown} data - 要下载的JSON数据
   * @param {downloaderOptions} options - 下载选项
   * @example
   * file.json({ name: 'example' }, { filename: 'data.json' })
   */
  json: (data: unknown, options: downloaderOptions): void => {
    const content = JSON.stringify(data, null, 2)
    downloader.text(content, {
      ...options,
      mimeType: 'application/json;charset=utf-8',
    })
  },

  /**
   * 下载二进制数据
   * @param {ArrayBuffer} buffer - 要下载的二进制数据
   * @param {downloaderOptions} options - 下载选项
   * @example
   * const buffer = new ArrayBuffer(8)
   * file.binary(buffer, { filename: 'data.bin', mimeType: 'application/octet-stream' })
   */
  binary: (buffer: ArrayBuffer, options: downloaderOptions): void => {
    const blob = new Blob([buffer], {
      type: options.mimeType || 'application/octet-stream',
    })
    downloader.blob(blob, options)
  },
}

export default downloader
