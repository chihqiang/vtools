<template>
  <div class="bg-white rounded-xl shadow-md p-6 h-full">
    <!-- Header -->
    <div class="mb-6 border border-gray-200 rounded-lg p-4">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">字符串对比工具</h2>
          <p class="text-sm text-gray-500 mt-1">比较两个字符串的差异，高亮显示不同的部分</p>
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
        <!-- 字符串 1 -->
        <div class="flex flex-col">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-semibold text-gray-700">字符串 1</h3>
            <button
              @click="clearText1"
              class="px-3 py-1 text-xs rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              清空
            </button>
          </div>
          <textarea
            v-model="text1"
            placeholder="请输入第一个字符串..."
            class="w-full min-h-[300px] p-4 rounded-lg border border-gray-300 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- 字符串 2 -->
        <div class="flex flex-col">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-semibold text-gray-700">字符串 2</h3>
            <button
              @click="clearText2"
              class="px-3 py-1 text-xs rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              清空
            </button>
          </div>
          <textarea
            v-model="text2"
            placeholder="请输入第二个字符串..."
            class="w-full min-h-[300px] p-4 rounded-lg border border-gray-300 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>

    <!-- 结果区 -->
    <div v-if="isDiffing" class="mt-4 border rounded-lg bg-gray-50 p-4 text-center text-gray-500 text-sm py-8">
      正在对比中...
    </div>
    <div v-else-if="diffResult" class="mt-4 border rounded-lg bg-gray-50 p-4">
      <!-- 统计 -->
      <div class="mb-4 flex flex-wrap gap-4 text-sm">
        <span class="text-red-600 font-semibold">删除 {{ diffStats.removed }}</span>
        <span class="text-green-600 font-semibold">新增 {{ diffStats.added }}</span>
        <span class="text-blue-600 font-semibold">修改 {{ diffStats.modified }}</span>
      </div>

      <!-- 左右布局的 diff 结果 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- diff 1 -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-semibold text-gray-700">字符串 1</span>
            <button
              @click="toastCopy(text1)"
              class="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
            >
              复制
            </button>
          </div>
          <div
            class="bg-white border border-gray-200 rounded-lg p-3 font-mono text-sm whitespace-pre-wrap break-words"
          >
            <span
              v-for="(part, index) in diffResult.text1"
              :key="'t1-' + index"
              :class="{
                'bg-red-100 text-red-700 px-1 rounded': part.type === 'removed',
                'bg-green-100 text-green-700 px-1 rounded': part.type === 'added',
                'bg-blue-100 text-blue-700 px-1 rounded': part.type === 'modified',
              }"
            >
              {{ part.text || ' ' }}
            </span>
          </div>
        </div>

        <!-- diff 2 -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-semibold text-gray-700">字符串 2</span>
            <button
              @click="toastCopy(text2)"
              class="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
            >
              复制
            </button>
          </div>
          <div
            class="bg-white border border-gray-200 rounded-lg p-3 font-mono text-sm whitespace-pre-wrap break-words"
          >
            <span
              v-for="(part, index) in diffResult.text2"
              :key="'t2-' + index"
              :class="{
                'bg-red-100 text-red-700 px-1 rounded': part.type === 'removed',
                'bg-green-100 text-green-700 px-1 rounded': part.type === 'added',
                'bg-blue-100 text-blue-700 px-1 rounded': part.type === 'modified',
              }"
            >
              {{ part.text || ' ' }}
            </span>
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
import { diffChars } from 'diff'

const toast = useToast()

const text1 = ref('')
const text2 = ref('')
const diffResult = ref<{
  text1: Array<{ text: string; type: 'normal' | 'removed' | 'added' | 'modified' }>
  text2: Array<{ text: string; type: 'normal' | 'removed' | 'added' | 'modified' }>
} | null>(null)
const isDiffing = ref(false)

const diffStats = computed(() => {
  if (!diffResult.value) return { removed: 0, added: 0, modified: 0 }

  let removed = 0
  let added = 0
  let modified = 0

  diffResult.value.text1.forEach((part) => {
    if (part.type === 'removed') removed++
    if (part.type === 'modified') modified++
  })

  diffResult.value.text2.forEach((part) => {
    if (part.type === 'added') added++
  })

  return { removed, added, modified }
})

const clearText1 = () => {
  text1.value = ''
  toast.info('字符串 1 已清空')
}

const clearText2 = () => {
  text2.value = ''
  toast.info('字符串 2 已清空')
}

const clearAll = () => {
  text1.value = ''
  text2.value = ''
  diffResult.value = null
  toast.info('已清空全部')
}

const debouncedDiff = debounce(() => {
  if (text1.value && text2.value) {
    isDiffing.value = true
    diffResult.value = computeDiff(text1.value, text2.value)
    isDiffing.value = false
  } else {
    diffResult.value = null
  }
}, 300)

watch([text1, text2], () => debouncedDiff(), { immediate: true })

const computeDiff = (str1: string, str2: string) => {
  const text1Parts: Array<{ text: string; type: 'normal' | 'removed' | 'added' | 'modified' }> = []
  const text2Parts: Array<{ text: string; type: 'normal' | 'removed' | 'added' | 'modified' }> = []

  const diffs = diffChars(str1, str2)

  diffs.forEach((diff) => {
    if (diff.removed) {
      text1Parts.push({ text: diff.value, type: 'removed' })
      text2Parts.push({ text: '', type: 'normal' })
    } else if (diff.added) {
      text1Parts.push({ text: '', type: 'normal' })
      text2Parts.push({ text: diff.value, type: 'added' })
    } else {
      text1Parts.push({ text: diff.value, type: 'normal' })
      text2Parts.push({ text: diff.value, type: 'normal' })
    }
  })

  return { text1: text1Parts, text2: text2Parts }
}
</script>

<style scoped>
.whitespace-pre-wrap {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
