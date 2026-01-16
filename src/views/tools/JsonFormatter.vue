<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-gray-700">输入</h3>
          <div class="flex space-x-2">
            <button
              @click="formatJson"
              class="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-all duration-150 shadow-sm hover:shadow"
            >
              格式化
            </button>
            <button
              @click="minifyJson"
              class="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-all duration-150 shadow-sm hover:shadow"
            >
              压缩
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
          <div class="overflow-y-auto" :style="{ maxHeight: containerHeight }">
            <textarea
              v-model="inputJson"
              @input="handleInput"
              placeholder="请输入 JSON 字符串..."
              class="w-full p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-150"
              :style="{ minHeight: containerHeight }"
              spellcheck="false"
            ></textarea>
          </div>
        </div>
        <div v-if="errorMessage" class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {{ errorMessage }}
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-gray-700">输出</h3>
          <div class="flex space-x-2">
            <button
              @click="copyOutput"
              class="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-all duration-150 shadow-sm hover:shadow"
            >
              复制
            </button>
            <button
              @click="downloadJson"
              class="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-all duration-150 shadow-sm hover:shadow"
            >
              下载
            </button>
          </div>
        </div>
        <div class="border border-gray-300 rounded-lg bg-white overflow-hidden">
          <div class="overflow-y-auto" :style="{ maxHeight: containerHeight }">
            <div v-if="parsedJson !== null" class="p-4" :style="{ minHeight: containerHeight }">
              <json-viewer :value="parsedJson" :expand-depth="20" copyable sort></json-viewer>
            </div>
            <div v-else class="flex items-center justify-center text-gray-400" :style="{ minHeight: containerHeight }">
              <span>等待输入有效的 JSON...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import JsonViewer from 'vue-json-viewer'
import 'vue-json-viewer/style.css'
import { useToast } from '@/composables/useToast'

const toast = useToast()

const inputJson = ref('')
const parsedJson = ref<unknown>(null)
const errorMessage = ref('')
const containerHeight = ref('500px')

const calculateHeight = () => {
  const windowHeight = window.innerHeight
  const headerHeight = 80
  const padding = 48
  const titleHeight = 40
  const buttonHeight = 40
  const errorHeight = errorMessage.value ? 60 : 0
  const availableHeight = windowHeight - headerHeight - padding - titleHeight - buttonHeight - errorHeight
  containerHeight.value = `${Math.max(400, availableHeight)}px`
}

const handleResize = () => {
  calculateHeight()
}

watch(errorMessage, () => {
  calculateHeight()
})

onMounted(() => {
  calculateHeight()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const handleInput = () => {
  try {
    if (!inputJson.value.trim()) {
      parsedJson.value = null
      errorMessage.value = ''
      return
    }

    const parsed = JSON.parse(inputJson.value)
    parsedJson.value = parsed
    errorMessage.value = ''
  } catch (error) {
    parsedJson.value = null
    errorMessage.value = `JSON 解析错误: ${error instanceof Error ? error.message : '未知错误'}`
  }
}

const formatJson = () => {
  try {
    if (!inputJson.value.trim()) {
      toast.error('请输入 JSON 字符串')
      return
    }

    const parsed = JSON.parse(inputJson.value)
    inputJson.value = JSON.stringify(parsed, null, 2)
    parsedJson.value = parsed
    errorMessage.value = ''
    toast.success('格式化成功')
  } catch (error) {
    errorMessage.value = `JSON 解析错误: ${error instanceof Error ? error.message : '未知错误'}`
    toast.error('格式化失败')
  }
}

const minifyJson = () => {
  try {
    if (!inputJson.value.trim()) {
      toast.error('请输入 JSON 字符串')
      return
    }

    const parsed = JSON.parse(inputJson.value)
    inputJson.value = JSON.stringify(parsed)
    parsedJson.value = parsed
    errorMessage.value = ''
  } catch (error) {
    errorMessage.value = `JSON 解析错误: ${error instanceof Error ? error.message : '未知错误'}`
    toast.error('压缩失败')
  }
}

const clearInput = () => {
  inputJson.value = ''
  parsedJson.value = null
  errorMessage.value = ''
  toast.warning('已清空')
}

const copyOutput = () => {
  if (parsedJson.value === null) {
    toast.error('没有可复制的内容')
    return
  }

  try {
    navigator.clipboard.writeText(JSON.stringify(parsedJson.value, null, 2))
    toast.success('已复制到剪贴板')
  } catch {
    toast.error('复制失败')
  }
}

const downloadJson = () => {
  if (parsedJson.value === null) {
    toast.error('没有可下载的内容')
    return
  }

  try {
    const jsonString = JSON.stringify(parsedJson.value, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'formatted.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success('下载成功')
  } catch {
    toast.error('下载失败')
  }
}
</script>

<style scoped>
textarea {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
}
</style>
