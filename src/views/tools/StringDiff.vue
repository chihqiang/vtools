<template>
  <div class="bg-white rounded-lg shadow-md p-6 h-full">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">字符串对比工具</h2>
    <p class="text-gray-600 mb-6">比较两个字符串的差异，高亮显示不同的部分</p>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-gray-700">字符串 1</h3>
          <div class="flex space-x-2">
            <button
              @click="clearText1"
              class="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
            >
              清空
            </button>
          </div>
        </div>
        <textarea
          v-model="text1"
          placeholder="请输入第一个字符串..."
          class="w-full p-4 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[300px]"
        ></textarea>
      </div>

      <div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-gray-700">字符串 2</h3>
          <div class="flex space-x-2">
            <button
              @click="clearText2"
              class="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
            >
              清空
            </button>
          </div>
        </div>
        <textarea
          v-model="text2"
          placeholder="请输入第二个字符串..."
          class="w-full p-4 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[300px]"
        ></textarea>
      </div>
    </div>

    <div class="mt-6">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-semibold text-gray-700">对比结果</h3>
        <div class="flex space-x-2">
          <button
            @click="compare"
            class="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
          >
            开始对比
          </button>
          <button
            @click="clearAll"
            class="px-4 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
          >
            清空全部
          </button>
        </div>
      </div>

      <div v-if="diffResult" class="border border-gray-300 rounded-lg bg-gray-50 p-4">
        <div class="mb-3">
          <span class="text-sm text-gray-600">差异统计：</span>
          <span class="ml-4 text-sm font-semibold text-red-600">删除 {{ diffStats.removed }} 处</span>
          <span class="ml-4 text-sm font-semibold text-green-600">新增 {{ diffStats.added }} 处</span>
          <span class="ml-4 text-sm font-semibold text-blue-600">修改 {{ diffStats.modified }} 处</span>
        </div>
        <div class="border-t border-gray-200 pt-3">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-semibold text-gray-700">字符串 1：</span>
            <button
              @click="copyText1"
              class="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
            >
              复制
            </button>
          </div>
          <div class="bg-white border border-gray-200 rounded p-3 font-mono text-sm whitespace-pre-wrap break-words">
            <span
              v-for="(part, index) in diffResult.text1"
              :key="'text1-' + index"
              :class="{
                'bg-red-100 text-red-700': part.type === 'removed',
                'bg-green-100 text-green-700': part.type === 'added',
                'bg-blue-100 text-blue-700': part.type === 'modified'
              }"
            >
              {{ part.text }}
            </span>
          </div>

          <div class="flex items-center justify-between mb-2 mt-4">
            <span class="text-sm font-semibold text-gray-700">字符串 2：</span>
            <button
              @click="copyText2"
              class="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
            >
              复制
            </button>
          </div>
          <div class="bg-white border border-gray-200 rounded p-3 font-mono text-sm whitespace-pre-wrap break-words">
            <span
              v-for="(part, index) in diffResult.text2"
              :key="'text2-' + index"
              :class="{
                'bg-red-100 text-red-700': part.type === 'removed',
                'bg-green-100 text-green-700': part.type === 'added',
                'bg-blue-100 text-blue-700': part.type === 'modified'
              }"
            >
              {{ part.text }}
            </span>
          </div>
        </div>
      </div>

      <div v-else class="border border-gray-300 rounded-lg bg-gray-50 p-8 text-center text-gray-400">
        <span>点击"开始对比"按钮查看差异</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToast } from '@/composables/useToast'

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
  
  diffResult.value.text1.forEach(part => {
    if (part.type === 'removed') removed++
    if (part.type === 'modified') modified++
  })
  
  diffResult.value.text2.forEach(part => {
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

const copyText1 = async () => {
  if (!text1.value) {
    toast.warning('字符串 1 为空')
    return
  }
  
  try {
    await navigator.clipboard.writeText(text1.value)
    toast.success('复制成功')
  } catch {
    toast.error('复制失败')
  }
}

const copyText2 = async () => {
  if (!text2.value) {
    toast.warning('字符串 2 为空')
    return
  }
  
  try {
    await navigator.clipboard.writeText(text2.value)
    toast.success('复制成功')
  } catch {
    toast.error('复制失败')
  }
}

const compare = () => {
  if (!text1.value || !text2.value) {
    toast.warning('请输入两个字符串')
    return
  }

  const result = computeDiff(text1.value, text2.value)
  diffResult.value = result
  toast.success('对比完成')
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
