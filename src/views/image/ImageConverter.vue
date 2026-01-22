<template>
  <div class="h-full p-6 flex flex-col bg-gray-50 border border-gray-200 rounded-xl">
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
            <p class="text-xs text-gray-400">支持 JPG、PNG、WebP、GIF 格式</p>
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
              尺寸: {{ originalWidth }} × {{ originalHeight }}
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
            accept="image/*"
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

        <!-- 质量设置（仅适用于 JPEG、JPG 和 WebP） -->
        <div
          v-if="
            targetFormats.some((format) =>
              [ImageFormat.JPEG, ImageFormat.JPG, ImageFormat.WEBP].includes(format),
            )
          "
          class="mb-6"
        >
          <label class="block text-sm font-medium text-gray-700 mb-2"> 质量: {{ quality }}% </label>
          <input
            type="range"
            v-model.number="quality"
            min="1"
            max="100"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <!-- 尺寸设置 -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">自定义尺寸</label>
          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-xs text-gray-500 mb-1">宽度</label>
              <input
                type="number"
                v-model.number="customWidth"
                min="1"
                placeholder="原始宽度"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="flex-1">
              <label class="block text-xs text-gray-500 mb-1">高度</label>
              <input
                type="number"
                v-model.number="customHeight"
                min="1"
                placeholder="原始高度"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <p class="text-xs text-gray-400 mt-2">
            留空使用原始尺寸: {{ originalWidth }} × {{ originalHeight }}
          </p>
        </div>

        <!-- 转换按钮 -->
        <button
          @click="convertImage"
          :disabled="!originalImage"
          class="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          转换图片
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
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="flex items-center justify-between mb-2">
                <h4 class="text-xs font-medium text-gray-700">
                  {{ supportedFormats.find((f) => f.value === format)?.label }}
                </h4>
                <button
                  @click="downloadImage(format)"
                  class="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  下载
                </button>
              </div>
              <div class="flex items-center justify-center mb-2">
                <img
                  :src="convertedImages[format]"
                  :alt="`转换后图片 (${format})`"
                  class="max-w-full max-h-32 object-contain"
                />
              </div>
              <p class="text-xs text-gray-500">
                尺寸: {{ convertedWidth }} × {{ convertedHeight }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 图片格式枚举
enum ImageFormat {
  JPEG = 'jpeg',
  JPG = 'jpg',
  PNG = 'png',
  WEBP = 'webp',
  GIF = 'gif',
}

// 引用
const fileInput = ref<HTMLInputElement>()

// 状态
const originalImage = ref<string>('')
const originalFileName = ref<string>('image')
const convertedImages = ref<Record<string, string>>({})
const targetFormats = ref<ImageFormat[]>([
  ImageFormat.JPEG,
  ImageFormat.JPG,
  ImageFormat.PNG,
  ImageFormat.WEBP,
  ImageFormat.GIF,
])
const quality = ref<number>(80)
const originalWidth = ref<number>(0)
const originalHeight = ref<number>(0)
const customWidth = ref<number>(0)
const customHeight = ref<number>(0)
const convertedWidth = ref<number>(0)
const convertedHeight = ref<number>(0)

// 支持的格式列表
const supportedFormats = [
  { value: ImageFormat.JPEG, label: 'JPEG', mimeType: 'image/jpeg' },
  { value: ImageFormat.JPG, label: 'JPG', mimeType: 'image/jpeg' },
  { value: ImageFormat.PNG, label: 'PNG', mimeType: 'image/png' },
  { value: ImageFormat.WEBP, label: 'WebP', mimeType: 'image/webp' },
  { value: ImageFormat.GIF, label: 'GIF', mimeType: 'image/gif' },
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

      // 创建临时画布用于转换
      const tempCanvas = document.createElement('canvas')
      const tempCtx = tempCanvas.getContext('2d')

      if (tempCtx) {
        // 设置临时画布尺寸
        tempCanvas.width = width
        tempCanvas.height = height

        // 绘制图片到临时画布
        tempCtx.drawImage(img, 0, 0, width, height)

        // 导出图片
        if (format === ImageFormat.PNG) {
          // PNG 不支持质量参数
          convertedImages.value[format] = tempCanvas.toDataURL('image/png')
        } else {
          // JPEG、JPG 和 WebP 支持质量参数
          convertedImages.value[format] = tempCanvas.toDataURL(mimeType, quality.value / 100)
        }
      }
    })

    // 更新转换后图片的尺寸
    convertedWidth.value = width
    convertedHeight.value = height
  }

  img.src = originalImage.value
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
