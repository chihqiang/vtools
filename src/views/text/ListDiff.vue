<template>
  <div
    class="flex flex-col flex-1 min-h-0 bg-white rounded-xl border border-gray-200 overflow-hidden"
  >
    <!-- Toolbar -->
    <div
      class="flex-shrink-0 flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200"
    >
      <div class="flex items-center gap-3">
        <label class="flex items-center gap-1 text-xs text-gray-500 cursor-pointer select-none">
          <input type="checkbox" v-model="ignoreCase" class="rounded border-gray-300" />
          忽略大小写
        </label>
        <label class="flex items-center gap-1 text-xs text-gray-500 cursor-pointer select-none">
          <input type="checkbox" v-model="trimSpace" class="rounded border-gray-300" />
          去首尾空格
        </label>
        <label class="flex items-center gap-1 text-xs text-gray-500 cursor-pointer select-none">
          <input type="checkbox" v-model="deduplicate" class="rounded border-gray-300" />
          去重
        </label>
        <button
          @click="swapInputs"
          title="交换左右"
          class="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
        </button>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="pasteColumn1"
          class="text-xs text-blue-500 hover:text-blue-700 transition-colors"
        >
          粘贴左
        </button>
        <button
          @click="pasteColumn2"
          class="text-xs text-green-500 hover:text-green-700 transition-colors"
        >
          粘贴右
        </button>
        <button
          @click="clearAll"
          class="px-2.5 py-1 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
        >
          清空
        </button>
      </div>
    </div>

    <!-- ============ 输入区（上方，与结果区等高） ============ -->
    <div
      class="flex-1 min-h-0 grid grid-cols-2 border-b border-gray-200"
      style="gap: 1px; background: #e5e7eb"
    >
      <!-- 原始数据 -->
      <div class="flex flex-col bg-white min-h-0">
        <div
          class="flex items-center justify-between px-4 py-1.5 border-b border-gray-100 flex-shrink-0"
        >
          <span class="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <span class="w-2 h-2 rounded-full bg-blue-500"></span>
            原始数据
          </span>
          <span class="text-xs text-gray-400">{{ column1Rows.length }} 行</span>
        </div>
        <textarea
          v-model="column1"
          placeholder="每行一个数据..."
          class="flex-1 w-full p-3 font-mono text-sm resize-none focus:outline-none bg-blue-50/30"
          spellcheck="false"
        />
      </div>

      <!-- 对比数据 -->
      <div class="flex flex-col bg-white min-h-0">
        <div
          class="flex items-center justify-between px-4 py-1.5 border-b border-gray-100 flex-shrink-0"
        >
          <span class="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <span class="w-2 h-2 rounded-full bg-green-500"></span>
            对比数据
          </span>
          <span class="text-xs text-gray-400">{{ column2Rows.length }} 行</span>
        </div>
        <textarea
          v-model="column2"
          placeholder="每行一个数据..."
          class="flex-1 w-full p-3 font-mono text-sm resize-none focus:outline-none bg-green-50/30"
          spellcheck="false"
        />
      </div>
    </div>

    <!-- ============ 结果区（下方，与输入区等高） ============ -->
    <div class="flex-1 min-h-0 flex flex-col">
      <!-- Stats & filter bar -->
      <div
        class="flex-shrink-0 flex items-center justify-between px-4 py-1.5 bg-white border-b border-gray-200 text-xs"
      >
        <div class="flex gap-4 items-center">
          <template v-if="diffResult.length">
            <span class="text-red-600 font-medium">● 仅原始 {{ stats.onlyInColumn1 }}</span>
            <span class="text-green-600 font-medium">● 仅对比 {{ stats.onlyInColumn2 }}</span>
            <span class="text-blue-600 font-medium">● 共有 {{ stats.inBoth }}</span>
          </template>
          <span v-else class="text-gray-400">输入数据后自动对比</span>
        </div>
        <div v-if="diffResult.length" class="flex items-center gap-2">
          <select
            v-model="selectedStatus"
            class="text-xs border border-gray-200 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            <option value="all">全部</option>
            <option value="only-in-column1">仅原始</option>
            <option value="only-in-column2">仅对比</option>
            <option value="in-both">共有</option>
          </select>
          <button
            @click="copyByStatus('only-in-column1')"
            class="px-2 py-0.5 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          >
            复制仅原始
          </button>
          <button
            @click="copyByStatus('only-in-column2')"
            class="px-2 py-0.5 rounded bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
          >
            复制仅对比
          </button>
          <button
            @click="copyByStatus('in-both')"
            class="px-2 py-0.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
          >
            复制共有
          </button>
        </div>
      </div>

      <!-- Result table -->
      <div class="flex-1 min-h-0 overflow-auto">
        <table v-if="filteredResult.length" class="w-full border-collapse text-xs">
          <thead class="sticky top-0 z-10 bg-gray-100 border-b border-gray-300">
            <tr>
              <th class="w-12 px-3 py-2 text-left font-semibold text-gray-600">#</th>
              <th class="px-4 py-2 text-left font-semibold text-gray-600 border-l border-gray-200">
                原始数据
              </th>
              <th class="px-4 py-2 text-left font-semibold text-gray-600 border-l border-gray-200">
                对比数据
              </th>
              <th
                class="w-20 px-3 py-2 text-left font-semibold text-gray-600 border-l border-gray-200"
              >
                状态
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in filteredResult"
              :key="index"
              class="border-b border-gray-50"
              :class="{
                'bg-red-50/50': row.status === 'only-in-column1',
                'bg-green-50/50': row.status === 'only-in-column2',
                'bg-blue-50/50': row.status === 'in-both',
              }"
            >
              <td class="px-3 py-1.5 text-gray-400">{{ index + 1 }}</td>
              <td class="px-4 py-1.5 font-mono text-gray-800 border-l border-gray-100 break-all">
                {{ row.column1 || '—' }}
              </td>
              <td class="px-4 py-1.5 font-mono text-gray-800 border-l border-gray-100 break-all">
                {{ row.column2 || '—' }}
              </td>
              <td class="px-3 py-1.5 border-l border-gray-100">
                <span
                  :class="{
                    'text-red-600': row.status === 'only-in-column1',
                    'text-green-600': row.status === 'only-in-column2',
                    'text-blue-600': row.status === 'in-both',
                  }"
                >
                  {{ row.statusText }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty state -->
        <div v-else class="flex items-center justify-center h-full text-gray-400 text-sm">
          <div class="text-center">
            <svg
              class="w-12 h-12 mx-auto mb-2 opacity-30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p>在上方输入数据后自动对比</p>
          </div>
        </div>
      </div>
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
const ignoreCase = ref(false)
const trimSpace = ref(true)
const deduplicate = ref(false)
const selectedStatus = ref<string>('all')

// ==================== Diff 逻辑 ====================
interface DiffRow {
  column1: string
  column2: string
  status: 'only-in-column1' | 'only-in-column2' | 'in-both'
  statusText: string
}

const diffResult = ref<DiffRow[]>([])

function processRows(text: string): string[] {
  let rows = text.split('\n')
  if (trimSpace.value) {
    rows = rows.map((r) => r.trim())
  }
  rows = rows.filter((r) => r !== '')
  if (ignoreCase.value) {
    rows = rows.map((r) => r.toLowerCase())
  }
  if (deduplicate.value) {
    rows = [...new Set(rows)]
  }
  return rows
}

const column1Rows = computed(() => {
  if (!column1.value) return []
  return processRows(column1.value)
})

const column2Rows = computed(() => {
  if (!column2.value) return []
  return processRows(column2.value)
})

const stats = computed(() => {
  let onlyInColumn1 = 0
  let onlyInColumn2 = 0
  let inBoth = 0
  for (const row of diffResult.value) {
    if (row.status === 'only-in-column1') onlyInColumn1++
    else if (row.status === 'only-in-column2') onlyInColumn2++
    else inBoth++
  }
  return { onlyInColumn1, onlyInColumn2, inBoth }
})

const filteredResult = computed(() => {
  if (selectedStatus.value === 'all') return diffResult.value
  return diffResult.value.filter((row) => row.status === selectedStatus.value)
})

// 防抖计算 diff
const debouncedComputeDiff = useDebounce(
  ((rows1: string[], rows2: string[]) => {
    const result: DiffRow[] = []
    const set2 = new Set(rows2)
    const set1 = new Set(rows1)

    for (const val1 of rows1) {
      if (set2.has(val1)) {
        result.push({ column1: val1, column2: val1, status: 'in-both', statusText: '共有' })
      } else {
        result.push({ column1: val1, column2: '', status: 'only-in-column1', statusText: '仅原始' })
      }
    }

    for (const val2 of rows2) {
      if (!set1.has(val2)) {
        result.push({ column1: '', column2: val2, status: 'only-in-column2', statusText: '仅对比' })
      }
    }

    diffResult.value = result
  }) as (...args: unknown[]) => unknown,
  300,
)

watch(
  [column1Rows, column2Rows],
  ([newRows1, newRows2]) => {
    debouncedComputeDiff(newRows1, newRows2)
  },
  { immediate: true },
)

// ==================== 操作按钮 ====================
const swapInputs = () => {
  const tmp = column1.value
  column1.value = column2.value
  column2.value = tmp
  toast.info('已交换左右内容')
}

const clearAll = () => {
  column1.value = ''
  column2.value = ''
  diffResult.value = []
}

const pasteColumn1 = async () => {
  try {
    const text = await pasteFromClipboard()
    column1.value = text
    toast.success('已粘贴到原始数据')
  } catch {
    toast.error('粘贴失败，请手动 Ctrl+V 粘贴')
  }
}

const pasteColumn2 = async () => {
  try {
    const text = await pasteFromClipboard()
    column2.value = text
    toast.success('已粘贴到对比数据')
  } catch {
    toast.error('粘贴失败，请手动 Ctrl+V 粘贴')
  }
}

async function pasteFromClipboard(): Promise<string> {
  if (navigator.clipboard && window.isSecureContext) {
    return await navigator.clipboard.readText()
  }
  throw new Error('Clipboard API 不可用')
}

function copyByStatus(status: DiffRow['status']) {
  const values = diffResult.value
    .filter((row) => row.status === status)
    .map((row) => (status === 'only-in-column2' ? row.column2 : row.column1))
    .filter(Boolean)

  if (!values.length) {
    toast.info('没有可复制的数据')
    return
  }

  toastCopy(values.join('\n'))
}
</script>

<style scoped>
textarea {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  line-height: 1.5;
  tab-size: 2;
}
</style>
