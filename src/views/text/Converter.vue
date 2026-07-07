<template>
  <div class="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
    <!-- 加载状态 -->
    <LoadingSpinner v-if="loading" :loading="loading" :message="loadingMessage" :overlay="true" />

    <!-- 页面标题 -->
    <div class="mb-6">
      <h2 class="text-xl font-bold text-gray-800">字符串转换工具</h2>
      <p class="text-sm text-gray-500 mt-1">支持大小写、命名法、拼音转换及文本处理，输入即见结果</p>
    </div>

    <!-- 输入区和输出区（左右布局） -->
    <div class="flex flex-col md:flex-row gap-4 mb-6 flex-1 min-h-0">
      <!-- 左侧：输入文本 -->
      <div class="flex-1 flex flex-col min-h-0">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-gray-700 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-blue-500"></span>
            输入文本
          </h3>
          <div class="flex gap-2">
            <button
              @click="pasteText"
              :disabled="loading"
              class="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              粘贴
            </button>
            <button
              @click="clearInput"
              :disabled="!inputText"
              class="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              清空
            </button>
          </div>
        </div>

        <div class="border border-gray-300 rounded-lg overflow-hidden flex-1 min-h-0 flex flex-col">
          <textarea
            v-model="inputText"
            placeholder="请输入文本，然后选择转换方式..."
            class="w-full flex-1 min-h-[300px] p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            spellcheck="false"
            :disabled="loading"
          ></textarea>
        </div>

        <!-- 紧凑文本统计 -->
        <div v-if="inputText" class="mt-2 flex flex-wrap gap-2 text-xs">
          <span class="px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-100"
            >字符 {{ textStats.charCount }}</span
          >
          <span class="px-2 py-1 bg-green-50 text-green-700 rounded border border-green-100"
            >字节 {{ textStats.byteCount }}</span
          >
          <span class="px-2 py-1 bg-purple-50 text-purple-700 rounded border border-purple-100"
            >行数 {{ textStats.lineCount }}</span
          >
          <span class="px-2 py-1 bg-orange-50 text-orange-700 rounded border border-orange-100"
            >单词 {{ textStats.wordCount }}</span
          >
          <span class="px-2 py-1 bg-teal-50 text-teal-700 rounded border border-teal-100"
            >中文 {{ textStats.chineseCount }}</span
          >
        </div>
      </div>

      <!-- 右侧：转换结果 -->
      <div class="flex-1 flex flex-col min-h-0">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-gray-700 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-green-500"></span>
            转换结果
          </h3>
          <div class="flex gap-2">
            <button
              v-if="outputText"
              @click="useAsInput"
              class="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-md text-sm hover:bg-indigo-200 transition-colors"
              title="将结果作为输入，便于链式转换"
            >
              用作输入
            </button>
            <button
              @click="copyOutput"
              :disabled="!outputText"
              class="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              复制
            </button>
          </div>
        </div>

        <div
          class="border border-gray-300 rounded-lg overflow-hidden flex-1 min-h-0 flex flex-col bg-white"
        >
          <textarea
            v-model="outputText"
            placeholder="转换结果将显示在这里..."
            class="w-full flex-1 min-h-[300px] p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
            spellcheck="false"
            readonly
          ></textarea>
        </div>
        <p v-if="lastAction" class="mt-2 text-xs text-gray-400">上次操作：{{ lastAction }}</p>
      </div>
    </div>

    <!-- 转换按钮区 -->
    <div class="space-y-4">
      <!-- 大小写转换 -->
      <div>
        <h4 class="text-sm font-medium text-gray-600 mb-2">大小写转换</h4>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="btn in caseButtons"
            :key="btn.text"
            @click="applyTransform(btn.fn, btn.text)"
            :disabled="!inputText"
            class="px-3 py-2 bg-blue-50 text-blue-700 rounded-md text-sm hover:bg-blue-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-blue-100"
          >
            {{ btn.text }}
          </button>
        </div>
      </div>

      <!-- 命名法转换 -->
      <div>
        <h4 class="text-sm font-medium text-gray-600 mb-2">命名法转换</h4>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="btn in namingButtons"
            :key="btn.text"
            @click="applyTransform(btn.fn, btn.text)"
            :disabled="!inputText"
            class="px-3 py-2 bg-purple-50 text-purple-700 rounded-md text-sm hover:bg-purple-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-purple-100"
          >
            {{ btn.text }}
          </button>
        </div>
      </div>

      <!-- 拼音转换 -->
      <div>
        <h4 class="text-sm font-medium text-gray-600 mb-2">拼音转换</h4>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="btn in pinyinButtons"
            :key="btn.text"
            @click="applyTransform(btn.fn, btn.text)"
            :disabled="!inputText"
            class="px-3 py-2 bg-cyan-50 text-cyan-700 rounded-md text-sm hover:bg-cyan-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-cyan-100"
          >
            {{ btn.text }}
          </button>
        </div>
      </div>

      <!-- 文本处理 -->
      <div>
        <h4 class="text-sm font-medium text-gray-600 mb-2">文本处理</h4>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="btn in textButtons"
            :key="btn.text"
            @click="applyTransform(btn.fn, btn.text)"
            :disabled="!inputText"
            class="px-3 py-2 bg-amber-50 text-amber-700 rounded-md text-sm hover:bg-amber-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-amber-100"
          >
            {{ btn.text }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToast } from '@/composables/useToast'
import pinyin from 'pinyin'
import { toastCopy } from '@/utils/clipboard'
import {
  removeSpaces,
  compressText,
  removeDuplicateLines,
  convertCase,
  convertNaming,
  calculateTextStats,
} from '@/utils/strings'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const toast = useToast()
const inputText = ref('')
const outputText = ref('')
const lastAction = ref('')
const loading = ref(false)
const loadingMessage = ref('')

/* ---------- 文本统计 ---------- */
const textStats = computed(() => {
  return calculateTextStats(inputText.value)
})

/* ---------- 通用转换应用 ---------- */
const applyTransform = (fn: (text: string) => string, label: string) => {
  if (!inputText.value.trim()) {
    toast.warning('请先输入文本')
    return
  }
  try {
    outputText.value = fn(inputText.value)
    lastAction.value = label
    toast.success(`${label} 完成`)
  } catch {
    toast.error(`${label} 失败`)
  }
}

/* ---------- 剪贴板 ---------- */
const clearInput = () => {
  inputText.value = ''
  outputText.value = ''
  lastAction.value = ''
  toast.info('已清空')
}

const pasteText = async () => {
  try {
    loading.value = true
    loadingMessage.value = '粘贴中...'
    inputText.value = await navigator.clipboard.readText()
    toast.success('已粘贴')
  } catch {
    toast.error('粘贴失败，请手动 Ctrl+V 粘贴')
  } finally {
    loading.value = false
    loadingMessage.value = ''
  }
}

const copyOutput = async () => {
  if (!outputText.value) {
    toast.warning('没有可复制的内容')
    return
  }
  toastCopy(outputText.value, '转换结果', {
    onLoading: (isLoading) => {
      loading.value = isLoading
      loadingMessage.value = isLoading ? '复制中...' : ''
    },
  })
}

// 将输出结果作为输入，便于链式转换
const useAsInput = () => {
  inputText.value = outputText.value
  outputText.value = ''
  lastAction.value = ''
  toast.info('已将结果设为输入')
}

/* ---------- 按钮配置 ---------- */
const caseButtons = [
  { text: '全部大写', fn: (t: string) => convertCase(t, 'upper') },
  { text: '全部小写', fn: (t: string) => convertCase(t, 'lower') },
  { text: '首字母大写', fn: (t: string) => convertCase(t, 'firstUpper') },
  { text: '首字母小写', fn: (t: string) => convertCase(t, 'firstLower') },
  { text: '句子首字母', fn: (t: string) => convertCase(t, 'sentence') },
  { text: '标题大小写', fn: (t: string) => convertCase(t, 'title') },
]

const namingButtons = [
  { text: 'camelCase', fn: (t: string) => convertNaming(t, 'camel') },
  { text: 'snake_case', fn: (t: string) => convertNaming(t, 'snake') },
  { text: 'kebab-case', fn: (t: string) => convertNaming(t, 'kebab') },
]

const pinyinButtons = [
  {
    text: '拼音',
    fn: (t: string) =>
      pinyin(t, { style: pinyin.STYLE_NORMAL, heteronym: false, segment: true })
        .map((item) => item[0])
        .join(' '),
  },
  {
    text: '带声调拼音',
    fn: (t: string) =>
      pinyin(t, { style: pinyin.STYLE_TONE, heteronym: false, segment: true })
        .map((item) => item[0])
        .join(' '),
  },
  {
    text: '拼音首字母',
    fn: (t: string) =>
      pinyin(t, { style: pinyin.STYLE_FIRST_LETTER, heteronym: false, segment: true })
        .map((item) => item[0])
        .join(' '),
  },
]

const textButtons = [
  { text: '清除空格', fn: removeSpaces },
  { text: '压缩文本', fn: compressText },
  { text: '去除重复行', fn: removeDuplicateLines },
]
</script>
