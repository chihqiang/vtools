<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-4 md:p-6 mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex items-center gap-3">
            <svg
              class="w-8 h-8 text-blue-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
              />
            </svg>
            <h1 class="text-xl md:text-2xl font-bold text-gray-900">Favicon 图标生成器</h1>
          </div>

          <button
            @click="generateFavicons"
            :disabled="!imageFile || generating"
            class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              v-if="!generating"
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7"
              />
            </svg>

            <svg
              v-else
              class="w-4 h-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9"
              />
            </svg>

            {{ generating ? '生成中...' : '生成 Favicon' }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 参数设置 -->
        <div class="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">参数设置</h2>

          <div class="space-y-6">
            <!-- 图片上传 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">上传图片</label>
              <div
                @dragover.prevent
                @drop.prevent="handleDrop"
                class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors"
              >
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  @change="handleFileChange"
                  class="hidden"
                />
                <button
                  @click="handleSelectClick"
                  class="mb-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  选择图片
                </button>
                <p class="text-sm text-gray-500">支持 JPG, PNG, SVG 等格式</p>
                <p class="text-xs text-gray-400 mt-1">或直接拖放图片到此处</p>

                <div v-if="imagePreview" class="mt-4">
                  <img
                    :src="imagePreview"
                    alt="预览"
                    class="max-w-full max-h-48 mx-auto object-contain border border-gray-200 rounded"
                  />
                  <p class="text-xs text-gray-500 mt-2">{{ imageFile?.name }}</p>
                </div>
              </div>
            </div>

            <!-- 尺寸选择 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">生成尺寸</label>
              <div class="grid grid-cols-3 gap-2">
                <label
                  class="flex items-center gap-2 p-2 border border-gray-300 rounded-md cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <input
                    v-model="selectedSizes"
                    type="checkbox"
                    value="16x16"
                    class="w-4 h-4 text-blue-600"
                  />
                  <span class="text-sm">16x16</span>
                </label>
                <label
                  class="flex items-center gap-2 p-2 border border-gray-300 rounded-md cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <input
                    v-model="selectedSizes"
                    type="checkbox"
                    value="32x32"
                    class="w-4 h-4 text-blue-600"
                  />
                  <span class="text-sm">32x32</span>
                </label>
                <label
                  class="flex items-center gap-2 p-2 border border-gray-300 rounded-md cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <input
                    v-model="selectedSizes"
                    type="checkbox"
                    value="48x48"
                    class="w-4 h-4 text-blue-600"
                  />
                  <span class="text-sm">48x48</span>
                </label>
                <label
                  class="flex items-center gap-2 p-2 border border-gray-300 rounded-md cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <input
                    v-model="selectedSizes"
                    type="checkbox"
                    value="64x64"
                    class="w-4 h-4 text-blue-600"
                  />
                  <span class="text-sm">64x64</span>
                </label>
                <label
                  class="flex items-center gap-2 p-2 border border-gray-300 rounded-md cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <input
                    v-model="selectedSizes"
                    type="checkbox"
                    value="128x128"
                    class="w-4 h-4 text-blue-600"
                  />
                  <span class="text-sm">128x128</span>
                </label>
                <label
                  class="flex items-center gap-2 p-2 border border-gray-300 rounded-md cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <input
                    v-model="selectedSizes"
                    type="checkbox"
                    value="256x256"
                    class="w-4 h-4 text-blue-600"
                  />
                  <span class="text-sm">256x256</span>
                </label>
                <label
                  class="flex items-center gap-2 p-2 border border-gray-300 rounded-md cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <input
                    v-model="selectedSizes"
                    type="checkbox"
                    value="512x512"
                    class="w-4 h-4 text-blue-600"
                  />
                  <span class="text-sm">512x512</span>
                </label>
                <label
                  class="flex items-center gap-2 p-2 border border-gray-300 rounded-md cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <input
                    v-model="selectedSizes"
                    type="checkbox"
                    value="all"
                    class="w-4 h-4 text-blue-600"
                  />
                  <span class="text-sm">全部尺寸</span>
                </label>
              </div>
            </div>

            <!-- 文件格式 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">输出格式</label>
              <div class="flex flex-wrap gap-3">
                <label
                  class="inline-flex items-center gap-2 p-2 border border-gray-300 rounded-md cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <input
                    v-model="selectedFormats"
                    type="checkbox"
                    value="ico"
                    class="w-4 h-4 text-blue-600"
                  />
                  <span class="text-sm">ICO</span>
                </label>
                <label
                  class="inline-flex items-center gap-2 p-2 border border-gray-300 rounded-md cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <input
                    v-model="selectedFormats"
                    type="checkbox"
                    value="png"
                    class="w-4 h-4 text-blue-600"
                  />
                  <span class="text-sm">PNG</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- 生成结果 -->
        <div class="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">生成结果</h2>

          <div v-if="!generatedFavicons.length" class="text-center py-12 text-gray-500">
            点击「生成 Favicon」按钮创建图标
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="(favicon, index) in generatedFavicons"
              :key="index"
              class="p-3 bg-gray-50 rounded-lg border"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div
                    class="w-12 h-12 border border-gray-200 rounded flex items-center justify-center bg-white"
                  >
                    <img
                      :src="favicon.url"
                      :alt="favicon.name"
                      class="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div>
                    <p class="text-sm font-medium">{{ favicon.name }}</p>
                    <p class="text-xs text-gray-500">
                      {{ favicon.size }} · {{ favicon.format.toUpperCase() }}
                    </p>
                  </div>
                </div>
                <button
                  @click="downloadFavicon(favicon)"
                  class="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                >
                  下载
                </button>
              </div>
            </div>

            <button
              v-if="generatedFavicons.length > 0"
              @click="downloadAll"
              class="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              下载全部
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useToast } from '@/composables/useToast'

const toast = useToast()

// 状态变量
const fileInput = ref<HTMLInputElement | null>(null)
const generating = ref(false)
const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const generatedFavicons = ref<Array<{ url: string; name: string; size: string; format: string }>>(
  [],
)

// 参数设置
const selectedSizes = ref<string[]>(['16x16', '32x32', '48x48'])
const selectedFormats = ref<string[]>(['ico', 'png'])

// 监听尺寸选择，如果选择了"全部尺寸"，则自动选择所有尺寸
watch(selectedSizes, (newSizes) => {
  if (newSizes.includes('all')) {
    selectedSizes.value = [
      '16x16',
      '32x32',
      '48x48',
      '64x64',
      '128x128',
      '256x256',
      '512x512',
      'all',
    ]
  } else if (newSizes.length === 7 && !newSizes.includes('all')) {
    // 如果用户手动选择了所有具体尺寸，自动添加"全部尺寸"
    selectedSizes.value.push('all')
  }
})

// 处理文件上传
const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    processFile(input.files[0])
  }
}

// 处理拖放
const handleDrop = (event: DragEvent) => {
  const files = event.dataTransfer?.files
  if (files && files[0]) {
    processFile(files[0])
  }
}

// 处理文件
const processFile = (file: File) => {
  imageFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

// 处理选择图片按钮点击
const handleSelectClick = () => {
  fileInput.value?.click()
}

// 生成 Favicon
const generateFavicons = async () => {
  if (!imageFile.value) {
    toast.warning('请先上传图片')
    return
  }

  if (selectedSizes.value.length === 0) {
    toast.warning('请选择至少一个尺寸')
    return
  }

  if (selectedFormats.value.length === 0) {
    toast.warning('请选择至少一种格式')
    return
  }

  generating.value = true
  generatedFavicons.value = []

  try {
    const sizes = selectedSizes.value
      .filter((size) => size !== 'all')
      .map((size) => size.split('x').map(Number))
    const formats = selectedFormats.value

    // 模拟生成过程
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // 生成预览数据（实际项目中应该使用 Canvas 进行图像处理）
    for (const size of sizes) {
      for (const format of formats) {
        const sizeStr = `${size[0]}x${size[1]}`
        generatedFavicons.value.push({
          url: imagePreview.value || '',
          name: `favicon_${sizeStr}.${format}`,
          size: sizeStr,
          format,
        })
      }
    }

    toast.success('Favicon 生成成功')
  } catch (error) {
    console.error(error)
    toast.error('生成失败')
  } finally {
    generating.value = false
  }
}

// 下载单个 Favicon
const downloadFavicon = async (favicon: { url: string; name: string }) => {
  try {
    const response = await fetch(favicon.url)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = favicon.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    toast.success(`${favicon.name} 已下载`)
  } catch (error) {
    console.error(error)
    toast.error('下载失败')
  }
}

// 下载全部 Favicon
const downloadAll = () => {
  toast.warning('全部下载功能开发中')
}
</script>
