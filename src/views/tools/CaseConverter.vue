<template>
  <div class="bg-white rounded-lg shadow-md p-6 h-full">
    <div class="mb-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- 单个文本区域 - 占用3列 -->
      <div class="lg:col-span-3">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-gray-700">文本内容</h3>
          <div class="flex space-x-2">
            <button
              @click="pasteText"
              class="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-all duration-150 shadow-sm hover:shadow"
            >
              粘贴
            </button>
            <button
              @click="copyText"
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
        <!-- 固定高度的文本框 -->
        <div class="border border-gray-300 rounded-lg bg-white overflow-hidden">
          <!-- 滚动容器 -->
          <div class="max-h-[400px] overflow-y-auto">
            <textarea
              v-model="inputText"
              placeholder="请输入英文文本，然后选择转换方式..."
              class="w-full p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-150 min-h-[400px]"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- 转换按钮区域 - 占用1列 -->
      <div class="flex flex-col gap-3">
        <h3 class="font-semibold text-gray-700 mb-1">转换方式</h3>
        <button
          @click="convertToUpperCase"
          class="px-4 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-all duration-150 shadow-sm hover:shadow"
        >
          全部大写 (UPPERCASE)
        </button>
        <button
          @click="convertToLowerCase"
          class="px-4 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-all duration-150 shadow-sm hover:shadow"
        >
          全部小写 (lowercase)
        </button>
        <button
          @click="convertToFirstUpperCase"
          class="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-all duration-150 shadow-sm hover:shadow"
        >
          首字母大写 (First Uppercase)
        </button>
        <button
          @click="convertToFirstLowerCase"
          class="px-4 py-2 bg-purple-500 text-white rounded text-sm hover:bg-purple-600 transition-all duration-150 shadow-sm hover:shadow"
        >
          首字母小写 (first Uppercase)
        </button>
        <button
          @click="convertToSentenceCase"
          class="px-4 py-2 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 transition-all duration-150 shadow-sm hover:shadow"
        >
          句子首字母大写 (Sentence case)
        </button>
        <button
          @click="convertToTitleCase"
          class="px-4 py-2 bg-indigo-500 text-white rounded text-sm hover:bg-indigo-600 transition-all duration-150 shadow-sm hover:shadow"
        >
          标题大小写 (Title Case)
        </button>
        <button
          @click="convertToCamelCase"
          class="px-4 py-2 bg-pink-500 text-white rounded text-sm hover:bg-pink-600 transition-all duration-150 shadow-sm hover:shadow"
        >
          驼峰命名 (camelCase)
        </button>
        <button
          @click="convertToSnakeCase"
          class="px-4 py-2 bg-teal-500 text-white rounded text-sm hover:bg-teal-600 transition-all duration-150 shadow-sm hover:shadow"
        >
          下划线命名 (snake_case)
        </button>
        <button
          @click="convertToKebabCase"
          class="px-4 py-2 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 transition-all duration-150 shadow-sm hover:shadow"
        >
          短横线命名 (kebab-case)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/composables/useToast'

const toast = useToast()

const inputText = ref('')

// 转换为全大写
const convertToUpperCase = () => {
  if (!inputText.value.trim()) {
    toast.error('请输入要转换的文本')
    return
  }

  inputText.value = inputText.value.toUpperCase()
  toast.success('转换为全大写成功')
}

// 转换为全小写
const convertToLowerCase = () => {
  if (!inputText.value.trim()) {
    toast.error('请输入要转换的文本')
    return
  }

  inputText.value = inputText.value.toLowerCase()
  toast.success('转换为全小写成功')
}

// 转换为首字母大写
const convertToFirstUpperCase = () => {
  if (!inputText.value.trim()) {
    toast.error('请输入要转换的文本')
    return
  }

  inputText.value = inputText.value.charAt(0).toUpperCase() + inputText.value.slice(1)
  toast.success('转换为首字母大写成功')
}

// 转换为首字母小写
const convertToFirstLowerCase = () => {
  if (!inputText.value.trim()) {
    toast.error('请输入要转换的文本')
    return
  }

  inputText.value = inputText.value.charAt(0).toLowerCase() + inputText.value.slice(1)
  toast.success('转换为首字母小写成功')
}

// 转换为句子首字母大写
const convertToSentenceCase = () => {
  if (!inputText.value.trim()) {
    toast.error('请输入要转换的文本')
    return
  }

  // 将每个句子的首字母大写
  inputText.value = inputText.value
    .toLowerCase()
    .replace(/(^|[.!?]\s+)([a-z])/g, (match, separator, char) => separator + char.toUpperCase())
  toast.success('转换为句子首字母大写成功')
}

// 转换为标题大小写
const convertToTitleCase = () => {
  if (!inputText.value.trim()) {
    toast.error('请输入要转换的文本')
    return
  }

  // 常见的不应该大写的单词
  const lowercaseWords = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'in', 'of', 'with', 'about', 'as', 'into', 'like', 'through', 'after', 'over', 'between', 'out', 'against', 'during', 'before', 'under', 'around', 'among', 'below', 'above']

  inputText.value = inputText.value
    .toLowerCase()
    .split(/\s+/)
    .map((word, index) => {
      // 第一个单词和最后一个单词总是大写
      if (index === 0 || index === inputText.value.split(/\s+/).length - 1) {
        return word.charAt(0).toUpperCase() + word.slice(1)
      }
      // 其他单词检查是否在小写单词列表中
      return lowercaseWords.includes(word)
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
  toast.success('转换为标题大小写成功')
}

// 转换为驼峰命名
const convertToCamelCase = () => {
  if (!inputText.value.trim()) {
    toast.error('请输入要转换的文本')
    return
  }

  const words = inputText.value
    .toLowerCase()
    .split(/[^a-zA-Z0-9]+/)
    .filter(word => word)

  if (words.length === 0) {
    toast.error('没有可转换的有效单词')
    return
  }

  inputText.value = words[0] + words.slice(1)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
  toast.success('转换为驼峰命名成功')
}

// 转换为下划线命名
const convertToSnakeCase = () => {
  if (!inputText.value.trim()) {
    toast.error('请输入要转换的文本')
    return
  }

  inputText.value = inputText.value
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
  toast.success('转换为下划线命名成功')
}

// 转换为短横线命名
const convertToKebabCase = () => {
  if (!inputText.value.trim()) {
    toast.error('请输入要转换的文本')
    return
  }

  inputText.value = inputText.value
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  toast.success('转换为短横线命名成功')
}

// 清空输入
const clearInput = () => {
  inputText.value = ''
  toast.success('已清空')
}

// 粘贴功能
const pasteText = async () => {
  try {
    const clipboardText = await navigator.clipboard.readText()
    inputText.value = clipboardText
    toast.success('已粘贴')
  } catch {
    toast.error('粘贴失败')
  }
}

// 复制文本
const copyText = () => {
  if (!inputText.value.trim()) {
    toast.error('没有可复制的内容')
    return
  }

  try {
    navigator.clipboard.writeText(inputText.value)
    toast.success('已复制到剪贴板')
  } catch {
    toast.error('复制失败')
  }
}
</script>
