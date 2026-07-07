<template>
  <div
    class="flex flex-col flex-1 min-h-0 bg-white rounded-xl border border-gray-200 overflow-hidden"
  >
    <!-- Toolbar -->
    <div
      class="flex-shrink-0 flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200"
    >
      <div class="flex items-center gap-3">
        <!-- Diff 模式切换 -->
        <div class="flex items-center bg-gray-200 rounded-lg">
          <button
            v-for="m in diffModes"
            :key="m.value"
            @click="diffMode = m.value"
            :class="[
              'px-3 py-1 text-xs rounded-lg transition-colors',
              diffMode === m.value
                ? 'bg-white text-blue-600 shadow-sm font-medium'
                : 'text-gray-500 hover:text-gray-700',
            ]"
          >
            {{ m.label }}
          </button>
        </div>
        <label class="flex items-center gap-1 text-xs text-gray-500 cursor-pointer select-none">
          <input type="checkbox" v-model="ignoreWhitespace" class="rounded border-gray-300" />
          忽略空格
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
          v-if="hasDiff"
          @click="toastCopy(text1, '字符串 1')"
          class="text-xs text-gray-500 hover:text-blue-600 transition-colors"
        >
          复制左
        </button>
        <button
          v-if="hasDiff"
          @click="toastCopy(text2, '字符串 2')"
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
      <!-- String 1 -->
      <div class="flex flex-col bg-white min-h-0">
        <div
          class="flex items-center justify-between px-4 py-1.5 border-b border-gray-100 flex-shrink-0"
        >
          <span class="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <span class="w-2 h-2 rounded-full bg-blue-500"></span>
            字符串 1
          </span>
          <span class="text-xs text-gray-400"
            >{{ lineCount(text1) }} 行 · {{ text1.length }} 字符</span
          >
        </div>
        <textarea
          v-model="text1"
          placeholder="粘贴或输入第一个字符串..."
          class="flex-1 w-full p-3 font-mono text-sm resize-none focus:outline-none bg-blue-50/30"
          spellcheck="false"
        />
      </div>

      <!-- String 2 -->
      <div class="flex flex-col bg-white min-h-0">
        <div
          class="flex items-center justify-between px-4 py-1.5 border-b border-gray-100 flex-shrink-0"
        >
          <span class="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <span class="w-2 h-2 rounded-full bg-green-500"></span>
            字符串 2
          </span>
          <span class="text-xs text-gray-400"
            >{{ lineCount(text2) }} 行 · {{ text2.length }} 字符</span
          >
        </div>
        <textarea
          v-model="text2"
          placeholder="粘贴或输入第二个字符串..."
          class="flex-1 w-full p-3 font-mono text-sm resize-none focus:outline-none bg-green-50/30"
          spellcheck="false"
        />
      </div>
    </div>

    <!-- ============ 结果区（下方，与输入区等高） ============ -->
    <div class="flex-1 min-h-0 flex flex-col">
      <!-- Stats bar -->
      <div
        class="flex-shrink-0 flex items-center gap-4 px-4 py-1.5 bg-white border-b border-gray-200 text-xs"
      >
        <template v-if="hasDiff">
          <span class="text-red-600 font-medium">● 删除 {{ stats.removed }}</span>
          <span class="text-green-600 font-medium">● 新增 {{ stats.added }}</span>
          <span v-if="diffMode === 'line'" class="text-amber-600 font-medium"
            >● 修改 {{ stats.modified }}</span
          >
          <span v-if="diffMode === 'line'" class="text-gray-400">{{ stats.unchanged }} 行相同</span>
        </template>
        <span v-else class="text-gray-400">输入两个字符串后自动对比差异</span>
      </div>

      <!-- Diff content -->
      <div ref="diffScrollRef" class="flex-1 min-h-0 overflow-auto">
        <!-- 行级 diff: split table -->
        <table
          v-if="diffMode === 'line' && diffRows.length"
          class="w-full border-collapse text-xs font-mono table-fixed"
        >
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

        <!-- 词级/字符级 diff: inline two-column -->
        <div
          v-else-if="diffMode !== 'line' && inlineDiff"
          class="grid grid-cols-2 h-full"
          style="gap: 1px; background: #e5e7eb"
        >
          <div class="bg-white overflow-auto">
            <div
              class="flex items-center gap-2 px-4 py-1.5 border-b border-gray-100 sticky top-0 bg-white"
            >
              <span class="w-2 h-2 rounded-full bg-blue-500"></span>
              <span class="text-xs font-semibold text-gray-600">字符串 1</span>
            </div>
            <pre
              class="p-4 text-xs font-mono whitespace-pre-wrap break-all leading-relaxed"
            ><template v-for="(part, i) in inlineDiff.left" :key="'l-' + i"><span :class="inlineClass(part.type)">{{ part.text || ' ' }}</span></template></pre>
          </div>
          <div class="bg-white overflow-auto">
            <div
              class="flex items-center gap-2 px-4 py-1.5 border-b border-gray-100 sticky top-0 bg-white"
            >
              <span class="w-2 h-2 rounded-full bg-green-500"></span>
              <span class="text-xs font-semibold text-gray-600">字符串 2</span>
            </div>
            <pre
              class="p-4 text-xs font-mono whitespace-pre-wrap break-all leading-relaxed"
            ><template v-for="(part, i) in inlineDiff.right" :key="'r-' + i"><span :class="inlineClass(part.type)">{{ part.text || ' ' }}</span></template></pre>
          </div>
        </div>

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
            <p>在上方输入两个字符串后自动对比差异</p>
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
import { diffLines, diffWords, diffChars } from 'diff'

const toast = useToast()

const text1 = ref('')
const text2 = ref('')
const ignoreWhitespace = ref(false)
const diffScrollRef = ref<HTMLElement | null>(null)

// ==================== Diff 模式 ====================
type DiffMode = 'char' | 'word' | 'line'
const diffModes: { label: string; value: DiffMode }[] = [
  { label: '字符', value: 'char' },
  { label: '词语', value: 'word' },
  { label: '整行', value: 'line' },
]
const diffMode = ref<DiffMode>('char')

// ==================== 行级 diff ====================
interface DiffRow {
  leftNumber: number | null
  rightNumber: number | null
  leftContent: string
  rightContent: string
  type: 'normal' | 'removed' | 'added' | 'modified'
}

const diffRows = ref<DiffRow[]>([])

// ==================== 词级/字符级 diff ====================
interface InlinePart {
  text: string
  type: 'normal' | 'removed' | 'added'
}

const inlineDiff = ref<{ left: InlinePart[]; right: InlinePart[] } | null>(null)

// ==================== 统计 ====================
const stats = computed(() => {
  let removed = 0
  let added = 0
  let modified = 0
  let unchanged = 0
  if (diffMode.value === 'line') {
    for (const row of diffRows.value) {
      if (row.type === 'removed') removed++
      else if (row.type === 'added') added++
      else if (row.type === 'modified') modified++
      else unchanged++
    }
  } else if (inlineDiff.value) {
    for (const part of inlineDiff.value.left) {
      if (part.type === 'removed') removed++
    }
    for (const part of inlineDiff.value.right) {
      if (part.type === 'added') added++
    }
  }
  return { removed, added, modified, unchanged }
})

const hasDiff = computed(() => {
  if (diffMode.value === 'line') return diffRows.value.length > 0
  return inlineDiff.value !== null
})

// ==================== 工具函数 ====================
function lineCount(text: string): number {
  if (!text) return 0
  return text.split('\n').length
}

function inlineClass(type: InlinePart['type']): string {
  if (type === 'removed') return 'bg-red-100 text-red-700 rounded px-0.5'
  if (type === 'added') return 'bg-green-100 text-green-700 rounded px-0.5'
  return 'text-gray-700'
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

function buildInlineDiff(str1: string, str2: string, mode: 'word' | 'char') {
  const changes = mode === 'word' ? diffWords(str1, str2) : diffChars(str1, str2)
  const left: InlinePart[] = []
  const right: InlinePart[] = []

  for (const change of changes) {
    if (change.removed) {
      left.push({ text: change.value, type: 'removed' })
    } else if (change.added) {
      right.push({ text: change.value, type: 'added' })
    } else {
      left.push({ text: change.value, type: 'normal' })
      right.push({ text: change.value, type: 'normal' })
    }
  }

  return { left, right }
}

// ==================== 统一计算入口 ====================
const computeDiff = debounce(() => {
  if (!text1.value.trim() || !text2.value.trim()) {
    diffRows.value = []
    inlineDiff.value = null
    return
  }

  if (diffMode.value === 'line') {
    diffRows.value = buildDiffRows(text1.value, text2.value)
    inlineDiff.value = null
  } else {
    inlineDiff.value = buildInlineDiff(text1.value, text2.value, diffMode.value)
    diffRows.value = []
  }

  if (diffScrollRef.value) {
    diffScrollRef.value.scrollTop = 0
  }
}, 300)

watch([text1, text2, diffMode, ignoreWhitespace], () => computeDiff(), { immediate: true })

// ==================== 操作按钮 ====================
const swapInputs = () => {
  const tmp = text1.value
  text1.value = text2.value
  text2.value = tmp
  toast.info('已交换左右内容')
}

const clearAll = () => {
  text1.value = ''
  text2.value = ''
  diffRows.value = []
  inlineDiff.value = null
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
