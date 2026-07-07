<template>
  <div
    class="flex flex-col flex-1 min-h-0 bg-white rounded-xl border border-gray-200 overflow-hidden"
  >
    <!-- Toolbar -->
    <div
      class="flex-shrink-0 flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200"
    >
      <div class="flex items-center gap-3">
        <button
          @click="formatBoth"
          title="格式化 JSON"
          class="px-3 py-1 text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
        >
          格式化
        </button>
        <label class="flex items-center gap-1 text-xs text-gray-500 cursor-pointer select-none">
          <input type="checkbox" v-model="ignoreWhitespace" class="rounded border-gray-300" />
          忽略空行
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
          v-if="diffRows.length"
          @click="toastCopy(formattedText1, 'JSON 1')"
          class="text-xs text-gray-500 hover:text-blue-600 transition-colors"
        >
          复制左
        </button>
        <button
          v-if="diffRows.length"
          @click="toastCopy(formattedText2, 'JSON 2')"
          class="text-xs text-gray-500 hover:text-blue-600 transition-colors"
        >
          复制右
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
      <!-- JSON 1 -->
      <div class="flex flex-col bg-white min-h-0">
        <div
          class="flex items-center justify-between px-4 py-1.5 border-b border-gray-100 flex-shrink-0"
        >
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-blue-500"></span>
            <span class="text-sm font-semibold text-gray-700">JSON 1</span>
            <span
              v-if="text1.trim()"
              :class="[
                'text-xs px-1.5 py-0.5 rounded',
                jsonError1 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600',
              ]"
            >
              {{ jsonError1 ? '格式错误' : '有效' }}
            </span>
          </div>
          <span class="text-xs text-gray-400">{{ lineCount(text1) }} 行</span>
        </div>
        <textarea
          v-model="text1"
          placeholder="粘贴第一个 JSON..."
          class="flex-1 w-full p-3 font-mono text-sm resize-none focus:outline-none bg-blue-50/30"
          spellcheck="false"
        />
        <div
          v-if="jsonError1"
          class="px-4 py-1 text-xs text-red-500 bg-red-50 border-t border-red-100 flex-shrink-0"
        >
          ⚠ {{ jsonError1 }}
        </div>
      </div>

      <!-- JSON 2 -->
      <div class="flex flex-col bg-white min-h-0">
        <div
          class="flex items-center justify-between px-4 py-1.5 border-b border-gray-100 flex-shrink-0"
        >
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-green-500"></span>
            <span class="text-sm font-semibold text-gray-700">JSON 2</span>
            <span
              v-if="text2.trim()"
              :class="[
                'text-xs px-1.5 py-0.5 rounded',
                jsonError2 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600',
              ]"
            >
              {{ jsonError2 ? '格式错误' : '有效' }}
            </span>
          </div>
          <span class="text-xs text-gray-400">{{ lineCount(text2) }} 行</span>
        </div>
        <textarea
          v-model="text2"
          placeholder="粘贴第二个 JSON..."
          class="flex-1 w-full p-3 font-mono text-sm resize-none focus:outline-none bg-green-50/30"
          spellcheck="false"
        />
        <div
          v-if="jsonError2"
          class="px-4 py-1 text-xs text-red-500 bg-red-50 border-t border-red-100 flex-shrink-0"
        >
          ⚠ {{ jsonError2 }}
        </div>
      </div>
    </div>

    <!-- ============ 结果区（下方，与输入区等高） ============ -->
    <div class="flex-1 min-h-0 flex flex-col">
      <!-- Stats bar -->
      <div
        class="flex-shrink-0 flex items-center gap-4 px-4 py-1.5 bg-white border-b border-gray-200 text-xs"
      >
        <template v-if="diffRows.length">
          <span class="text-red-600 font-medium">● 删除 {{ stats.removed }}</span>
          <span class="text-green-600 font-medium">● 新增 {{ stats.added }}</span>
          <span class="text-amber-600 font-medium">● 修改 {{ stats.modified }}</span>
          <span class="text-gray-400">{{ stats.unchanged }} 行相同</span>
        </template>
        <span v-else class="text-gray-400">输入两个 JSON 后自动对比差异</span>
      </div>

      <!-- Diff table -->
      <div ref="diffScrollRef" class="flex-1 min-h-0 overflow-auto">
        <table v-if="diffRows.length" class="w-full border-collapse text-xs font-mono table-fixed">
          <tbody>
            <tr
              v-for="(row, i) in diffRows"
              :key="i"
              :class="{
                'bg-red-50': row.type === 'removed',
                'bg-green-50': row.type === 'added',
                'bg-amber-50': row.type === 'modified',
              }"
            >
              <td
                class="w-12 text-right pr-2 py-0.5 text-gray-400 select-none border-r border-gray-100 whitespace-nowrap align-top"
              >
                {{ row.leftNumber ?? '' }}
              </td>
              <td
                class="px-3 py-0.5 whitespace-pre-wrap break-all border-r border-gray-200 align-top"
                :class="
                  row.type === 'removed'
                    ? 'text-red-700'
                    : row.type === 'modified'
                      ? 'text-amber-700'
                      : 'text-gray-700'
                "
              >
                {{ row.leftContent || ' ' }}
              </td>
              <td
                class="w-12 text-right pr-2 py-0.5 text-gray-400 select-none border-r border-gray-100 whitespace-nowrap align-top"
              >
                {{ row.rightNumber ?? '' }}
              </td>
              <td
                class="px-3 py-0.5 whitespace-pre-wrap break-all align-top"
                :class="
                  row.type === 'added'
                    ? 'text-green-700'
                    : row.type === 'modified'
                      ? 'text-amber-700'
                      : 'text-gray-700'
                "
              >
                {{ row.rightContent || ' ' }}
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            <p>在上方输入两个 JSON 后自动对比差异</p>
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
import { debounce } from '@/utils/debounce'
import { diffLines } from 'diff'

const toast = useToast()

const text1 = ref('')
const text2 = ref('')
const jsonError1 = ref('')
const jsonError2 = ref('')
const ignoreWhitespace = ref(false)
const diffScrollRef = ref<HTMLElement | null>(null)

// 格式化后的文本（用于复制和 diff）
const formattedText1 = ref('')
const formattedText2 = ref('')

// ==================== Diff 行数据 ====================
interface DiffRow {
  leftNumber: number | null
  rightNumber: number | null
  leftContent: string
  rightContent: string
  type: 'normal' | 'removed' | 'added' | 'modified'
}

const diffRows = ref<DiffRow[]>([])

const stats = computed(() => {
  let removed = 0
  let added = 0
  let modified = 0
  let unchanged = 0
  for (const row of diffRows.value) {
    if (row.type === 'removed') removed++
    else if (row.type === 'added') added++
    else if (row.type === 'modified') modified++
    else unchanged++
  }
  return { removed, added, modified, unchanged }
})

// ==================== 工具函数 ====================
function lineCount(text: string): number {
  if (!text) return 0
  return text.split('\n').length
}

function parseJson(jsonStr: string): { ok: true; data: unknown } | { ok: false; error: string } {
  try {
    return { ok: true, data: JSON.parse(jsonStr) }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : '解析错误' }
  }
}

function formatJson(data: unknown): string {
  return JSON.stringify(data, null, 2)
}

function buildDiffRows(str1: string, str2: string): DiffRow[] {
  const options: { ignoreWhitespace?: boolean } = {}
  if (ignoreWhitespace.value) options.ignoreWhitespace = true

  const changes = diffLines(str1, str2, options)
  const rows: DiffRow[] = []
  let leftNum = 0
  let rightNum = 0

  for (let i = 0; i < changes.length; i++) {
    const change = changes[i]
    if (!change) continue
    const lines = change.value.split('\n')
    if (lines.length > 0 && lines[lines.length - 1] === '') lines.pop()

    if (!change.added && !change.removed) {
      for (const line of lines) {
        leftNum++
        rightNum++
        rows.push({
          leftNumber: leftNum,
          rightNumber: rightNum,
          leftContent: line,
          rightContent: line,
          type: 'normal',
        })
      }
    } else if (change.removed) {
      const next = changes[i + 1]
      if (next && next.added) {
        const addedLines = next.value.split('\n')
        if (addedLines.length > 0 && addedLines[addedLines.length - 1] === '') addedLines.pop()
        const maxLen = Math.max(lines.length, addedLines.length)
        for (let j = 0; j < maxLen; j++) {
          const leftLine = j < lines.length ? lines[j] : null
          const rightLine = j < addedLines.length ? addedLines[j] : null
          if (leftLine !== null) leftNum++
          if (rightLine !== null) rightNum++
          rows.push({
            leftNumber: leftLine !== null ? leftNum : null,
            rightNumber: rightLine !== null ? rightNum : null,
            leftContent: leftLine ?? '',
            rightContent: rightLine ?? '',
            type: 'modified',
          })
        }
        i++
      } else {
        for (const line of lines) {
          leftNum++
          rows.push({
            leftNumber: leftNum,
            rightNumber: null,
            leftContent: line,
            rightContent: '',
            type: 'removed',
          })
        }
      }
    } else if (change.added) {
      for (const line of lines) {
        rightNum++
        rows.push({
          leftNumber: null,
          rightNumber: rightNum,
          leftContent: '',
          rightContent: line,
          type: 'added',
        })
      }
    }
  }

  return rows
}

// ==================== 统一计算入口 ====================
const computeDiff = debounce(() => {
  jsonError1.value = ''
  jsonError2.value = ''
  formattedText1.value = text1.value
  formattedText2.value = text2.value

  if (!text1.value.trim() || !text2.value.trim()) {
    diffRows.value = []
    return
  }

  // 尝试解析为 JSON 并格式化
  const result1 = parseJson(text1.value)
  const result2 = parseJson(text2.value)

  if (result1.ok) {
    formattedText1.value = formatJson(result1.data)
  } else {
    jsonError1.value = result1.error
  }

  if (result2.ok) {
    formattedText2.value = formatJson(result2.data)
  } else {
    jsonError2.value = result2.error
  }

  // 两个都解析成功则对比格式化后的 JSON，否则对比原始文本
  const str1 = result1.ok ? formattedText1.value : text1.value
  const str2 = result2.ok ? formattedText2.value : text2.value

  diffRows.value = buildDiffRows(str1, str2)

  if (diffScrollRef.value) {
    diffScrollRef.value.scrollTop = 0
  }
}, 300)

watch([text1, text2, ignoreWhitespace], () => computeDiff(), { immediate: true })

// ==================== 操作按钮 ====================
const swapInputs = () => {
  const tmp = text1.value
  text1.value = text2.value
  text2.value = tmp
  toast.info('已交换左右内容')
}

const formatBoth = () => {
  let formatted = false
  const result1 = parseJson(text1.value)
  if (result1.ok) {
    text1.value = formatJson(result1.data)
    formatted = true
  } else {
    jsonError1.value = result1.error
    toast.error('JSON 1 格式化失败：' + result1.error)
  }

  const result2 = parseJson(text2.value)
  if (result2.ok) {
    text2.value = formatJson(result2.data)
    formatted = true
  } else {
    jsonError2.value = result2.error
    toast.error('JSON 2 格式化失败：' + result2.error)
  }

  if (formatted) toast.success('格式化成功')
}

const clearAll = () => {
  text1.value = ''
  text2.value = ''
  diffRows.value = []
  jsonError1.value = ''
  jsonError2.value = ''
  formattedText1.value = ''
  formattedText2.value = ''
}
</script>

<style scoped>
table {
  table-layout: fixed;
}

textarea {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  line-height: 1.5;
  tab-size: 2;
}
</style>
