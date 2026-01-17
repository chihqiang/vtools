<template>
  <div class="bg-gray-50 rounded-xl border border-gray-200 p-6 flex flex-col h-screen">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-hidden">
      <!-- 输入区 -->
      <div class="flex flex-col h-full">
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

        <div class="border border-gray-300 rounded-lg overflow-hidden flex-1 flex flex-col">
          <textarea
            v-model="inputJson"
            @input="handleInput"
            placeholder="请输入或粘贴 JSON 字符串..."
            class="w-full p-4 font-mono text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y flex-1 transition"
            spellcheck="false"
          ></textarea>
        </div>

        <div v-if="errorMessage" class="mt-2 text-sm text-red-500 flex items-center gap-2">
          <span>⚠</span>
          {{ errorMessage }}
        </div>
      </div>

      <!-- 输出区 -->
      <div class="flex flex-col h-full">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-gray-800 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-green-500"></span>
            输出结果
          </h3>
          <div class="flex items-center space-x-2">
            <div class="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-md">
              <label for="expandDepth" class="text-xs text-gray-600">展开深度:</label>
              <input
                id="expandDepth"
                v-model.number="userExpandDepth"
                type="number"
                min="0"
                max="20"
                class="w-16 text-sm text-center border border-gray-300 rounded-md p-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                @change="updateExpandDepth"
              />
            </div>
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
            <button
              @click="toggleExpandDepth"
              class="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition shadow-sm"
            >
              {{ isExpanded ? '收起' : '展开全部' }}
            </button>
          </div>
        </div>

        <div class="border border-gray-300 rounded-lg overflow-auto flex-1 flex flex-col bg-white">
          <div
            v-if="parsedJson !== null"
            class="p-4 bg-gray-50 border-t border-gray-200 flex-1 overflow-auto"
          >
            <!-- 使用 key 强制刷新，动态展开/收起 -->
            <json-viewer
              :key="currentExpandDepth"
              :value="parsedJson"
              :expand-depth="currentExpandDepth"
              copyable
              sort
            />
          </div>

          <div v-else class="flex flex-col items-center justify-center text-gray-400 gap-2 flex-1">
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
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JsonViewer from 'vue-json-viewer'
import 'vue-json-viewer/style.css'
import { useToast } from '@/composables/useToast'
import debounce from 'lodash/debounce'

const toast = useToast()

const inputJson = ref('')
const parsedJson = ref<unknown>(null)
const errorMessage = ref('')

// 展开层级
const defaultExpandDepth = 3
const isExpanded = ref(false)
const currentExpandDepth = ref(defaultExpandDepth)
const userExpandDepth = ref(defaultExpandDepth)

// 更新展开深度
const updateExpandDepth = () => {
  // 确保输入在有效范围内
  if (userExpandDepth.value < 0) userExpandDepth.value = 0
  if (userExpandDepth.value > 20) userExpandDepth.value = 20

  // 只有在未展开全部时才更新当前展开深度
  if (!isExpanded.value) {
    currentExpandDepth.value = userExpandDepth.value
  }
}

// -----------------------------
// 防抖解析 JSON
// -----------------------------
const parseJsonDebounced = debounce(() => {
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
}, 300)

const handleInput = () => {
  parseJsonDebounced()
}

// -----------------------------
// 格式化 / 压缩 / 清空
// -----------------------------
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
    toast.success('压缩成功')
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

// -----------------------------
// 复制 / 下载
// -----------------------------
const copyOutput = () => {
  if (!parsedJson.value) {
    toast.error('没有可复制的内容')
    return
  }
  try {
    navigator.clipboard.writeText(JSON.stringify(parsedJson.value, null, 2))
    toast.success('已复制')
  } catch {
    toast.error('复制失败')
  }
}

const downloadJson = () => {
  if (!parsedJson.value) {
    toast.error('没有可下载的内容')
    return
  }
  try {
    const blob = new Blob([JSON.stringify(parsedJson.value, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'formatted.json'
    link.click()
    URL.revokeObjectURL(url)
    toast.success('下载成功')
  } catch {
    toast.error('下载失败')
  }
}

// -----------------------------
// 展开 / 收起按钮
// -----------------------------
const toggleExpandDepth = () => {
  isExpanded.value = !isExpanded.value

  if (isExpanded.value) {
    // 展开全部时使用最大深度
    currentExpandDepth.value = 20
  } else {
    // 收起时使用用户设置的深度
    currentExpandDepth.value = userExpandDepth.value
  }
}
</script>

<style scoped>
textarea {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  line-height: 1.6;
  tab-size: 2;
}
</style>
