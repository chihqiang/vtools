<template>
  <div class="bg-white rounded-lg shadow-md p-6 h-full">
    <div>
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-semibold text-gray-700">文本区域</h3>
        <div class="flex space-x-2">
          <button
            @click="pasteInput"
            class="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-all duration-150 shadow-sm hover:shadow"
          >
            粘贴
          </button>
          <button
            @click="copyOutput"
            class="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-all duration-150 shadow-sm hover:shadow"
          >
            复制
          </button>
          <button
            @click="clearInput"
            class="px-3 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-all duration-150 shadow-sm hover:shadow"
          >
            清空
          </button>
        </div>
      </div>
      <div class="border border-gray-300 rounded-lg bg-white overflow-hidden">
        <div class="max-h-[400px] overflow-y-auto">
          <textarea
            v-model="inputText"
            placeholder="请输入要加密/解密的文本..."
            class="w-full p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-150 min-h-[400px]"
          ></textarea>
        </div>
      </div>
    </div>

    <div class="mt-6">
      <div class="border border-gray-300 rounded-lg bg-white p-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
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
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/composables/useToast'
import md5 from 'crypto-js/md5'
import Base64 from 'crypto-js/enc-base64'
import Utf8 from 'crypto-js/enc-utf8'

// 状态管理
const inputText = ref('')

// 消息提示
const {error, warning } = useToast()

// 粘贴功能
const pasteInput = async () => {
  try {
    const text = await navigator.clipboard.readText()
    inputText.value = text
  } catch {
    error('粘贴失败')
  }
}

// 复制功能
const copyOutput = async () => {
  if (!inputText.value) {
    warning('没有内容可以复制')
    return
  }

  try {
    await navigator.clipboard.writeText(inputText.value)
  } catch {
    error('复制失败')
  }
}

// 清空功能
const clearInput = () => {
  inputText.value = ''
}

// Base64加密
const encryptBase64 = () => {
  if (!inputText.value) {
    warning('请先输入文本')
    return
  }

  try {
    inputText.value = Base64.stringify(Utf8.parse(inputText.value))

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
    inputText.value = Utf8.stringify(Base64.parse(inputText.value))
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
    inputText.value = encodeURIComponent(inputText.value)
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
    inputText.value = decodeURIComponent(inputText.value)
      
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
    inputText.value = md5Hash.toUpperCase()

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
    inputText.value = md5Hash.toLowerCase()
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
    inputText.value = md5Hash.substring(8, 24).toUpperCase()
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
    inputText.value = md5Hash.substring(8, 24).toLowerCase()
  } catch {
    error('MD5加密失败')
  }
}
</script>
