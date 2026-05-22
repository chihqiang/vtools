<template>
  <div class="bg-gray-50 rounded-xl border border-gray-200 p-6">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 左侧：共享 JSON 输入 -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-gray-800 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-blue-500"></span> 输入 JSON
          </h3>
          <div class="flex gap-2">
            <select
              v-model="outputFormat"
              @change="onFormatChange"
              class="text-sm border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="table">输出为表格</option>
              <option value="yml">输出为 YAML</option>
              <option value="xml">输出为 XML</option>
            </select>
            <button
              @click="clearAll"
              class="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
            >
              清空
            </button>
          </div>
        </div>
        <div class="border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
          <div class="overflow-y-auto" :style="{ maxHeight: containerHeight }">
            <textarea
              v-model="inputJson"
              @input="onInput"
              placeholder="请输入或粘贴 JSON..."
              class="w-full p-4 font-mono text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              :style="{ minHeight: containerHeight }"
              spellcheck="false"
            ></textarea>
          </div>
        </div>
        <div v-if="errorMessage" class="mt-2 text-sm text-red-500 flex items-center gap-2">
          ⚠ {{ errorMessage }}
        </div>
      </div>

      <!-- 右侧：根据格式切换输出 -->
      <div>
        <!-- 表格输出 -->
        <div v-if="outputFormat === 'table'">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-gray-800 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span> 表格结果
            </h3>
            <button
              @click="downloadCsv"
              :disabled="!tableData.length"
              class="px-3 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      v-for="(h, i) in tableHeaders"
                      :key="i"
                      class="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap"
                    >
                      {{ h }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, ri) in tableData" :key="ri" class="hover:bg-gray-50">
                    <td
                      v-for="(h, ci) in tableHeaders"
                      :key="ci"
                      class="px-4 py-2 text-gray-800 border-b border-gray-100 max-w-xs truncate"
                      :title="formatCell(row[h])"
                    >
                      {{ formatCell(row[h]) }}
                    </td>
                  </tr>
                </tbody>
              </table>
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
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 7h18M3 12h18M3 17h18"
                  />
                </svg>
                <span class="text-sm">{{
                  isParsing ? '解析中…' : '等待输入有效的 JSON 数组'
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- YAML 输出 -->
        <div v-else-if="outputFormat === 'yml'">
          <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
            <h3 class="font-semibold text-gray-800 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-green-500"></span> YAML 结果
            </h3>
            <div class="flex flex-wrap items-center gap-3">
              <div class="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-md">
                <label class="text-sm text-gray-600">缩进:</label>
                <input
                  type="number"
                  v-model.number="yamlIndent"
                  min="1"
                  max="8"
                  class="w-16 px-2 py-1 border rounded-md text-sm"
                />
              </div>
              <div class="flex gap-2">
                <button
                  @click="copyYaml"
                  class="px-3 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                >
                  复制
                </button>
                <button
                  @click="downloadYaml"
                  class="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                >
                  下载
                </button>
              </div>
            </div>
          </div>
          <div class="border border-gray-300 rounded-lg overflow-hidden bg-white">
            <div class="overflow-y-auto bg-gray-50" :style="{ height: containerHeight }">
              <pre v-if="yamlOutput" class="p-4 font-mono text-sm whitespace-pre-wrap">{{
                yamlOutput
              }}</pre>
              <div v-else class="flex items-center justify-center h-full text-gray-400">
                等待转换为 YAML
              </div>
            </div>
          </div>
        </div>

        <!-- XML 输出 -->
        <div v-else>
          <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
            <h3 class="font-semibold text-gray-800 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-amber-500"></span> XML 结果
            </h3>
            <div class="flex flex-wrap items-center gap-3">
              <div class="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-md">
                <label class="text-sm text-gray-600">根节点:</label>
                <input
                  v-model="xmlRootName"
                  type="text"
                  class="w-20 px-2 py-1 border rounded-md text-sm"
                />
              </div>
              <div class="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-md">
                <label class="text-sm text-gray-600">缩进:</label>
                <input
                  type="number"
                  v-model.number="xmlIndent"
                  min="1"
                  max="8"
                  class="w-16 px-2 py-1 border rounded-md text-sm"
                />
              </div>
              <div class="flex gap-2">
                <button
                  @click="copyXml"
                  class="px-3 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                >
                  复制
                </button>
                <button
                  @click="downloadXml"
                  class="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                >
                  下载
                </button>
              </div>
            </div>
          </div>
          <div class="border border-gray-300 rounded-lg overflow-hidden bg-white">
            <div class="overflow-y-auto bg-gray-50" :style="{ height: containerHeight }">
              <pre v-if="xmlOutput" class="p-4 font-mono text-sm whitespace-pre-wrap">{{
                xmlOutput
              }}</pre>
              <div v-else class="flex items-center justify-center h-full text-gray-400">
                等待转换为 XML
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { downloader } from '@/utils/file'
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as YAML from 'yaml'
import { XMLBuilder } from 'fast-xml-parser'
import { useToast } from '@/composables/useToast'
import { debounce } from '@/utils/debounce'
import { toastCopy } from '@/utils/clipboard'
import { getCurrentDateTime } from '@/utils/times'

const toast = useToast()
const route = useRoute()
const router = useRouter()

/* ================= 格式切换 ================= */
const outputFormat = ref<'table' | 'yml' | 'xml'>('table')

watch(
  () => route.query.mode,
  (mode) => {
    if (mode === 'yml' || mode === 'table' || mode === 'xml') outputFormat.value = mode
  },
  { immediate: true },
)

const onFormatChange = () => {
  router.replace({ query: { ...route.query, mode: outputFormat.value } })
}

/* ================= 高度计算 ================= */
const containerHeight = ref('400px')

const calcHeight = () => {
  containerHeight.value = `${Math.max(360, window.innerHeight - 260)}px`
}

onMounted(() => {
  calcHeight()
  window.addEventListener('resize', calcHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', calcHeight)
})

/* ================= 共享 JSON 输入 ================= */
const inputJson = ref('')
const errorMessage = ref('')
const isParsing = ref(false)

const clearAll = () => {
  inputJson.value = ''
  errorMessage.value = ''
  tableData.value = []
  tableHeaders.value = []
  yamlOutput.value = ''
  xmlOutput.value = ''
  toast.success('已清空')
}

/* ================ 表格输出 ================ */
const tableHeaders = ref<string[]>([])
const tableData = ref<Record<string, unknown>[]>([])

const formatCell = (value: unknown, isCsv = false): string => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'object') {
    const s = JSON.stringify(value)
    return isCsv ? s.replace(/\n/g, '\\n') : s
  }
  return String(value)
}

const parseAsTable = () => {
  try {
    if (!inputJson.value.trim()) {
      tableData.value = []
      tableHeaders.value = []
      errorMessage.value = ''
      return
    }
    const parsed = JSON.parse(inputJson.value)
    if (!Array.isArray(parsed)) throw new Error('JSON 必须是一个数组')
    if (!parsed.length) {
      tableHeaders.value = []
      tableData.value = []
      errorMessage.value = ''
      return
    }
    const headers = new Set<string>()
    parsed.forEach((item: unknown) => {
      if (item && typeof item === 'object')
        Object.keys(item as Record<string, unknown>).forEach((k) => headers.add(k))
    })
    tableHeaders.value = Array.from(headers)
    tableData.value = parsed.map((item: Record<string, unknown>) => {
      const row: Record<string, unknown> = {}
      tableHeaders.value.forEach((h) => (row[h] = item[h] ?? ''))
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

const parseAsYaml = () => {
  try {
    if (!inputJson.value.trim()) {
      yamlOutput.value = ''
      errorMessage.value = ''
      return
    }
    const parsed = JSON.parse(inputJson.value)
    yamlOutput.value = YAML.stringify(parsed, { indent: yamlIndent.value })
    errorMessage.value = ''
  } catch (e) {
    yamlOutput.value = ''
    errorMessage.value = `解析失败：${e instanceof Error ? e.message : '未知错误'}`
  }
}

const copyYaml = () => {
  if (yamlOutput.value) toastCopy(yamlOutput.value)
}

const downloadYaml = () => {
  if (!yamlOutput.value) return
  downloader.text(yamlOutput.value, {
    filename: `data-${getCurrentDateTime()}.yaml`,
    mimeType: 'text/plain;charset=utf-8',
  })
  toast.success('下载成功')
}

/* ================ XML 输出 ================ */
const xmlOutput = ref('')
const xmlRootName = ref('root')
const xmlIndent = ref(2)

const parseAsXml = () => {
  try {
    if (!inputJson.value.trim()) {
      xmlOutput.value = ''
      errorMessage.value = ''
      return
    }
    const parsed = JSON.parse(inputJson.value)
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

const copyXml = () => {
  if (xmlOutput.value) toastCopy(xmlOutput.value)
}

const downloadXml = () => {
  if (!xmlOutput.value) return
  downloader.text(xmlOutput.value, {
    filename: `data-${getCurrentDateTime()}.xml`,
    mimeType: 'text/plain;charset=utf-8',
  })
  toast.success('下载成功')
}

/* ================= 输入处理 ================= */
const debouncedParse = debounce(() => {
  isParsing.value = true
  errorMessage.value = ''
  if (outputFormat.value === 'table') parseAsTable()
  else if (outputFormat.value === 'yml') parseAsYaml()
  else parseAsXml()
  isParsing.value = false
}, 300)

const onInput = () => debouncedParse()

watch([outputFormat, yamlIndent, xmlIndent, xmlRootName], () => {
  if (inputJson.value.trim()) {
    isParsing.value = true
    if (outputFormat.value === 'table') parseAsTable()
    else if (outputFormat.value === 'yml') parseAsYaml()
    else parseAsXml()
    isParsing.value = false
  }
})
</script>

<style scoped>
textarea {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  line-height: 1.6;
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
