<template>
  <div class="bg-white rounded-lg shadow-md p-6 h-full">
    <div class="mb-8 grid grid-cols-1 md:grid-cols-12 gap-6">
      <!-- 左边输入区域 -->
      <div class="md:col-span-5">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-gray-700">输入文本</h3>
          <div class="flex space-x-2">
            <button
              @click="pasteInput"
              class="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-all duration-150 shadow-sm hover:shadow"
            >
              粘贴
            </button>
            <button
              @click="clearInput"
              class="px-3 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-all duration-150 shadow-sm hover:shadow"
            >
              清空
            </button>
          </div>
        </div>
        <!-- 固定高度的输入框 -->
        <div class="border border-gray-300 rounded-lg bg-white overflow-hidden">
          <!-- 滚动容器 -->
          <div class="max-h-[400px] overflow-y-auto">
            <textarea
              v-model="inputText"
              placeholder="请输入要加密/解密的文本..."
              class="w-full p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-150 min-h-[400px]"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- 中间功能区域 -->
      <div class="md:col-span-2">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-gray-700">加密方式</h3>
        </div>
        <div class="border border-gray-300 rounded-lg bg-white overflow-hidden">
          <!-- 滚动容器 -->
          <div class="max-h-[400px] overflow-y-auto">
            <div class="p-4 flex flex-col space-y-2">
              <!-- Base64 -->
              <button
                @click="encryptBase64"
                class="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-all duration-150 shadow-sm hover:shadow"
              >
                Base64 加密
              </button>
              <button
                @click="decryptBase64"
                class="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-all duration-150 shadow-sm hover:shadow"
              >
                Base64 解密
              </button>

              <!-- URL编码 -->
              <button
                @click="encodeUrl"
                class="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-all duration-150 shadow-sm hover:shadow"
              >
                URL 编码
              </button>
              <button
                @click="decodeUrl"
                class="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-all duration-150 shadow-sm hover:shadow"
              >
                URL 解码
              </button>

              <!-- MD5加密 -->
              <button
                @click="md5_32_upper"
                class="px-3 py-2 bg-purple-500 text-white rounded text-sm hover:bg-purple-600 transition-all duration-150 shadow-sm hover:shadow"
              >
                MD5 32位大写
              </button>
              <button
                @click="md5_32_lower"
                class="px-3 py-2 bg-purple-500 text-white rounded text-sm hover:bg-purple-600 transition-all duration-150 shadow-sm hover:shadow"
              >
                MD5 32位小写
              </button>
              <button
                @click="md5_16_upper"
                class="px-3 py-2 bg-purple-500 text-white rounded text-sm hover:bg-purple-600 transition-all duration-150 shadow-sm hover:shadow"
              >
                MD5 16位大写
              </button>
              <button
                @click="md5_16_lower"
                class="px-3 py-2 bg-purple-500 text-white rounded text-sm hover:bg-purple-600 transition-all duration-150 shadow-sm hover:shadow"
              >
                MD5 16位小写
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 右边输出区域 -->
      <div class="md:col-span-5">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-gray-700">输出结果</h3>
          <div class="flex space-x-2">
            <button
              @click="copyOutput"
              class="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-all duration-150 shadow-sm hover:shadow"
            >
              复制
            </button>
            <button
              @click="clearOutput"
              class="px-3 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-all duration-150 shadow-sm hover:shadow"
            >
              清空
            </button>
          </div>
        </div>
        <!-- 固定高度的输出框 -->
        <div class="border border-gray-300 rounded-lg bg-white overflow-hidden">
          <!-- 滚动容器 -->
          <div class="max-h-[400px] overflow-y-auto">
            <textarea
              v-model="outputText"
              readonly
              placeholder="加密/解密结果将显示在这里..."
              class="w-full p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-150 min-h-[400px] bg-gray-50"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/composables/useToast'
import md5 from 'crypto-js/md5'
import Base64 from 'crypto-js/enc-base64'
import Utf8 from 'crypto-js/enc-utf8'

// 状态管理
const inputText = ref('')
const outputText = ref('')

// 消息提示
const { success, error, warning, info } = useToast()

// 粘贴功能
const pasteInput = async () => {
  try {
    const text = await navigator.clipboard.readText()
    inputText.value = text
    success('粘贴成功')
  } catch {
    error('粘贴失败')
  }
}

// 复制功能
const copyOutput = async () => {
  if (!outputText.value) {
    warning('没有内容可以复制')
    return
  }

  try {
    await navigator.clipboard.writeText(outputText.value)
    success('复制成功')
  } catch {
    error('复制失败')
  }
}

// 清空功能
const clearInput = () => {
  inputText.value = ''
  info('输入已清空')
}

const clearOutput = () => {
  outputText.value = ''
  info('输出已清空')
}

// Base64加密
const encryptBase64 = () => {
  if (!inputText.value) {
    warning('请先输入文本')
    return
  }

  try {
    outputText.value = Base64.stringify(Utf8.parse(inputText.value))
    success('Base64加密成功')
  } catch {
    error('Base64加密失败')
  }
}

// Base64解密
const decryptBase64 = () => {
  if (!inputText.value) {
    warning('请先输入文本')
    return
  }

  try {
    outputText.value = Utf8.stringify(Base64.parse(inputText.value))
    success('Base64解密成功')
  } catch {
    error('Base64解密失败')
  }
}

// URL编码
const encodeUrl = () => {
  if (!inputText.value) {
    warning('请先输入文本')
    return
  }

  try {
    outputText.value = encodeURIComponent(inputText.value)
    success('URL编码成功')
  } catch {
    error('URL编码失败')
  }
}

// URL解码
const decodeUrl = () => {
  if (!inputText.value) {
    warning('请先输入文本')
    return
  }

  try {
    outputText.value = decodeURIComponent(inputText.value)
    success('URL解码成功')
  } catch {
    error('URL解码失败')
  }
}

// MD5 32位大写
const md5_32_upper = () => {
  if (!inputText.value) {
    warning('请先输入文本')
    return
  }

  try {
    const md5Hash = md5(inputText.value).toString()
    outputText.value = md5Hash.toUpperCase()
    success('MD5 32位大写加密成功')
  } catch {
    error('MD5加密失败')
  }
}

// MD5 32位小写
const md5_32_lower = () => {
  if (!inputText.value) {
    warning('请先输入文本')
    return
  }

  try {
    const md5Hash = md5(inputText.value).toString()
    outputText.value = md5Hash.toLowerCase()
    success('MD5 32位小写加密成功')
  } catch {
    error('MD5加密失败')
  }
}

// MD5 16位大写
const md5_16_upper = () => {
  if (!inputText.value) {
    warning('请先输入文本')
    return
  }

  try {
    const md5Hash = md5(inputText.value).toString()
    outputText.value = md5Hash.substring(8, 24).toUpperCase()
    success('MD5 16位大写加密成功')
  } catch {
    error('MD5加密失败')
  }
}

// MD5 16位小写
const md5_16_lower = () => {
  if (!inputText.value) {
    warning('请先输入文本')
    return
  }

  try {
    const md5Hash = md5(inputText.value).toString()
    outputText.value = md5Hash.substring(8, 24).toLowerCase()
    success('MD5 16位小写加密成功')
  } catch {
    error('MD5加密失败')
  }
}
</script>
