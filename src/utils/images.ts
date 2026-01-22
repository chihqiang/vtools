/**
 * 图片处理工具模块
 * 提供图片上传、处理、转换和下载等功能
 */

/**
 * 图片格式类型
 */
export enum ImageFormat {
  JPEG = 'jpeg',
  JPG = 'jpg',
  PNG = 'png',
  WEBP = 'webp',
  GIF = 'gif',
  SVG = 'svg',
  ICO = 'ico',
}

/**
 * 支持的图片格式信息
 */
export const supportedFormats = [
  { value: ImageFormat.JPEG, label: 'JPEG', mimeType: 'image/jpeg' },
  { value: ImageFormat.JPG, label: 'JPG', mimeType: 'image/jpeg' },
  { value: ImageFormat.PNG, label: 'PNG', mimeType: 'image/png' },
  { value: ImageFormat.WEBP, label: 'WebP', mimeType: 'image/webp' },
  { value: ImageFormat.GIF, label: 'GIF', mimeType: 'image/gif' },
  { value: ImageFormat.SVG, label: 'SVG', mimeType: 'image/svg+xml' },
  { value: ImageFormat.ICO, label: 'ICO', mimeType: 'image/x-icon' },
]

/**
 * 处理文件上传，返回文件的DataURL
 * @param {File} file - 要处理的文件
 * @returns {Promise<string>} - 文件的DataURL
 */
export const processFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      resolve(result)
    }
    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }
    reader.readAsDataURL(file)
  })
}

/**
 * 获取图片尺寸信息
 * @param {string} imageUrl - 图片的DataURL或URL
 * @returns {Promise<{ width: number; height: number }>} - 图片的宽度和高度
 */
export const getImageDimensions = (
  imageUrl: string,
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
    }
    img.onerror = () => {
      reject(new Error('图片加载失败'))
    }
    img.src = imageUrl
  })
}

/**
 * 调整图片大小
 * @param {string} imageUrl - 原始图片的DataURL
 * @param {number} width - 目标宽度
 * @param {number} height - 目标高度
 * @param {string} format - 目标格式，默认为'png'
 * @param {number} quality - 图片质量，默认为0.95
 * @returns {string} - 调整大小后的图片DataURL
 */
export const resizeImage = (
  imageUrl: string,
  width: number,
  height: number,
  format: string = 'png',
  quality: number = 0.95,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('无法创建Canvas上下文'))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)
      const dataUrl = canvas.toDataURL(`image/${format}`, quality)
      resolve(dataUrl)
    }
    img.onerror = () => {
      reject(new Error('图片加载失败'))
    }
    img.src = imageUrl
  })
}

/**
 * 下载图片
 * @param {string} imageUrl - 图片的DataURL
 * @param {string} filename - 下载的文件名
 */
export const downloadImage = async (imageUrl: string, filename: string): Promise<void> => {
  try {
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('下载失败:', error)
    throw new Error('图片下载失败')
  }
}

/**
 * 计算DataURL的文件大小（字节）
 * @param {string} dataUrl - 图片的DataURL
 * @returns {number} - 文件大小（字节）
 */
export const calculateFileSize = (dataUrl: string): number => {
  // 移除数据URL前缀
  const base64 = dataUrl.split(',')[1]
  if (!base64) return 0

  // Base64编码的字符串大小计算公式：(base64.length * 3) / 4 - padding
  const padding = (base64.match(/=/g) || []).length
  const sizeInBytes = (base64.length * 3) / 4 - padding
  return sizeInBytes
}

/**
 * 格式化文件大小显示
 * @param {number} bytes - 文件大小（字节）
 * @returns {string} - 格式化后的文件大小
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 处理拖拽上传事件
 * @param {DragEvent} event - 拖拽事件对象
 * @returns {File | null} - 拖拽的文件，如果没有则返回null
 */
export const handleDragDrop = (event: DragEvent): File | null => {
  event.preventDefault()
  if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
    return event.dataTransfer.files[0]
  }
  return null
}

/**
 * 转换图片格式
 * @param {string} imageUrl - 原始图片的DataURL
 * @param {string} format - 目标格式
 * @param {number} width - 目标宽度
 * @param {number} height - 目标高度
 * @param {number} quality - 图片质量，默认为0.95
 * @returns {Promise<string>} - 转换后的图片DataURL
 */
export const convertImageFormat = (
  imageUrl: string,
  format: string,
  width: number,
  height: number,
  quality: number = 0.95,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('无法创建Canvas上下文'))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      let dataUrl: string
      if (format === 'svg') {
        // 特殊处理SVG格式
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        svg.setAttribute('width', width.toString())
        svg.setAttribute('height', height.toString())
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

        const image = document.createElementNS('http://www.w3.org/2000/svg', 'image')
        image.setAttribute('width', '100%')
        image.setAttribute('height', '100%')
        image.setAttribute('href', imageUrl)

        svg.appendChild(image)

        const svgData = new XMLSerializer().serializeToString(svg)
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml' })
        dataUrl = URL.createObjectURL(svgBlob)
      } else {
        // 处理其他格式
        const mimeType =
          supportedFormats.find((f) => f.value === format)?.mimeType || `image/${format}`
        dataUrl = canvas.toDataURL(mimeType, quality)
      }

      resolve(dataUrl)
    }
    img.onerror = () => {
      reject(new Error('图片加载失败'))
    }
    img.src = imageUrl
  })
}
