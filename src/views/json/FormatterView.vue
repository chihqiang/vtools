<template>
  <div class="bg-gray-50 rounded-xl border border-gray-200 p-6">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 输入区 -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-gray-800 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-blue-500"></span>
            输入 JSON
          </h3>

          <div class="flex space-x-2">
            <button
              @click="formatJson"
              class="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition shadow-sm"
            >
              格式化
            </button>

            <button
              @click="minifyJson"
              class="px-3 py-2 bg-slate-500 text-white rounded-md text-sm hover:bg-slate-600 transition shadow-sm"
            >
              压缩
            </button>

            <button
              @click="clearInput"
              class="px-3 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition"
            >
              清空
            </button>
          </div>
        </div>

        <div class="border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
          <div class="overflow-y-auto" :style="{ maxHeight: containerHeight }">
            <textarea
              v-model="inputJson"
              @input="handleInput"
              placeholder="请输入或粘贴 JSON 字符串..."
              class="w-full p-4 font-mono text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none transition"
              :style="{ minHeight: containerHeight }"
              spellcheck="false"
            ></textarea>
          </div>
        </div>

        <div v-if="errorMessage" class="mt-2 text-sm text-red-500 flex items-center gap-2">
          <span>⚠</span>
          {{ errorMessage }}
        </div>
      </div>

      <!-- 输出区 -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-gray-800 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-green-500"></span>
            输出结果
          </h3>

          <div class="flex space-x-2">
            <button
              @click="copyOutput"
              class="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition shadow-sm"
            >
              复制
            </button>

            <button
              @click="downloadJson"
              class="px-3 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700 transition shadow-sm"
            >
              下载
            </button>
          </div>
        </div>

        <div class="border border-gray-300 rounded-lg overflow-hidden bg-white">
          <div class="overflow-y-auto" :style="{ maxHeight: containerHeight }">
            <div
              v-if="parsedJson !== null"
              class="p-4 bg-gray-50 border-t border-gray-200"
              :style="{ minHeight: containerHeight }"
            >
              <json-viewer :value="parsedJson" :expand-depth="20" copyable sort />
            </div>

            <div
              v-else
              class="flex flex-col items-center justify-center text-gray-400 gap-2"
              :style="{ minHeight: containerHeight }"
            >
              <svg
                class="w-10 h-10 opacity-40"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 7h18M3 12h18M3 17h18" />
              </svg>
              <span class="text-sm">等待输入有效的 JSON</span>
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
  const errorHeight = errorMessage.value ? 40 : 0
  const availableHeight =
    windowHeight - headerHeight - padding - titleHeight - buttonHeight - errorHeight

  containerHeight.value = `${Math.max(420, availableHeight)}px`
}

watch(errorMessage, calculateHeight)

onMounted(() => {
  calculateHeight()
  window.addEventListener('resize', calculateHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', calculateHeight)
})

const handleInput = () => {
  try {
    if (!inputJson.value.trim()) {
      parsedJson.value = null
      errorMessage.value = ''
      return
    }

    parsedJson.value = JSON.parse(inputJson.value)
    errorMessage.value = ''
  } catch (e) {
    parsedJson.value = null
    errorMessage.value = `JSON 解析错误：${e instanceof Error ? e.message : '未知错误'}`
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
  } catch (e) {
    errorMessage.value = `JSON 解析错误：${e instanceof Error ? e.message : '未知错误'}`
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
  } catch (e) {
    errorMessage.value = `JSON 解析错误：${e instanceof Error ? e.message : '未知错误'}`
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
  if (!parsedJson.value) {
    toast.error('没有可复制的内容')
    return
  }

  navigator.clipboard.writeText(JSON.stringify(parsedJson.value, null, 2))
  toast.success('已复制')
}

const downloadJson = () => {
  if (!parsedJson.value) {
    toast.error('没有可下载的内容')
    return
  }

  const blob = new Blob([JSON.stringify(parsedJson.value, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = 'formatted.json'
  link.click()

  URL.revokeObjectURL(url)
  toast.success('下载成功')
}
</script>

<style scoped>
textarea {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  line-height: 1.6;
  tab-size: 2;
}
</style>
