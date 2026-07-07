<template>
  <div
    class="flex flex-col flex-1 min-h-0 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden"
  >
    <!-- Toolbar with tabs -->
    <div
      class="flex-shrink-0 flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200"
    >
      <!-- Tab 切换 -->
      <div class="flex items-center bg-gray-100 rounded-lg">
        <button
          v-for="fmt in formats"
          :key="fmt.value"
          @click="outputFormat = fmt.value"
          :class="[
            'px-3 py-1 text-xs rounded-md transition-colors',
            outputFormat === fmt.value
              ? 'bg-white text-blue-600 shadow-sm font-medium'
              : 'text-gray-500 hover:text-gray-700',
          ]"
        >
          {{ fmt.label }}
        </button>
      </div>

      <div class="flex items-center gap-2">
        <!-- 格式相关选项（动态显示） -->
        <div v-if="outputFormat === 'yml'" class="flex items-center gap-1 text-xs text-gray-500">
          <span>缩进</span>
          <input
            v-model.number="yamlIndent"
            type="number"
            min="1"
            max="8"
            class="w-12 px-1 py-0.5 border border-gray-200 rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>
        <template v-if="outputFormat === 'xml'">
          <div class="flex items-center gap-1 text-xs text-gray-500">
            <span>根节点</span>
            <input
              v-model="xmlRootName"
              type="text"
              class="w-16 px-1 py-0.5 border border-gray-200 rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <div class="flex items-center gap-1 text-xs text-gray-500">
            <span>缩进</span>
            <input
              v-model.number="xmlIndent"
              type="number"
              min="1"
              max="8"
              class="w-12 px-1 py-0.5 border border-gray-200 rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
        </template>
        <button
          @click="clearAll"
          class="px-2.5 py-1 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
        >
          清空
        </button>
      </div>
    </div>

    <!-- 主内容区：左右双栏 -->
    <div class="flex-1 min-h-0 grid grid-cols-2" style="gap: 1px; background: #e5e7eb">
      <!-- 左侧：JSON 输入 -->
      <div class="flex flex-col bg-white min-h-0">
        <div
          class="flex items-center justify-between px-3 py-2 border-b border-gray-100 flex-shrink-0"
        >
          <span class="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <span class="w-2 h-2 rounded-full bg-blue-500"></span>
            输入 JSON
          </span>
          <span v-if="inputSizeWarning" class="text-xs text-amber-500">{{ inputSizeWarning }}</span>
        </div>
        <textarea
          v-model="inputJson"
          placeholder="请输入或粘贴 JSON..."
          class="flex-1 w-full p-3 font-mono text-sm resize-none focus:outline-none bg-blue-50/30"
          spellcheck="false"
        />
        <div
          v-if="errorMessage"
          class="px-3 py-1 text-xs text-red-500 bg-red-50 border-t border-red-100 flex-shrink-0"
        >
          {{ errorMessage }}
        </div>
      </div>

      <!-- 右侧：输出结果 -->
      <div class="flex flex-col bg-white min-h-0">
        <!-- 表格输出 -->
        <template v-if="outputFormat === 'table'">
          <div
            class="flex items-center justify-between px-3 py-1 border-b border-gray-100 flex-shrink-0"
          >
            <span class="text-xs font-medium text-gray-500"
              >表格结果 ({{ tableData.length }} 行)</span
            >
            <div class="flex items-center gap-2">
              <button
                v-if="tableData.length"
                @click="downloadCsv"
                class="text-xs text-gray-500 hover:text-blue-600 transition-colors"
              >
                下载 CSV
              </button>
            </div>
          </div>
          <div class="flex-1 min-h-0 overflow-auto">
            <table v-if="paginatedData.length" class="w-full border-collapse text-xs">
              <thead class="sticky top-0 z-10 bg-gray-100 border-b border-gray-300">
                <tr>
                  <th class="w-10 px-2 py-1.5 text-left font-semibold text-gray-600">#</th>
                  <th
                    v-for="(h, i) in tableHeaders"
                    :key="i"
                    class="px-3 py-1.5 text-left font-semibold text-gray-600 border-l border-gray-200 whitespace-nowrap"
                  >
                    {{ h }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, ri) in paginatedData"
                  :key="tablePageStart + ri"
                  class="border-b border-gray-50 hover:bg-blue-50/30"
                >
                  <td class="px-2 py-1 text-gray-400">{{ tablePageStart + ri + 1 }}</td>
                  <td
                    v-for="(h, ci) in tableHeaders"
                    :key="ci"
                    class="px-3 py-1 text-gray-800 border-l border-gray-100 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap"
                    :title="formatCell(row[h])"
                  >
                    {{ formatCell(row[h]) }}
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- 分页 -->
            <div
              v-if="tableData.length > tablePageSize"
              class="flex items-center justify-between px-3 py-1.5 border-t border-gray-200 bg-gray-50 text-xs text-gray-600 sticky bottom-0"
            >
              <span>共 {{ tableData.length }} 行</span>
              <div class="flex items-center gap-1">
                <button
                  @click="tablePage--"
                  :disabled="tablePage <= 1"
                  class="px-2 py-0.5 rounded border border-gray-300 bg-white disabled:opacity-40 hover:bg-gray-100"
                >
                  ‹
                </button>
                <span class="px-1">{{ tablePage }} / {{ totalPages }}</span>
                <button
                  @click="tablePage++"
                  :disabled="tablePage >= totalPages"
                  class="px-2 py-0.5 rounded border border-gray-300 bg-white disabled:opacity-40 hover:bg-gray-100"
                >
                  ›
                </button>
              </div>
            </div>
            <!-- 空状态 -->
            <div
              v-if="!tableData.length"
              class="flex items-center justify-center h-full text-gray-400 text-sm"
            >
              <div class="text-center">
                <svg
                  class="w-10 h-10 mx-auto mb-2 opacity-30"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M3 7h18M3 12h18M3 17h18"
                  />
                </svg>
                <p>{{ isParsing ? '解析中...' : '等待输入 JSON 数组' }}</p>
              </div>
            </div>
          </div>
        </template>

        <!-- YAML / XML 输出 -->
        <template v-else>
          <div
            class="flex items-center justify-between px-3 py-1 border-b border-gray-100 flex-shrink-0"
          >
            <span class="text-xs font-medium text-gray-500"
              >{{ outputFormat === 'yml' ? 'YAML' : 'XML' }} 结果</span
            >
            <div class="flex items-center gap-2">
              <button
                v-if="currentOutput"
                @click="copyOutput"
                class="text-xs text-gray-500 hover:text-blue-600 transition-colors"
              >
                复制
              </button>
              <button
                v-if="currentOutput"
                @click="downloadOutput"
                class="text-xs text-gray-500 hover:text-blue-600 transition-colors"
              >
                下载
              </button>
            </div>
          </div>
          <div class="flex-1 min-h-0 overflow-auto bg-gray-50">
            <pre
              v-if="currentOutput"
              class="p-3 font-mono text-xs whitespace-pre-wrap break-all leading-relaxed"
              >{{ currentOutput }}</pre
            >
            <div v-else class="flex items-center justify-center h-full text-gray-400 text-sm">
              {{
                isParsing ? '解析中...' : `等待转换为 ${outputFormat === 'yml' ? 'YAML' : 'XML'}`
              }}
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { downloader } from '@/utils/file'
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as YAML from 'yaml'
import { XMLBuilder } from 'fast-xml-parser'
import { useToast } from '@/composables/useToast'
import { debounce } from '@/utils/debounce'
import { toastCopy } from '@/utils/clipboard'
import { getCurrentDateTime } from '@/utils/date'
import { useJsonWorker } from '@/composables/useJsonWorker'

const toast = useToast()
const route = useRoute()
const router = useRouter()
const { parseJSON, terminate: terminateWorker } = useJsonWorker()

/* ================= 格式切换 ================= */
type OutputFormat = 'table' | 'yml' | 'xml'
const formats: { label: string; value: OutputFormat }[] = [
  { label: '表格', value: 'table' },
  { label: 'YAML', value: 'yml' },
  { label: 'XML', value: 'xml' },
]
const outputFormat = ref<OutputFormat>('table')

watch(
  () => route.query.mode,
  (mode) => {
    if (mode === 'yml' || mode === 'table' || mode === 'xml') outputFormat.value = mode
  },
  { immediate: true },
)

watch(outputFormat, (val) => {
  router.replace({ query: { ...route.query, mode: val } })
})

/* ================= 共享 JSON 输入 ================= */
const inputJson = ref('')
const errorMessage = ref('')
const isParsing = ref(false)
const inputSizeWarning = ref('')

watch(inputJson, (v) => {
  const len = v.length
  if (len > 5 * 1024 * 1024) inputSizeWarning.value = `${(len / 1024 / 1024).toFixed(1)}MB`
  else if (len > 1024 * 1024) inputSizeWarning.value = `${(len / 1024 / 1024).toFixed(1)}MB`
  else inputSizeWarning.value = ''
})

const clearAll = () => {
  inputJson.value = ''
  errorMessage.value = ''
  tableData.value = []
  tableHeaders.value = []
  tablePage.value = 1
  yamlOutput.value = ''
  xmlOutput.value = ''
  toast.success('已清空')
}

/* ================ 表格输出 ================ */
const tableHeaders = ref<string[]>([])
const tableData = ref<Record<string, unknown>[]>([])
const tablePage = ref(1)
const tablePageSize = 100

const totalPages = computed(() => Math.max(1, Math.ceil(tableData.value.length / tablePageSize)))
const tablePageStart = computed(() => (tablePage.value - 1) * tablePageSize)
const paginatedData = computed(() =>
  tableData.value.slice(tablePageStart.value, tablePageStart.value + tablePageSize),
)

watch(tableData, () => {
  tablePage.value = 1
})

const formatCell = (value: unknown, isCsv = false): string => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'object') {
    const s = JSON.stringify(value)
    return isCsv ? s.replace(/\n/g, '\\n') : s
  }
  return String(value)
}

const parseAsTable = async () => {
  try {
    if (!inputJson.value.trim()) {
      tableData.value = []
      tableHeaders.value = []
      errorMessage.value = ''
      return
    }
    const parsed = await parseJSON(inputJson.value)
    if (!Array.isArray(parsed)) throw new Error('JSON 必须是一个数组')
    if (!parsed.length) {
      tableHeaders.value = []
      tableData.value = []
      errorMessage.value = ''
      return
    }
    const headers = new Set<string>()
    for (const item of parsed as Record<string, unknown>[]) {
      if (item && typeof item === 'object') Object.keys(item).forEach((k) => headers.add(k))
    }
    tableHeaders.value = Array.from(headers)
    tableData.value = (parsed as Record<string, unknown>[]).map((item) => {
      const row: Record<string, unknown> = {}
      for (const h of tableHeaders.value) row[h] = item[h] ?? ''
      return row
    })
    errorMessage.value = ''
  } catch (e) {
    tableData.value = []
    tableHeaders.value = []
    errorMessage.value = `解析失败：${e instanceof Error ? e.message : '未知错误'}`
  }
}

const downloadCsv = () => {
  if (!tableData.value.length) return
  let csv = '\uFEFF'
  csv += tableHeaders.value.map((h) => `"${h.replace(/"/g, '""')}"`).join(',') + '\n'
  tableData.value.forEach((row) => {
    csv +=
      tableHeaders.value
        .map((h) => {
          const v = formatCell(row[h], true)
          return v.includes(',') || v.includes('"') || v.includes('\n')
            ? `"${v.replace(/"/g, '""')}"`
            : v
        })
        .join(',') + '\n'
  })
  downloader.text(csv, {
    filename: `table-${getCurrentDateTime()}.csv`,
    mimeType: 'text/csv;charset=utf-8;',
  })
  toast.success('CSV 下载成功')
}

/* ================ YAML 输出 ================ */
const yamlOutput = ref('')
const yamlIndent = ref(2)

const parseAsYaml = async () => {
  try {
    if (!inputJson.value.trim()) {
      yamlOutput.value = ''
      errorMessage.value = ''
      return
    }
    const parsed = await parseJSON(inputJson.value)
    yamlOutput.value = YAML.stringify(parsed, { indent: yamlIndent.value })
    errorMessage.value = ''
  } catch (e) {
    yamlOutput.value = ''
    errorMessage.value = `解析失败：${e instanceof Error ? e.message : '未知错误'}`
  }
}

/* ================ XML 输出 ================ */
const xmlOutput = ref('')
const xmlRootName = ref('root')
const xmlIndent = ref(2)

const parseAsXml = async () => {
  try {
    if (!inputJson.value.trim()) {
      xmlOutput.value = ''
      errorMessage.value = ''
      return
    }
    const parsed = await parseJSON(inputJson.value)
    const builder = new XMLBuilder({
      format: true,
      indentBy: ' '.repeat(xmlIndent.value),
      ignoreAttributes: true,
      suppressEmptyNode: true,
    })
    xmlOutput.value = builder.build({ [xmlRootName.value]: parsed })
    errorMessage.value = ''
  } catch (e) {
    xmlOutput.value = ''
    errorMessage.value = `解析失败：${e instanceof Error ? e.message : '未知错误'}`
  }
}

/* ================ 统一输出 ================ */
const currentOutput = computed(() => {
  if (outputFormat.value === 'yml') return yamlOutput.value
  if (outputFormat.value === 'xml') return xmlOutput.value
  return ''
})

const copyOutput = () => {
  if (currentOutput.value) toastCopy(currentOutput.value)
}

const downloadOutput = () => {
  if (!currentOutput.value) return
  const ext = outputFormat.value === 'yml' ? 'yaml' : 'xml'
  downloader.text(currentOutput.value, {
    filename: `data-${getCurrentDateTime()}.${ext}`,
    mimeType: 'text/plain;charset=utf-8',
  })
  toast.success('下载成功')
}

/* ================= 输入处理 ================= */
const debouncedParse = debounce(async () => {
  errorMessage.value = ''
  isParsing.value = true
  try {
    if (outputFormat.value === 'table') await parseAsTable()
    else if (outputFormat.value === 'yml') await parseAsYaml()
    else await parseAsXml()
  } finally {
    isParsing.value = false
  }
}, 300)

watch(inputJson, () => debouncedParse())

watch([outputFormat, yamlIndent, xmlIndent, xmlRootName], async () => {
  if (inputJson.value.trim()) {
    errorMessage.value = ''
    isParsing.value = true
    try {
      if (outputFormat.value === 'table') await parseAsTable()
      else if (outputFormat.value === 'yml') await parseAsYaml()
      else await parseAsXml()
    } finally {
      isParsing.value = false
    }
  }
})

onMounted(() => {
  // 组件挂载时不需要计算高度，使用 flex 布局自动填充
})

onUnmounted(() => {
  terminateWorker()
})
</script>

<style scoped>
textarea {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  line-height: 1.5;
  tab-size: 2;
}

td {
  vertical-align: top;
}

pre {
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
