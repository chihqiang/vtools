<template>
  <div
    class="flex flex-col flex-1 min-h-0 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden"
  >
    <!-- 输入区与输出区并排 -->
    <div class="flex-1 min-h-0 grid grid-cols-2" style="gap: 1px; background: #e5e7eb">
      <!-- 左侧输入区 -->
      <div class="flex flex-col bg-white min-h-0">
        <!-- 输入区标题与操作 -->
        <div
          class="flex-shrink-0 flex items-center justify-between px-3 py-2 border-b border-gray-100"
        >
          <div class="flex items-center gap-2">
            <span class="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <span class="w-2 h-2 rounded-full bg-blue-500"></span>
              输入 JSON
            </span>
            <!-- 校验状态 -->
            <span
              v-if="inputJson.trim()"
              :class="[
                'text-xs px-1.5 py-0.5 rounded',
                errorMessage ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600',
              ]"
            >
              {{ errorMessage ? '格式错误' : '格式正确' }}
            </span>
          </div>
          <div class="flex items-center gap-1">
            <button
              @click="formatJson"
              class="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors"
            >
              格式化
            </button>
            <button
              @click="minifyJson"
              class="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              压缩
            </button>
            <button
              @click="escapeJson"
              class="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors"
              title="将 JSON 转义为字符串"
            >
              转义
            </button>
            <button
              @click="unescapeJson"
              class="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors"
              title="将转义字符串还原为 JSON"
            >
              反转义
            </button>
            <button
              @click="clearInput"
              class="px-2 py-1 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              清空
            </button>
          </div>
        </div>

        <!-- 输入框 -->
        <textarea
          v-model="inputJson"
          placeholder="请输入或粘贴 JSON 字符串..."
          class="flex-1 w-full p-3 font-mono text-sm resize-none focus:outline-none bg-blue-50/30"
          spellcheck="false"
        />

        <!-- 底部状态栏 -->
        <div
          class="flex-shrink-0 flex items-center justify-between px-3 py-1 border-t border-gray-100 text-xs text-gray-400"
        >
          <span>{{ charCount }} 字符 · {{ lineCount }} 行</span>
          <span v-if="inputSizeWarning" class="text-amber-500">{{ inputSizeWarning }}</span>
        </div>
        <div
          v-if="errorMessage"
          class="flex-shrink-0 px-3 py-1 text-xs text-red-500 bg-red-50 border-t border-red-100"
        >
          {{ errorMessage }}
        </div>
      </div>

      <!-- 右侧输出区 -->
      <div class="flex flex-col bg-white min-h-0">
        <!-- 输出区操作栏 -->
        <div
          class="flex-shrink-0 flex items-center justify-between px-3 py-2 border-b border-gray-100"
        >
          <span class="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <span class="w-2 h-2 rounded-full bg-green-500"></span>
            预览结果
          </span>
          <div class="flex items-center gap-2">
            <!-- 展开深度：简洁下拉 -->
            <div class="flex items-center gap-1 text-xs text-gray-500">
              <span>展开</span>
              <select
                v-model.number="currentExpandDepth"
                class="text-xs border border-gray-200 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-400"
              >
                <option :value="0">折叠</option>
                <option :value="1">1 层</option>
                <option :value="2">2 层</option>
                <option :value="3">3 层</option>
                <option :value="5">5 层</option>
                <option :value="10">全部</option>
              </select>
            </div>
            <button
              @click="copyOutput"
              class="px-2 py-0.5 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors"
            >
              复制
            </button>
            <button
              @click="downloadJson"
              class="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              下载
            </button>
          </div>
        </div>

        <!-- 输出结果 -->
        <div class="flex-1 min-h-0 overflow-auto bg-white">
          <div v-if="parsedJson !== null" class="p-3">
            <json-viewer
              :key="currentExpandDepth"
              :value="parsedJson"
              :expand-depth="currentExpandDepth"
              copyable
              sort
            />
          </div>
          <div v-else class="flex flex-col items-center justify-center text-gray-400 gap-2 h-full">
            <svg
              class="w-10 h-10 opacity-40"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 7h18M3 12h18M3 17h18" />
            </svg>
            <span class="text-xs">等待输入有效的 JSON</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { downloader } from '@/utils/file'
import { ref, computed, watch, onUnmounted } from 'vue'
import JsonViewer from 'vue-json-viewer'
import 'vue-json-viewer/style.css'
import { useToast } from '@/composables/useToast'
import { debounce } from '@/utils/debounce'
import { toastCopy } from '@/utils/clipboard'
import { getCurrentDateTime } from '@/utils/date'
import { useJsonWorker } from '@/composables/useJsonWorker'

const toast = useToast()
const { parseJSON, terminate: terminateWorker } = useJsonWorker()
const inputJson = ref('')
const parsedJson = ref<unknown>(null)
const errorMessage = ref('')
const inputSizeWarning = ref('')

// 展开层级
const currentExpandDepth = ref(1)

const charCount = computed(() => inputJson.value.length)
const lineCount = computed(() => (inputJson.value ? inputJson.value.split('\n').length : 0))

watch(inputJson, (v) => {
  const len = v.length
  if (len > 5 * 1024 * 1024)
    inputSizeWarning.value = `${(len / 1024 / 1024).toFixed(1)}MB，解析可能较慢`
  else if (len > 1024 * 1024) inputSizeWarning.value = `${(len / 1024 / 1024).toFixed(1)}MB`
  else inputSizeWarning.value = ''
})

const getErrorMsg = (e: unknown) => `JSON 解析错误：${e instanceof Error ? e.message : '未知错误'}`

// 防抖解析 JSON
const parseJsonDebounced = debounce(async () => {
  if (!inputJson.value.trim()) {
    parsedJson.value = null
    errorMessage.value = ''
    return
  }
  try {
    parsedJson.value = await parseJSON(inputJson.value)
    errorMessage.value = ''
  } catch (e) {
    parsedJson.value = null
    errorMessage.value = getErrorMsg(e)
  }
}, 300)

watch(inputJson, () => parseJsonDebounced())

onUnmounted(() => {
  ;(parseJsonDebounced as unknown as { cancel: () => void }).cancel()
  terminateWorker()
})

// 格式化 / 压缩 / 转义 / 反转义 / 清空
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

const escapeJson = () => {
  try {
    if (!inputJson.value.trim()) return toast.error('请输入 JSON 字符串')
    // 先解析确保是有效 JSON，再转义
    const parsed = JSON.parse(inputJson.value)
    const formatted = JSON.stringify(parsed, null, 2)
    inputJson.value = JSON.stringify(formatted)
    toast.success('转义成功')
  } catch (e) {
    errorMessage.value = getErrorMsg(e)
    toast.error('转义失败：JSON 格式错误')
  }
}

const unescapeJson = () => {
  try {
    if (!inputJson.value.trim()) return toast.error('请输入字符串')
    // 尝试解析外层字符串
    const unescaped = JSON.parse(inputJson.value)
    if (typeof unescaped !== 'string') {
      toast.error('输入不是转义字符串')
      return
    }
    inputJson.value = unescaped
    toast.success('反转义成功')
  } catch (e) {
    errorMessage.value = getErrorMsg(e)
    toast.error('反转义失败')
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
  toastCopy(JSON.stringify(parsedJson.value, null, 2), 'JSON')
}

const downloadJson = () => {
  if (!parsedJson.value) return toast.error('没有可下载的内容')
  try {
    downloader.json(parsedJson.value, {
      filename: `formatted-${getCurrentDateTime()}.json`,
    })
    toast.success('下载成功')
  } catch {
    toast.error('下载失败')
  }
}
</script>

<style scoped>
textarea {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  line-height: 1.5;
  tab-size: 2;
}
</style>
