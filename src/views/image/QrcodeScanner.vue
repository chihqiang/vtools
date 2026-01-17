<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 p-4 md:p-6">
    <div class="max-w-7xl mx-auto">
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
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
            <h1 class="text-xl md:text-2xl font-bold text-gray-900">二维码识别器</h1>
          </div>
          <p class="text-gray-600 text-sm">快速识别图片中的二维码内容</p>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- 左侧：识别设置 -->
        <div class="flex-1 bg-white rounded-xl shadow-sm p-4 md:p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">识别方式</h2>

          <!-- 上传图片 -->
          <div class="mb-6">
            <div
              @dragover.prevent="dragging = true"
              @dragleave.prevent="dragging = false"
              @drop.prevent="handleDrop"
              class="border-2 border-dashed rounded-xl p-8 text-center transition-all"
              :class="{
                'border-blue-400 bg-blue-50': dragging,
                'border-gray-300 bg-gray-50 hover:border-blue-300 hover:bg-blue-50': !dragging,
              }"
            >
              <svg
                class="w-16 h-16 mx-auto mb-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p class="text-gray-600 mb-3">拖放图片到此处或点击选择文件</p>
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleFileChange"
              />
              <button
                type="button"
                @click="fileInput?.click()"
                class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm"
              >
                选择图片
              </button>
            </div>
          </div>

          <!-- 识别结果 -->
          <div v-if="scannedResult" class="mb-6">
            <h3 class="text-sm font-medium text-gray-700 mb-3">识别结果</h3>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-medium text-gray-500">内容</span>
                <button
                  @click="copyResult"
                  class="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    ></path>
                  </svg>
                  复制
                </button>
              </div>
              <pre
                class="whitespace-pre-wrap break-all text-sm text-gray-800 font-mono p-2 bg-white rounded"
                >{{ scannedResult }}</pre
              >
            </div>
          </div>
        </div>

        <!-- 右侧：预览 -->
        <div class="bg-white rounded-xl shadow-sm p-4 md:p-6 min-w-[300px] max-w-md">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">图片预览</h2>

          <div class="space-y-4">
            <!-- 图片预览 -->
            <div v-if="previewImage" class="bg-gray-50 rounded-lg p-4">
              <img
                :src="previewImage"
                class="w-full h-auto object-contain rounded-lg"
                alt="QR Code Preview"
              />
            </div>

            <!-- 识别状态 -->
            <div v-if="scanning" class="flex items-center gap-2 text-blue-600">
              <svg
                class="w-4 h-4 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9M4 16v5h.581m15.355-2A8.001 8.001 0 014.581 17m0 0a8.002 8.002 0 01-7.128-4.18C5.227 10.626 8.382 8 12 8c3.618 0 6.773 2.626 7.128 6.82m0 0A7.998 7.998 0 0012 16a7.998 7.998 0 00-2.872 0m0 0A8.001 8.001 0 014.581 17"
                />
              </svg>
              <span class="text-sm">正在识别...</span>
            </div>

            <!-- 错误信息 -->
            <div
              v-if="errorMessage"
              class="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg"
            >
              {{ errorMessage }}
            </div>

            <!-- 空状态 -->
            <div
              v-if="!previewImage && !scannedResult"
              class="bg-gray-50 rounded-lg p-8 text-center"
            >
              <svg
                class="w-16 h-16 mx-auto mb-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              <p class="text-gray-500">请上传图片或使用摄像头扫描二维码</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { BrowserMultiFormatReader } from '@zxing/browser'
import { BarcodeFormat, DecodeHintType } from '@zxing/library'
import { useToast } from '@/composables/useToast'

const toast = useToast()

/* =====================
 * 基础状态
 * ===================== */
const fileInput = ref<HTMLInputElement | null>(null)
const previewImage = ref<string | null>(null)
const dragging = ref(false)

const scannedResult = ref<string | null>(null)
const scanning = ref(false)
const errorMessage = ref<string | null>(null)

/* =====================
 * ZXing Reader（只识别二维码）
 * ===================== */
const hints = new Map()
hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.QR_CODE])

const reader = new BrowserMultiFormatReader(hints, {
  delayBetweenScanAttempts: 0,
  delayBetweenScanSuccess: 0,
})

/* =====================
 * 文件选择 / 拖拽
 * ===================== */
const handleFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files?.[0]) {
    processFile(input.files[0])
    input.value = ''
  }
}

const handleDrop = (e: DragEvent) => {
  dragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) processFile(file)
}

const processFile = (file: File) => {
  if (!file.type.startsWith('image/')) {
    errorMessage.value = '请选择图片文件'
    return
  }

  scannedResult.value = null
  errorMessage.value = null

  const fr = new FileReader()
  fr.onload = (e) => {
    previewImage.value = e.target?.result as string
    scanQrCodeFromImage(file)
  }
  fr.readAsDataURL(file)
}

/* =====================
 * 图片加载 & 限制尺寸
 * ===================== */
const loadImage = async (file: File, maxSize = 1600): Promise<HTMLImageElement> => {
  const img = document.createElement('img')
  const url = URL.createObjectURL(file)
  img.src = url

  await img.decode()

  const { width: imgWidth, height: imgHeight } = img
  if (imgWidth <= maxSize && imgHeight <= maxSize) {
    return img
  }

  const ratio = Math.min(maxSize / imgWidth, maxSize / imgHeight)
  const canvas = document.createElement('canvas')
  canvas.width = Math.floor(imgWidth * ratio)
  canvas.height = Math.floor(imgHeight * ratio)

  canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)

  const resized = document.createElement('img')
  resized.src = canvas.toDataURL('image/png')
  await resized.decode()

  URL.revokeObjectURL(url)
  return resized
}

/* =====================
 * 核心识别逻辑（最终版）
 * ===================== */
const scanQrCodeFromImage = async (file: File) => {
  scanning.value = true
  errorMessage.value = null

  let img: HTMLImageElement | null = null

  try {
    img = await loadImage(file)

    const result = await reader.decodeFromImageElement(img)

    scannedResult.value = result.getText()
    toast.success('二维码识别成功')
  } catch {
    errorMessage.value = '未检测到二维码'
    toast.error('未检测到二维码')
  } finally {
    scanning.value = false
  }
}

/* =====================
 * 复制结果
 * ===================== */
const copyResult = () => {
  if (!scannedResult.value) return

  navigator.clipboard
    .writeText(scannedResult.value)
    .then(() => toast.success('已复制到剪贴板'))
    .catch(() => toast.error('复制失败'))
}
</script>
