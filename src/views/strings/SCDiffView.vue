<template>
  <div class="bg-white rounded-xl shadow-md p-6 h-full">
    <!-- Header -->
    <div class="mb-6 border border-gray-200 rounded-lg p-4">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">数据对比工具</h2>
          <p class="text-sm text-gray-500 mt-1">比较原始数据与对比数据的差异，支持逐行比对</p>
        </div>
        <button
          @click="clearAll"
          class="px-4 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors w-fit"
        >
          清空全部
        </button>
      </div>
    </div>

    <!-- 输入区 -->
    <div class="border border-gray-200 rounded-lg p-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 原始数据 -->
        <div class="flex flex-col">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-semibold text-gray-700">原始数据</h3>
            <div class="flex gap-2">
              <button
                @click="clearColumn1"
                class="px-3 py-1 text-xs rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                清空
              </button>
              <button
                @click="pasteColumn1"
                class="px-3 py-1 text-xs rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                粘贴
              </button>
            </div>
          </div>
          <textarea
            v-model="column1"
            placeholder="请输入原始数据，每行一个..."
            class="w-full min-h-[300px] p-4 rounded-lg border border-gray-300 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div class="mt-2 text-xs text-gray-500">共 {{ column1Rows.length }} 行</div>
        </div>

        <!-- 对比数据 -->
        <div class="flex flex-col">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-semibold text-gray-700">对比数据</h3>
            <div class="flex gap-2">
              <button
                @click="clearColumn2"
                class="px-3 py-1 text-xs rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                清空
              </button>
              <button
                @click="pasteColumn2"
                class="px-3 py-1 text-xs rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                粘贴
              </button>
            </div>
          </div>
          <textarea
            v-model="column2"
            placeholder="请输入对比数据，每行一个..."
            class="w-full min-h-[300px] p-4 rounded-lg border border-gray-300 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div class="mt-2 text-xs text-gray-500">共 {{ column2Rows.length }} 行</div>
        </div>
      </div>
    </div>

    <!-- 结果区 -->
    <div v-if="diffResult.length > 0" class="mt-4 border rounded-lg bg-gray-50 p-4">
      <!-- 统计和状态过滤 -->
      <div class="mb-4 flex flex-wrap gap-4 items-center">
        <div class="flex flex-wrap gap-4 text-sm">
          <span class="text-red-600 font-semibold"
            >仅在原始数据中存在: {{ stats.onlyInColumn1 }}</span
          >
          <span class="text-green-600 font-semibold"
            >仅在对比数据中存在: {{ stats.onlyInColumn2 }}</span
          >
          <span class="text-blue-600 font-semibold">两者都存在: {{ stats.inBoth }}</span>
        </div>
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium text-gray-700">状态过滤:</label>
          <select
            v-model="selectedStatus"
            class="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全部</option>
            <option value="only-in-column1">仅在原始数据中存在</option>
            <option value="only-in-column2">仅在对比数据中存在</option>
            <option value="in-both">两者都存在</option>
          </select>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="isProcessing" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <!-- 差异结果表格 -->
      <div v-else class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th
                class="border border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-700"
              >
                行号
              </th>
              <th
                class="border border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-700"
              >
                原始数据
              </th>
              <th
                class="border border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-700"
              >
                对比数据
              </th>
              <th
                class="border border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-700"
              >
                状态
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in filteredResult"
              :key="index"
              :class="{
                'bg-red-50': row.status === 'only-in-column1',
                'bg-green-50': row.status === 'only-in-column2',
                'bg-blue-50': row.status === 'in-both',
              }"
            >
              <td class="border border-gray-200 px-4 py-2 text-sm">{{ row.rowNumber }}</td>
              <td class="border border-gray-200 px-4 py-2 text-sm font-mono">
                {{ row.column1 || '-' }}
              </td>
              <td class="border border-gray-200 px-4 py-2 text-sm font-mono">
                {{ row.column2 || '-' }}
              </td>
              <td class="border border-gray-200 px-4 py-2 text-sm">
                <span
                  :class="{
                    'text-red-600 font-semibold': row.status === 'only-in-column1',
                    'text-green-600 font-semibold': row.status === 'only-in-column2',
                    'text-blue-600 font-semibold': row.status === 'in-both',
                  }"
                >
                  {{ row.statusText }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 复制按钮 -->
      <div v-if="!isProcessing" class="mt-4 flex gap-2">
        <button
          @click="copyOnlyInColumn1"
          class="px-3 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
        >
          复制仅在原始数据中的数据
        </button>
        <button
          @click="copyOnlyInColumn2"
          class="px-3 py-1 text-xs rounded bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
        >
          复制仅在对比数据中的数据
        </button>
        <button
          @click="copyInBoth"
          class="px-3 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
        >
          复制两者都存在的数据
        </button>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!isProcessing" class="mt-4 border rounded-lg bg-gray-50 p-8 text-center">
      <p class="text-gray-500">请输入数据进行比较</p>
    </div>

    <!-- 加载状态 -->
    <div v-else class="mt-4 border rounded-lg bg-gray-50 p-8 flex justify-center items-center">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useToast } from '@/composables/useToast'
import { toastCopy } from '@/utils/clipboard'
import { useDebounce } from '@/composables/useDebounce'

const toast = useToast()

const column1 = ref('')
const column2 = ref('')
const isProcessing = ref(false)
const selectedStatus = ref<string>('all') // all, only-in-column1, only-in-column2, in-both

const column1Rows = computed(() => {
  return column1.value
    .split('\n')
    .map((row) => row.trim())
    .filter((row) => row !== '')
})

const column2Rows = computed(() => {
  return column2.value
    .split('\n')
    .map((row) => row.trim())
    .filter((row) => row !== '')
})

interface DiffRow {
  rowNumber: number
  column1: string
  column2: string
  status: 'only-in-column1' | 'only-in-column2' | 'in-both'
  statusText: string
}

const diffResult = ref<DiffRow[]>([])
const stats = ref({ onlyInColumn1: 0, onlyInColumn2: 0, inBoth: 0 })

// 根据选择的状态过滤结果
const filteredResult = computed(() => {
  if (selectedStatus.value === 'all') {
    return diffResult.value
  }
  return diffResult.value.filter((row) => row.status === selectedStatus.value)
})

// 防抖处理，避免频繁计算
const debouncedComputeDiff = useDebounce(
  ((rows1: string[], rows2: string[]) => {
    isProcessing.value = true

    // 使用 setTimeout 避免阻塞主线程
    setTimeout(() => {
      const result: DiffRow[] = []

      // 处理原始数据中的每一行，与对比数据的所有行比对
      rows1.forEach((val1, index) => {
        const existsInComparison = rows2.includes(val1)
        let status: DiffRow['status']
        let statusText: string

        if (existsInComparison) {
          status = 'in-both'
          statusText = '两者都存在'
        } else {
          status = 'only-in-column1'
          statusText = '仅在原始数据中存在'
        }

        result.push({
          rowNumber: index + 1,
          column1: val1,
          column2: existsInComparison ? val1 : '',
          status,
          statusText,
        })
      })

      // 处理仅在对比数据中存在的行
      const originalSet = new Set(rows1)
      rows2.forEach((val2) => {
        if (!originalSet.has(val2)) {
          result.push({
            rowNumber: result.length + 1,
            column1: '',
            column2: val2,
            status: 'only-in-column2',
            statusText: '仅在对比数据中存在',
          })
        }
      })

      // 计算统计信息
      let onlyInColumn1 = 0
      let onlyInColumn2 = 0
      let inBoth = 0

      result.forEach((row) => {
        if (row.status === 'only-in-column1') onlyInColumn1++
        if (row.status === 'only-in-column2') onlyInColumn2++
        if (row.status === 'in-both') inBoth++
      })

      diffResult.value = result
      stats.value = { onlyInColumn1, onlyInColumn2, inBoth }
      isProcessing.value = false
    }, 0)
  }) as (...args: unknown[]) => unknown,
  300,
)

// 监听数据变化，触发计算
watch(
  [column1Rows, column2Rows],
  ([newRows1, newRows2]) => {
    debouncedComputeDiff(newRows1, newRows2)
  },
  { immediate: true },
)

const clearColumn1 = () => {
  column1.value = ''
  toast.info('原始数据已清空')
}

const clearColumn2 = () => {
  column2.value = ''
  toast.info('对比数据已清空')
}

const clearAll = () => {
  column1.value = ''
  column2.value = ''
  toast.info('已清空全部')
}

const pasteColumn1 = async () => {
  try {
    const text = await navigator.clipboard.readText()
    column1.value = text
    toast.success('已粘贴到原始数据')
  } catch (err) {
    console.error('粘贴失败:', err)
    toast.error('粘贴失败，请手动粘贴')
  }
}

const pasteColumn2 = async () => {
  try {
    const text = await navigator.clipboard.readText()
    column2.value = text
    toast.success('已粘贴到对比数据')
  } catch (err) {
    console.error('粘贴失败:', err)
    toast.error('粘贴失败，请手动粘贴')
  }
}

const copyOnlyInColumn1 = () => {
  const values = diffResult.value
    .filter((row) => row.status === 'only-in-column1')
    .map((row) => row.column1)
    .filter(Boolean)
  const text = values.join('\n')
  if (text) {
    toastCopy(text)
    toast.success('已复制仅在原始数据中的数据')
  } else {
    toast.info('没有仅在原始数据中的数据')
  }
}

const copyOnlyInColumn2 = () => {
  const values = diffResult.value
    .filter((row) => row.status === 'only-in-column2')
    .map((row) => row.column2)
    .filter(Boolean)
  const text = values.join('\n')
  if (text) {
    toastCopy(text)
    toast.success('已复制仅在对比数据中的数据')
  } else {
    toast.info('没有仅在对比数据中的数据')
  }
}

const copyInBoth = () => {
  const values = diffResult.value
    .filter((row) => row.status === 'in-both')
    .map((row) => row.column1)
    .filter(Boolean)
  const text = values.join('\n')
  if (text) {
    toastCopy(text)
    toast.success('已复制两列都存在的数据')
  } else {
    toast.info('没有两列都存在的数据')
  }
}
</script>

<style scoped>
/* 自定义样式 */
</style>
