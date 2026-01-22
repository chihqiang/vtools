<template>
  <div class="h-full p-6 flex flex-col bg-gray-50 border border-gray-200 rounded-xl">
    <!-- 图片预览组件 -->
    <ImagePreview :image-url="previewImage" @close="previewImage = ''" />
    <!-- Header -->
    <div class="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-4 md:p-6 mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex items-center gap-3">
          <svg
            class="w-8 h-8 text-blue-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <h1 class="text-xl md:text-2xl font-bold text-gray-900">图片格式转换</h1>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="flex flex-col lg:flex-row gap-6">
      <!-- 左侧：上传和设置 -->
      <div class="flex-1 bg-white rounded-xl shadow-sm p-4 md:p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">上传设置</h2>

        <!-- 图片上传区域 -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">上传图片</label>
          <!-- 上传前的提示 -->
          <div
            v-if="!originalImage"
            class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
            @click="fileInput?.click()"
            @dragover.prevent
            @dragleave.prevent
            @drop.prevent="handleDragDrop"
          >
            <svg
              class="w-12 h-12 text-gray-400 mx-auto mb-4"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <p class="text-sm text-gray-500 mb-2">点击或拖拽文件到此处上传</p>
            <p class="text-xs text-gray-400">支持 JPG、PNG、WebP、GIF、SVG 格式</p>
          </div>
          <!-- 上传后的预览 -->
          <div
            v-else
            class="border-2 border-solid border-blue-500 rounded-lg p-4 text-center cursor-pointer"
            @dragover.prevent
            @dragleave.prevent
            @drop.prevent="handleDragDrop"
          >
            <div class="flex items-center justify-center mb-4">
              <img :src="originalImage" alt="原始图片" class="max-w-full max-h-48 object-contain" />
            </div>
            <p class="text-xs text-gray-500 mb-2">
              尺寸: {{ originalWidth }} × {{ originalHeight }} | 大小:
              {{ formatFileSize(originalFileSize) }}
            </p>
            <button
              @click="fileInput?.click()"
              class="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              更换图片
            </button>
          </div>
          <input
            ref="fileInput"
            type="file"
            class="hidden"
            accept="image/*,.svg"
            @change="handleFileUpload"
          />
        </div>

        <!-- 目标格式选择 -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">目标格式</label>
          <div class="flex flex-wrap gap-4">
            <div v-for="format in supportedFormats" :key="format.value" class="flex items-center">
              <input
                type="checkbox"
                :id="`format-${format.value}`"
                :value="format.value"
                v-model="targetFormats"
                class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label :for="`format-${format.value}`" class="ml-2 text-sm text-gray-700">
                {{ format.label }}
              </label>
            </div>
          </div>
        </div>

        <!-- 尺寸设置 -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">尺寸设置</label>

          <!-- 自定义尺寸 -->
          <div class="mb-4">
            <label class="block text-xs text-gray-500 mb-1">自定义尺寸</label>
            <div class="flex gap-4">
              <div class="flex-1">
                <input
                  type="number"
                  v-model.number="customWidth"
                  min="1"
                  placeholder="原始宽度"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div class="flex-1">
                <input
                  type="number"
                  v-model.number="customHeight"
                  min="1"
                  placeholder="原始高度"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <!-- 常见尺寸预设 -->
          <div>
            <label class="block text-xs text-gray-500 mb-1">常见尺寸</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="size in commonSizes"
                :key="size.name"
                @click="applySizePreset(size.width, size.height)"
                class="px-3 py-1 text-xs border rounded-md hover:bg-gray-100 transition-colors"
                :class="{
                  'bg-blue-100 border-blue-500 text-blue-700':
                    (size.width === 0 &&
                      size.height === 0 &&
                      customWidth === originalWidth &&
                      customHeight === originalHeight) ||
                    (size.width !== 0 &&
                      size.height !== 0 &&
                      customWidth === size.width &&
                      customHeight === size.height),
                }"
              >
                {{ size.name }}
              </button>
            </div>
          </div>
        </div>

        <!-- 转换按钮 -->
        <button
          @click="convertImage"
          :disabled="!originalImage || isConverting"
          class="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors relative overflow-hidden"
        >
          <!-- 加载状态 -->
          <div
            v-if="isConverting"
            class="absolute inset-0 flex items-center justify-center bg-blue-600/90 z-10"
          >
            <div class="flex items-center space-x-2">
              <div
                class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></div>
              <span>转换中...</span>
            </div>
          </div>
          <!-- 按钮文本 -->
          <span :class="{ 'opacity-0': isConverting }">转换图片</span>
        </button>
      </div>

      <!-- 右侧：预览和下载 -->
      <div class="flex-1 bg-white rounded-xl shadow-sm p-4 md:p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">预览和下载</h2>

        <!-- 转换后图片预览 -->
        <div v-if="convertedFormats.length > 0" class="mb-6">
          <h3 class="text-sm font-medium text-gray-700 mb-4">转换后图片</h3>

          <!-- 每个格式的预览 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="format in convertedFormats"
              :key="format"
              class="border border-gray-200 rounded-lg p-4 relative"
            >
              <div class="flex items-center justify-between mb-2">
                <h4 class="text-xs font-medium text-gray-700">
                  {{ supportedFormats.find((f) => f.value === format)?.label }}
                </h4>
                <button
                  @click="downloadImage(format)"
                  :disabled="formatLoading[format]"
                  class="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  下载
                </button>
              </div>
              <div class="flex items-center justify-center mb-2 relative min-h-[128px]">
                <!-- 加载状态 -->
                <div
                  v-if="formatLoading[format]"
                  class="absolute inset-0 flex items-center justify-center bg-white/80 z-10 rounded-lg"
                >
                  <div class="flex flex-col items-center">
                    <div
                      class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"
                    ></div>
                    <span class="text-xs text-gray-600">转换中...</span>
                  </div>
                </div>
                <!-- 转换后的图片 -->
                <img
                  v-else
                  :src="convertedImages[format]"
                  :alt="`转换后图片 (${format})`"
                  class="max-w-full max-h-32 object-contain cursor-pointer hover:opacity-90 transition-opacity"
                  @click.stop="convertedImages[format] && openPreview(convertedImages[format])"
                />
              </div>
              <p class="text-xs text-gray-500">
                尺寸: {{ convertedWidth }} × {{ convertedHeight }} | 大小:
                {{ formatFileSize(convertedFileSizes[format] || 0) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ImagePreview from '@/components/ui/ImagePreview.vue'

// 图片格式枚举
enum ImageFormat {
  JPEG = 'jpeg',
  JPG = 'jpg',
  PNG = 'png',
  WEBP = 'webp',
  GIF = 'gif',
  SVG = 'svg',
}

// 引用
const fileInput = ref<HTMLInputElement>()

// 状态
const originalImage = ref<string>('')
const originalFileName = ref<string>('image')
const originalFileSize = ref<number>(0)
const convertedImages = ref<Record<string, string>>({})
const convertedFileSizes = ref<Record<string, number>>({})
const targetFormats = ref<ImageFormat[]>([
  ImageFormat.JPEG,
  ImageFormat.JPG,
  ImageFormat.PNG,
  ImageFormat.WEBP,
  ImageFormat.GIF,
  ImageFormat.SVG,
])
const previewImage = ref<string>('')

const originalWidth = ref<number>(0)
const originalHeight = ref<number>(0)
const customWidth = ref<number>(0)
const customHeight = ref<number>(0)
const convertedWidth = ref<number>(0)
const convertedHeight = ref<number>(0)

// 常见尺寸预设
const commonSizes = computed(() => [
  {
    name:
      originalWidth.value && originalHeight.value
        ? `原始尺寸 (${originalWidth.value}×${originalHeight.value})`
        : '原始尺寸',
    width: 0,
    height: 0,
  },
  { name: '1920x1080 (Full HD)', width: 1920, height: 1080 },
  { name: '1280x720 (HD)', width: 1280, height: 720 },
  { name: '800x600 (VGA)', width: 800, height: 600 },
  { name: '640x480 (SD)', width: 640, height: 480 },
  { name: '400x400 (Square)', width: 400, height: 400 },
  { name: '1080x1920 (Portrait HD)', width: 1080, height: 1920 },
])
const isConverting = ref<boolean>(false)
const formatLoading = ref<Record<string, boolean>>({})

// 支持的格式列表
const supportedFormats = [
  { value: ImageFormat.JPEG, label: 'JPEG', mimeType: 'image/jpeg' },
  { value: ImageFormat.JPG, label: 'JPG', mimeType: 'image/jpeg' },
  { value: ImageFormat.PNG, label: 'PNG', mimeType: 'image/png' },
  { value: ImageFormat.WEBP, label: 'WebP', mimeType: 'image/webp' },
  { value: ImageFormat.GIF, label: 'GIF', mimeType: 'image/gif' },
  { value: ImageFormat.SVG, label: 'SVG', mimeType: 'image/svg+xml' },
]

// 计算属性：获取转换后的图片格式列表
const convertedFormats = computed(() => {
  return Object.keys(convertedImages.value)
})

// 处理文件上传
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    processFile(target.files[0])
  }
}

// 处理拖拽上传
const handleDragDrop = (event: DragEvent) => {
  if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
    processFile(event.dataTransfer.files[0])
  }
}

// 处理文件
const processFile = (file: File) => {
  // 提取原始文件名（不包含扩展名）
  const fileName = file.name
  const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName
  originalFileName.value = nameWithoutExt
  // 存储原始文件大小
  originalFileSize.value = file.size

  const reader = new FileReader()

  reader.onload = (e) => {
    const result = e.target?.result as string
    originalImage.value = result

    // 获取原始图片尺寸
    const img = new Image()
    img.onload = () => {
      originalWidth.value = img.width
      originalHeight.value = img.height
      customWidth.value = img.width
      customHeight.value = img.height
      convertedWidth.value = img.width
      convertedHeight.value = img.height
    }
    img.src = result
  }

  reader.readAsDataURL(file)
  convertedImages.value = {} // 重置转换结果
}

// 转换图片
const convertImage = () => {
  if (!originalImage.value || targetFormats.value.length === 0) return

  isConverting.value = true

  // 为每个目标格式设置加载状态
  targetFormats.value.forEach((format) => {
    formatLoading.value[format] = true
  })

  const img = new Image()

  img.onload = () => {
    // 重置转换结果
    convertedImages.value = {}

    // 确定使用的尺寸（自定义尺寸或原始尺寸）
    const width = customWidth.value || img.width
    const height = customHeight.value || img.height

    // 为每个目标格式转换图片
    targetFormats.value.forEach((format) => {
      // 从 supportedFormats 中获取 MIME 类型
      const formatInfo = supportedFormats.find((f) => f.value === format)
      const mimeType = formatInfo?.mimeType || 'image/jpeg'

      switch (format) {
        case ImageFormat.SVG:
          // 处理 SVG 格式转换
          // 创建 SVG 元素
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
          svg.setAttribute('width', width.toString())
          svg.setAttribute('height', height.toString())
          svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

          // 创建 image 元素，嵌入位图
          const image = document.createElementNS('http://www.w3.org/2000/svg', 'image')
          image.setAttribute('width', '100%')
          image.setAttribute('height', '100%')
          image.setAttribute('href', originalImage.value)

          svg.appendChild(image)

          // 将 SVG 转换为数据 URL
          const svgData = new XMLSerializer().serializeToString(svg)
          const svgBlob = new Blob([svgData], { type: 'image/svg+xml' })
          const svgUrl = URL.createObjectURL(svgBlob)

          convertedImages.value[format] = svgUrl
          // 计算 SVG 文件大小
          convertedFileSizes.value[format] = svgBlob.size
          break

        case ImageFormat.PNG:
          // 处理 PNG 格式（不支持质量参数）
          {
            const tempCanvas = document.createElement('canvas')
            const tempCtx = tempCanvas.getContext('2d')

            if (tempCtx) {
              tempCanvas.width = width
              tempCanvas.height = height
              tempCtx.drawImage(img, 0, 0, width, height)
              const dataUrl = tempCanvas.toDataURL('image/png')
              convertedImages.value[format] = dataUrl
              // 计算文件大小
              convertedFileSizes.value[format] = calculateFileSize(dataUrl)
            }
          }
          break

        default:
          // 处理其他格式（JPEG、JPG、WebP、GIF）
          {
            const tempCanvas = document.createElement('canvas')
            const tempCtx = tempCanvas.getContext('2d')

            if (tempCtx) {
              tempCanvas.width = width
              tempCanvas.height = height
              tempCtx.drawImage(img, 0, 0, width, height)
              // 使用固定的高质量值 0.95
              const dataUrl = tempCanvas.toDataURL(mimeType, 0.95)
              convertedImages.value[format] = dataUrl
              // 计算文件大小
              convertedFileSizes.value[format] = calculateFileSize(dataUrl)
            }
          }
          break
      }

      // 标记该格式转换完成
      formatLoading.value[format] = false
    })

    // 更新转换后图片的尺寸
    convertedWidth.value = width
    convertedHeight.value = height

    // 标记所有转换完成
    isConverting.value = false
  }

  img.onerror = () => {
    // 处理图片加载错误
    isConverting.value = false
    targetFormats.value.forEach((format) => {
      formatLoading.value[format] = false
    })
  }

  img.src = originalImage.value
}

// 计算数据URL的文件大小（字节）
const calculateFileSize = (dataUrl: string): number => {
  // 移除数据URL前缀
  const base64 = dataUrl.split(',')[1]
  if (!base64) return 0

  // Base64编码的字符串大小计算公式：(base64.length * 3) / 4 - padding
  const padding = (base64.match(/=/g) || []).length
  const sizeInBytes = (base64.length * 3) / 4 - padding
  return sizeInBytes
}

// 格式化文件大小显示
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 应用尺寸预设
const applySizePreset = (width: number, height: number) => {
  // 如果是原始尺寸预设（width=0, height=0），则使用实际的原始尺寸
  if (width === 0 && height === 0) {
    customWidth.value = originalWidth.value
    customHeight.value = originalHeight.value
  } else {
    customWidth.value = width
    customHeight.value = height
  }
}

// 打开图片预览
const openPreview = (imageUrl: string) => {
  previewImage.value = imageUrl
}

// 下载图片
const downloadImage = (format: string) => {
  if (!convertedImages.value[format]) return
  const link = document.createElement('a')
  link.href = convertedImages.value[format]
  // 使用新的文件名规则：{original}-{format}-{width}x{height}
  const width = customWidth.value || originalWidth.value
  const height = customHeight.value || originalHeight.value
  link.download = `${originalFileName.value}-${format}-${width}x${height}.${format}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 监听参数变化，自动重新转换
watch(
  [customWidth, customHeight, targetFormats],
  () => {
    if (originalImage.value) {
      convertImage()
    }
  },
  { deep: true },
)
</script>

<style scoped>
/* 自定义样式 */
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}

input[type='range']::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
}
</style>
