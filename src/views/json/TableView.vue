<template>
  <div class="bg-gray-50 rounded-xl border border-gray-200 p-6">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- JSON 输入区 -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-gray-800 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-blue-500"></span>
            输入 JSON
          </h3>

          <button
            @click="clearInput"
            class="px-3 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition"
          >
            清空
          </button>
        </div>

        <div class="border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
          <div class="overflow-y-auto" :style="{ maxHeight: containerHeight }">
            <textarea
              v-model="inputJson"
              @input="handleInput"
              placeholder="请输入 JSON 数组"
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

      <!-- 表格输出区 -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-gray-800 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            表格结果
          </h3>

          <button
            @click="downloadCsv"
            :disabled="!tableData.length"
            class="px-3 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下载 CSV（{{ tableData.length }}）
          </button>
        </div>

        <div class="border border-gray-300 rounded-lg overflow-hidden bg-white">
          <div class="overflow-y-auto" :style="{ maxHeight: containerHeight }">
            <table v-if="tableData.length" class="min-w-full text-sm border-collapse">
              <thead class="sticky top-0 z-10 bg-gray-100 border-b border-gray-300">
                <tr>
                  <th
                    v-for="(header, index) in tableHeaders"
                    :key="index"
                    class="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap"
                  >
                    {{ header }}
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(row, rowIndex) in tableData"
                  :key="rowIndex"
                  class="hover:bg-gray-50 transition"
                >
                  <td
                    v-for="(header, colIndex) in tableHeaders"
                    :key="colIndex"
                    class="px-4 py-2 text-gray-800 border-b border-gray-100 max-w-xs truncate"
                    :title="formatCell(row[header])"
                  >
                    {{ formatCell(row[header]) }}
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- 空状态 -->
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
              <span class="text-sm">
                {{ isParsing ? '解析中…' : '等待输入有效的 JSON 数组' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useToast } from '@/composables/useToast'

const toast = useToast()

const inputJson = ref('')
const parsedJson = ref<Record<string, unknown>[]>([])
const tableHeaders = ref<string[]>([])
const tableData = ref<Record<string, unknown>[]>([])
const errorMessage = ref('')
const isParsing = ref(false)
const containerHeight = ref('500px')

const calculateHeight = () => {
  const windowHeight = window.innerHeight
  const baseOffset = 260
  containerHeight.value = `${Math.max(420, windowHeight - baseOffset)}px`
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
      parsedJson.value = []
      tableHeaders.value = []
      tableData.value = []
      errorMessage.value = ''
      return
    }

    isParsing.value = true
    const parsed = JSON.parse(inputJson.value)

    if (!Array.isArray(parsed)) {
      throw new Error('JSON 必须是一个数组')
    }

    parsedJson.value = parsed

    if (!parsed.length) {
      tableHeaders.value = []
      tableData.value = []
      errorMessage.value = ''
      return
    }

    const headers = new Set<string>()
    parsed.forEach((item) => {
      if (item && typeof item === 'object') {
        Object.keys(item).forEach((k) => headers.add(k))
      }
    })

    tableHeaders.value = Array.from(headers)

    tableData.value = parsed.map((item) => {
      const row: Record<string, unknown> = {}
      tableHeaders.value.forEach((h) => (row[h] = item[h] ?? ''))
      return row
    })

    errorMessage.value = ''
  } catch (e) {
    parsedJson.value = []
    tableHeaders.value = []
    tableData.value = []
    errorMessage.value = `解析失败：${e instanceof Error ? e.message : '未知错误'}`
  } finally {
    isParsing.value = false
  }
}

const clearInput = () => {
  inputJson.value = ''
  parsedJson.value = []
  tableHeaders.value = []
  tableData.value = []
  errorMessage.value = ''
  toast.success('已清空')
}

const formatCell = (value: unknown): string => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

const downloadCsv = () => {
  if (!tableData.value.length) return

  let csv = '\uFEFF'
  csv += tableHeaders.value.map((h) => `"${h.replace(/"/g, '""')}"`).join(',') + '\n'

  tableData.value.forEach((row) => {
    csv +=
      tableHeaders.value
        .map((h) => {
          const v = formatCell(row[h])
          return v.includes(',') || v.includes('"') || v.includes('\n')
            ? `"${v.replace(/"/g, '""')}"`
            : v
        })
        .join(',') + '\n'
  })

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'json-to-table.csv'
  a.click()
  URL.revokeObjectURL(url)

  toast.success('CSV 下载成功')
}
</script>

<style scoped>
textarea {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  line-height: 1.6;
  tab-size: 2;
}

td {
  vertical-align: top;
}
</style>
