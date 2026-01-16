<template>
  <div class="bg-white rounded-lg shadow-md p-6 h-full">
    <!-- 输入区域 -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-semibold text-gray-700">文本区域</h3>
        <div class="flex space-x-2">
          <button
            @click="pasteInput"
            class="px-3 py-2 bg-blue-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            粘贴
          </button>
          <button
            @click="copyOutput"
            class="px-3 py-2 bg-green-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            复制
          </button>
          <button
            @click="clearInput"
            class="px-3 py-2 bg-gray-600 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            清空
          </button>
        </div>
      </div>

      <div class="border border-gray-300 rounded-lg overflow-hidden">
        <textarea
          v-model="inputText"
          placeholder="请输入要加密 / 解密的文本..."
          class="w-full min-h-[400px] p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>
    </div>

    <!-- 操作区域 -->
    <div class="mt-6">
      <div class="border border-gray-300 rounded-lg p-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            @click="encryptBase64"
            class="px-3 py-2 bg-blue-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            Base64 加密
          </button>
          <button
            @click="decryptBase64"
            class="px-3 py-2 bg-green-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            Base64 解密
          </button>
          <button
            @click="encodeUrl"
            class="px-3 py-2 bg-blue-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            URL 编码
          </button>
          <button
            @click="decodeUrl"
            class="px-3 py-2 bg-green-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            URL 解码
          </button>
          <button
            @click="md5_32_upper"
            class="px-3 py-2 bg-purple-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            MD5 32位大写
          </button>
          <button
            @click="md5_32_lower"
            class="px-3 py-2 bg-purple-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            MD5 32位小写
          </button>
          <button
            @click="md5_16_upper"
            class="px-3 py-2 bg-purple-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            MD5 16位大写
          </button>
          <button
            @click="md5_16_lower"
            class="px-3 py-2 bg-purple-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
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

const toast = useToast()
const inputText = ref('')

/* ---------- 工具 ---------- */

const ensureInput = () => {
  if (!inputText.value.trim()) {
    toast.warning('请先输入文本')
    return false
  }
  return true
}

/* ---------- 剪贴板 ---------- */

const pasteInput = async () => {
  try {
    inputText.value = await navigator.clipboard.readText()
    toast.success('已粘贴')
  } catch {
    toast.error('粘贴失败')
  }
}

const copyOutput = async () => {
  if (!ensureInput()) return
  try {
    await navigator.clipboard.writeText(inputText.value)
    toast.success('已复制到剪贴板')
  } catch {
    toast.error('复制失败')
  }
}

const clearInput = () => {
  inputText.value = ''
  toast.success('已清空')
}

/* ---------- Base64 ---------- */

const encryptBase64 = () => {
  if (!ensureInput()) return
  try {
    inputText.value = Base64.stringify(Utf8.parse(inputText.value))
    toast.success('Base64 加密成功')
  } catch {
    toast.error('Base64 加密失败')
  }
}

const decryptBase64 = () => {
  if (!ensureInput()) return
  try {
    inputText.value = Utf8.stringify(Base64.parse(inputText.value))
    toast.success('Base64 解密成功')
  } catch {
    toast.error('Base64 解密失败，请确认输入内容')
  }
}

/* ---------- URL ---------- */

const encodeUrl = () => {
  if (!ensureInput()) return
  try {
    inputText.value = encodeURIComponent(inputText.value)
    toast.success('URL 编码成功')
  } catch {
    toast.error('URL 编码失败')
  }
}

const decodeUrl = () => {
  if (!ensureInput()) return
  try {
    inputText.value = decodeURIComponent(inputText.value)
    toast.success('URL 解码成功')
  } catch {
    toast.error('URL 解码失败，请确认格式')
  }
}

/* ---------- MD5 ---------- */

const md5_32_upper = () => {
  if (!ensureInput()) return
  inputText.value = md5(inputText.value).toString().toUpperCase()
  toast.success('MD5 32位大写生成成功')
}

const md5_32_lower = () => {
  if (!ensureInput()) return
  inputText.value = md5(inputText.value).toString().toLowerCase()
  toast.success('MD5 32位小写生成成功')
}

const md5_16_upper = () => {
  if (!ensureInput()) return
  inputText.value = md5(inputText.value).toString().substring(8, 24).toUpperCase()
  toast.success('MD5 16位大写生成成功')
}

const md5_16_lower = () => {
  if (!ensureInput()) return
  inputText.value = md5(inputText.value).toString().substring(8, 24).toLowerCase()
  toast.success('MD5 16位小写生成成功')
}
</script>

<style scoped></style>
