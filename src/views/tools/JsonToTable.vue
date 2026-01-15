<template>
  <div class="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
    <!-- 核心内容区域 - 使用固定最大高度确保可预测的布局 -->
    <div class="mb-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- JSON 输入区 -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-gray-700">输入 JSON</h3>
            <div class="flex space-x-2">
              <button
                @click="clearInput"
                class="px-3 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-all duration-150 shadow-sm hover:shadow"
              >
                清空
              </button>
            </div>
          </div>
          <!-- 固定高度的JSON输入框 -->
          <div class="border border-gray-300 rounded-lg bg-white overflow-hidden">
            <!-- 滚动容器 -->
            <div class="max-h-[400px] overflow-y-auto">
              <textarea
                v-model="inputJson"
                @input="handleInput"
                placeholder="请输入 JSON 字符串..."
                class="w-full p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-150 min-h-[400px]"
                spellcheck="false"
              ></textarea>
            </div>
          </div>
          <div v-if="errorMessage" class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {{ errorMessage }}
          </div>
        </div>

        <!-- 表格输出区 -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-gray-700">表格</h3>
            <div class="flex space-x-2">
              <button
                @click="downloadCsv"
                :disabled="!tableData.length"
                class="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-all duration-150 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm"
              >
                下载 CSV ({{ tableData.length }} 条)
              </button>
            </div>
          </div>
          <!-- 固定高度的表格区域 -->
          <div class="border border-gray-300 rounded-lg bg-white overflow-hidden">
            <!-- 滚动容器 -->
            <div class="max-h-[400px] overflow-y-auto">
              <table v-if="tableData.length" class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-100">
                  <tr>
                    <th v-for="(header, index) in tableHeaders" :key="index" class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 sticky top-0 z-10">
                      {{ header }}
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(row, rowIndex) in tableData" :key="rowIndex" class="hover:bg-gray-50 transition-colors duration-150">
                    <td v-for="(header, colIndex) in tableHeaders" :key="colIndex" class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 border-b border-gray-100">
                      {{ formatCell(row[header]) }}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-else class="flex items-center justify-center min-h-[400px] text-gray-400">
                <span v-if="isParsing">解析中...</span>
                <span v-else>等待输入有效的 JSON 数组...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/composables/useToast'

const toast = useToast()

const inputJson = ref('')
const parsedJson = ref<Record<string, unknown>[]>([])
const tableHeaders = ref<string[]>([])
const tableData = ref<Record<string, unknown>[]>([])
const errorMessage = ref('')
const isParsing = ref(false)

const handleInput = () => {
  try {
    if (!inputJson.value.trim()) {
      parsedJson.value = []
      tableHeaders.value = []
      tableData.value = []
      errorMessage.value = ''
      return
    }

    const parsed = JSON.parse(inputJson.value)

    if (!Array.isArray(parsed)) {
      errorMessage.value = 'JSON 必须是一个数组'
      parsedJson.value = []
      tableHeaders.value = []
      tableData.value = []
      return
    }

    parsedJson.value = parsed

    if (parsed.length === 0) {
      tableHeaders.value = []
      tableData.value = []
      errorMessage.value = ''
      return
    }

    // 获取所有唯一的键作为表头
    const headers = new Set<string>()
    parsed.forEach(item => {
      if (typeof item === 'object' && item !== null) {
        Object.keys(item).forEach(key => headers.add(key))
      }
    })
    tableHeaders.value = Array.from(headers)

    // 转换数据格式
    tableData.value = parsed.map(item => {
      const row: Record<string, unknown> = {}
      tableHeaders.value.forEach(header => {
        row[header] = item[header] !== undefined ? item[header] : ''
      })
      return row
    })

    errorMessage.value = ''
  } catch (error) {
    parsedJson.value = []
    tableHeaders.value = []
    tableData.value = []
    errorMessage.value = `JSON 解析错误: ${error instanceof Error ? error.message : '未知错误'}`
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
  if (value === null || value === undefined) {
    return ''
  }
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  return String(value)
}

const downloadCsv = () => {
  if (!tableData.value || !tableData.value.length) {
    toast.error('没有可下载的内容')
    return
  }

  try {
    // 生成 CSV 内容
    let csvContent = ''

    // 添加 UTF-8 BOM，确保Excel正确识别中文
    csvContent += '\uFEFF'

    // 添加表头
    const headers = tableHeaders.value.map(header => {
      return `"${header.replace(/"/g, '""')}"`
    })
    csvContent += headers.join(',') + '\n'

    // 添加数据行
    tableData.value.forEach(row => {
      const rowValues = tableHeaders.value.map(header => {
        const value = row[header]
        let formattedValue = formatCell(value)

        // 处理包含逗号、双引号或换行符的内容
        if (typeof formattedValue === 'string' && (formattedValue.includes(',') || formattedValue.includes('"') || formattedValue.includes('\n'))) {
          formattedValue = `"${formattedValue.replace(/"/g, '""')}"`
        }
        return formattedValue
      })
      csvContent += rowValues.join(',') + '\n'
    })

    // 创建 Blob 对象
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'vtools-json-to-table.csv'

    // 确保链接在文档中
    link.style.display = 'none'
    document.body.appendChild(link)

    // 触发点击事件
    link.click()

    // 清理
    setTimeout(() => {
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }, 100)

    toast.success('CSV 文件下载成功')
  } catch (error) {
    console.error('CSV 下载错误:', error)
    toast.error('CSV 文件下载失败')
  }
}
</script>

<style scoped>
textarea {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
}

table {
  border-collapse: collapse;
}

th {
  border-bottom: 2px solid #e2e8f0;
}

td {
  border-bottom: 1px solid #e2e8f0;
}
</style>
