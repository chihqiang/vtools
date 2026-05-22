<template>
  <div class="min-h-screen p-4 sm:p-6 flex flex-col bg-gray-50 border border-gray-200 rounded-xl">
    <!-- 加载状态 -->
    <LoadingSpinner v-if="loading" :loading="loading" :message="loadingMessage" :overlay="true" />

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 flex-1 min-h-0">
      <!-- 左侧输入区 -->
      <div class="flex flex-col h-full min-h-0">
        <!-- 输入区标题与操作 -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
          <h3 class="font-semibold text-gray-800 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-blue-500"></span> 输入 JSON
          </h3>
          <div class="flex flex-wrap gap-2">
            <button
              @click="formatJson"
              class="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 whitespace-nowrap"
              :disabled="loading"
            >
              格式化
            </button>
            <button
              @click="minifyJson"
              class="px-3 py-2 bg-slate-500 text-white rounded-md text-sm hover:bg-slate-600 whitespace-nowrap"
              :disabled="loading"
            >
              压缩
            </button>
            <button
              @click="clearInput"
              class="px-3 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 whitespace-nowrap"
              :disabled="loading"
            >
              清空
            </button>
          </div>
        </div>

        <!-- 输入框滚动区域 -->
        <div class="border border-gray-300 rounded-lg flex-1 min-h-0 overflow-auto">
          <textarea
            v-model="inputJson"
            placeholder="请输入或粘贴 JSON 字符串..."
            class="w-full h-full p-3 sm:p-4 font-mono text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none overflow-auto"
            spellcheck="false"
          ></textarea>
        </div>

        <div v-if="errorMessage" class="mt-2 text-sm text-red-500 flex items-center gap-2">
          ⚠ {{ errorMessage }}
        </div>
      </div>

      <!-- 右侧输出区 -->
      <div class="flex flex-col h-full min-h-0">
        <!-- 输出区操作栏 -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
          <h3 class="font-semibold text-gray-800 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-green-500"></span> 输出结果
          </h3>
          <div class="flex flex-wrap items-center gap-2">
            <div class="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-md">
              <label for="expandDepth" class="text-xs text-gray-600 whitespace-nowrap"
                >展开深度:</label
              >
              <div class="flex items-center gap-0.5">
                <button
                  @click="decreaseDepth"
                  class="px-2 sm:px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded border border-blue-200 hover:bg-blue-100 transition-colors font-medium shadow-sm"
                >
                  -
                </button>
                <input
                  id="expandDepth"
                  v-model.number="userExpandDepth"
                  type="number"
                  min="0"
                  class="w-12 sm:w-16 text-sm text-center border border-blue-200 rounded p-1.5 bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-500 text-blue-700"
                  @change="updateExpandDepth"
                />
                <button
                  @click="increaseDepth"
                  class="px-2 sm:px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded border border-blue-200 hover:bg-blue-100 transition-colors font-medium shadow-sm"
                >
                  +
                </button>
              </div>
            </div>
            <div class="flex gap-2">
              <button
                @click="copyOutput"
                class="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 whitespace-nowrap"
              >
                复制
              </button>
              <button
                @click="downloadJson"
                class="px-3 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700 whitespace-nowrap"
              >
                下载
              </button>
            </div>
          </div>
        </div>

        <!-- 输出结果滚动区域 -->
        <div class="border border-gray-300 rounded-lg flex-1 min-h-0 overflow-auto bg-white">
          <div v-if="parsedJson !== null" class="p-3 sm:p-4 min-h-0 overflow-auto">
            <json-viewer
              :key="currentExpandDepth"
              :value="parsedJson"
              :expand-depth="currentExpandDepth"
              copyable
              sort
            />
          </div>
          <div
            v-else
            class="flex flex-col items-center justify-center text-gray-400 gap-2 min-h-0 p-4"
          >
            <svg
              class="w-8 sm:w-10 h-8 sm:h-10 opacity-40"
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
import { downloader } from '@/utils/file'
import { ref, watch, onUnmounted } from 'vue'
import JsonViewer from 'vue-json-viewer'
import 'vue-json-viewer/style.css'
import { useToast } from '@/composables/useToast'
import { debounce } from '@/utils/debounce'
import { toastCopy } from '@/utils/clipboard'
import { getCurrentDateTime } from '@/utils/times'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const toast = useToast()
const inputJson = ref('')
const parsedJson = ref<unknown>(null)
const errorMessage = ref('')
const loading = ref(false)
const loadingMessage = ref('')

const getErrorMsg = (e: unknown) =>
  `JSON 解析错误：${e instanceof Error ? e.message : '未知错误'}`

// 展开层级
const defaultExpandDepth = 1
const userExpandDepth = ref(defaultExpandDepth)
const currentExpandDepth = ref(defaultExpandDepth)

// 更新展开深度
const updateExpandDepth = () => {
  if (userExpandDepth.value < 0) userExpandDepth.value = 0
  currentExpandDepth.value = userExpandDepth.value
}

// 减少展开深度
const decreaseDepth = () => {
  if (userExpandDepth.value > 0) userExpandDepth.value--
}

// 增加展开深度
const increaseDepth = () => {
  userExpandDepth.value++
  updateExpandDepth()
}

// 防抖解析 JSON
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
    errorMessage.value = getErrorMsg(e)
  }
}, 300)

watch(inputJson, () => parseJsonDebounced())

onUnmounted(() => {
  ;(parseJsonDebounced as unknown as { cancel: () => void }).cancel()
})

// 格式化 / 压缩 / 清空
const formatJson = () => {
  try {
    if (!inputJson.value.trim()) {
      toast.error('请输入 JSON 字符串')
      return
    }
    // 解析 JSON
    const parsed = JSON.parse(inputJson.value)

    // 格式化输出
    inputJson.value = JSON.stringify(parsed, null, 2)
    parsedJson.value = parsed
    errorMessage.value = ''
    toast.success('格式化成功（反斜杠已处理）')
  } catch (e) {
    errorMessage.value = getErrorMsg(e)
    toast.error('格式化失败')
  }
}
const minifyJson = () => {
  try {
    if (!inputJson.value.trim()) return toast.error('请输入 JSON 字符串')
    const parsed = JSON.parse(inputJson.value)
    inputJson.value = JSON.stringify(parsed)
    parsedJson.value = parsed
    errorMessage.value = ''
    toast.success('压缩成功')
  } catch (e) {
    errorMessage.value = getErrorMsg(e)
    toast.error('压缩失败')
  }
}

const clearInput = () => {
  inputJson.value = ''
  parsedJson.value = null
  errorMessage.value = ''
  toast.warning('已清空')
}

// 复制 / 下载
const copyOutput = () => {
  if (!parsedJson.value) return toast.error('没有可复制的内容')
  toastCopy(JSON.stringify(parsedJson.value, null, 2), '', {
    onLoading: (isLoading) => {
      loading.value = isLoading
      loadingMessage.value = isLoading ? '复制中...' : ''
    },
  })
}
const downloadJson = () => {
  if (!parsedJson.value) return toast.error('没有可下载的内容')
  try {
    downloader.json(parsedJson.value, {
      filename: `formatted-${getCurrentDateTime()}.json`,
      onLoading: (isLoading) => {
        loading.value = isLoading
        loadingMessage.value = isLoading ? '下载中...' : ''
      },
    })
    toast.success('下载成功')
  } catch {
    toast.error('下载失败')
    loading.value = false
    loadingMessage.value = ''
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
