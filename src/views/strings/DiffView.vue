<template>
  <div class="bg-white rounded-xl shadow-md p-6 h-full">
    <!-- Header -->
    <div class="mb-6 border-b border-gray-100 pb-4">
      <h2 class="text-2xl font-bold text-gray-800">字符串对比工具</h2>
      <p class="text-sm text-gray-500 mt-1">比较两个字符串的差异，高亮显示不同的部分</p>
    </div>

    <!-- 输入区 -->
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

    <!-- 操作区 -->
    <div class="mt-6 flex items-center justify-between">
      <h3 class="font-semibold text-gray-700">对比结果</h3>
      <div class="flex gap-2">
        <button
          @click="compare"
          class="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
        >
          开始对比
        </button>
        <button
          @click="clearAll"
          class="px-4 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
        >
          清空全部
        </button>
      </div>
    </div>

    <!-- 结果区 -->
    <div v-if="diffResult" class="mt-4 border rounded-lg bg-gray-50 p-4">
      <!-- 统计 -->
      <div class="mb-4 flex flex-wrap gap-4 text-sm">
        <span class="text-red-600 font-semibold">删除 {{ diffStats.removed }}</span>
        <span class="text-green-600 font-semibold">新增 {{ diffStats.added }}</span>
        <span class="text-blue-600 font-semibold">修改 {{ diffStats.modified }}</span>
      </div>

      <!-- diff 1 -->
      <div class="mb-6">
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

    <!-- 空状态 -->
    <div
      v-else
      class="mt-6 border border-dashed border-gray-300 rounded-lg p-10 text-center text-gray-400 text-sm"
    >
      点击「开始对比」查看差异
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToast } from '@/composables/useToast'
import { toastCopy } from '@/utils/clipboard'

const toast = useToast()

const text1 = ref('')
const text2 = ref('')
const diffResult = ref<{
  text1: Array<{ text: string; type: 'normal' | 'removed' | 'added' | 'modified' }>
  text2: Array<{ text: string; type: 'normal' | 'removed' | 'added' | 'modified' }>
} | null>(null)

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

const compare = () => {
  if (!text1.value || !text2.value) {
    toast.warning('请输入两个字符串')
    return
  }

  const result = computeDiff(text1.value, text2.value)
  diffResult.value = result
}

const computeDiff = (str1: string, str2: string) => {
  const text1Parts: Array<{ text: string; type: 'normal' | 'removed' | 'added' | 'modified' }> = []
  const text2Parts: Array<{ text: string; type: 'normal' | 'removed' | 'added' | 'modified' }> = []

  const len1 = str1.length
  const len2 = str2.length
  const maxLen = Math.max(len1, len2)

  let i = 0
  while (i < maxLen) {
    const char1 = i < len1 ? str1[i] : null
    const char2 = i < len2 ? str2[i] : null

    if (char1 === char2) {
      text1Parts.push({ text: char1 || '', type: 'normal' })
      text2Parts.push({ text: char2 || '', type: 'normal' })
    } else if (char1 && !char2) {
      text1Parts.push({ text: char1, type: 'removed' })
      text2Parts.push({ text: '', type: 'normal' })
    } else if (!char1 && char2) {
      text1Parts.push({ text: '', type: 'normal' })
      text2Parts.push({ text: char2, type: 'added' })
    } else {
      text1Parts.push({ text: char1 || '', type: 'modified' })
      text2Parts.push({ text: char2 || '', type: 'modified' })
    }

    i++
  }

  return { text1: text1Parts, text2: text2Parts }
}
</script>

<style scoped>
.whitespace-pre-wrap {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
