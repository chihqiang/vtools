<template>
  <div class="bg-white rounded-lg shadow-md p-6 h-full">
    <!-- 加载状态 -->
    <LoadingSpinner v-if="loading" :loading="loading" :message="loadingMessage" :overlay="true" />

    <!-- 输入区和统计区（左右布局） -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <!-- 左侧：文本内容 -->
      <div class="flex-1">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-gray-700">文本内容</h3>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="btn in clipboardButtons"
              :key="btn.text"
              @click="btn.method"
              :class="btn.class"
              :disabled="loading"
            >
              {{ btn.text }}
            </button>
          </div>
        </div>

        <div class="border border-gray-300 rounded-lg overflow-hidden">
          <textarea
            v-model="inputText"
            placeholder="请输入文本，然后选择转换方式..."
            class="w-full min-h-[400px] p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            spellcheck="false"
            :disabled="loading"
          ></textarea>
        </div>
      </div>

      <!-- 右侧：文本统计 -->
      <div class="w-full md:w-72">
        <h3 class="font-semibold text-gray-700 mb-3">文本统计</h3>
        <div class="grid grid-cols-2 gap-1" style="height: 400px">
          <div
            v-for="(value, key) in textStats"
            :key="key"
            :class="
              statConfig[key]?.color ||
              'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 text-gray-700'
            "
            class="rounded-lg p-2 border shadow-sm flex items-center justify-between"
            style="height: 50px"
          >
            <div class="text-xs font-medium text-gray-600">{{ statConfig[key]?.label || key }}</div>
            <div class="text-sm font-bold font-mono">{{ value }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 转换区 -->
    <div class="mt-6">
      <h3 class="font-semibold text-gray-700 mb-3">转换方式</h3>
      <div class="border border-gray-300 rounded-lg p-4">
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
          <button
            v-for="btn in transformButtons"
            :key="btn.text"
            @click="btn.method"
            :class="btn.class"
          >
            {{ btn.text }}
          </button>
        </div>
      </div>
    </div>

    <!-- 拼音转换区 -->
    <div class="mt-6">
      <h3 class="font-semibold text-gray-700 mb-3">拼音转换</h3>
      <div class="border border-gray-300 rounded-lg p-4">
        <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
          <button
            v-for="btn in pinyinButtons"
            :key="btn.text"
            @click="btn.method"
            :class="btn.class"
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
  type CaseType,
  type NamingType,
} from '@/utils/strings'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const toast = useToast()
const inputText = ref('')
const loading = ref(false)
const loadingMessage = ref('')

/* ---------- 文本统计 ---------- */
const textStats = computed(() => {
  return calculateTextStats(inputText.value)
})

interface StatConfig {
  label: string
  color: string
}

const statConfig: Record<string, StatConfig> = {
  charCount: {
    label: '字符数',
    color: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 text-blue-700',
  },
  byteCount: {
    label: '字节数',
    color: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 text-green-700',
  },
  lineCount: {
    label: '总行数',
    color: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 text-purple-700',
  },
  wordCount: {
    label: '单词数',
    color: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 text-orange-700',
  },
  totalLengthNoNewline: {
    label: '文本总长（不含换行）',
    color: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200 text-red-700',
  },
  totalLengthNoNewlineNoWidth: {
    label: '文本总长（不含换行,不区分全/半角）',
    color: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-700',
  },
  chineseCount: {
    label: '中文',
    color: 'bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 text-teal-700',
  },
  letterCount: {
    label: '字母',
    color: 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-700',
  },
  numberCount: {
    label: '数字',
    color: 'bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 text-pink-700',
  },
  spaceCount: {
    label: '空格',
    color: 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 text-gray-700',
  },
  halfWidthCount: {
    label: '半角',
    color: 'bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200 text-cyan-700',
  },
  fullWidthCount: {
    label: '全角',
    color: 'bg-gradient-to-br from-lime-50 to-lime-100 border-lime-200 text-lime-700',
  },
  newlineCount: {
    label: '换行',
    color: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 text-amber-700',
  },
}

/* ---------- 工具函数 ---------- */
const ensureInput = () => {
  if (!inputText.value.trim()) {
    toast.error('请输入要转换的文本')
    return false
  }
  return true
}

const handleRemoveSpaces = () => {
  if (!ensureInput()) return
  inputText.value = removeSpaces(inputText.value)
  toast.success('已清除所有空格')
}

// 压缩文本（移除所有空格和换行符）
const handleCompressText = () => {
  if (!ensureInput()) return
  inputText.value = compressText(inputText.value)
  toast.success('已压缩文本')
}

// 去除重复行
const handleRemoveDuplicateLines = () => {
  if (!ensureInput()) return
  inputText.value = removeDuplicateLines(inputText.value)
  toast.success('已去除重复行')
}

const clearInput = () => {
  inputText.value = ''
  toast.success('已清空')
}

const pasteText = async () => {
  try {
    loading.value = true
    loadingMessage.value = '粘贴中...'
    inputText.value = await navigator.clipboard.readText()
    toast.success('已粘贴')
  } catch {
    toast.error('粘贴失败')
  } finally {
    loading.value = false
    loadingMessage.value = ''
  }
}

const copyText = async () => {
  if (!ensureInput()) return
  toastCopy(inputText.value, '', {
    onLoading: (isLoading) => {
      loading.value = isLoading
      loadingMessage.value = isLoading ? '复制中...' : ''
    },
  })
}

/* ---------- 文本转换 ---------- */
const handleConvertCase = (type: CaseType) => {
  if (!ensureInput()) return
  inputText.value = convertCase(inputText.value, type)
  toast.success('转换成功')
}

/* ---------- 命名法 ---------- */
const handleConvertNaming = (type: NamingType) => {
  if (!ensureInput()) return
  inputText.value = convertNaming(inputText.value, type)
  toast.success(`${type} 转换成功`)
}

/* ---------- 拼音 ---------- */
const convertPinyin = (style: number, msg: string) => {
  if (!ensureInput()) return
  try {
    const result = pinyin(inputText.value, { style, heteronym: false, segment: true })
    inputText.value = result.map((item) => item[0]).join(' ')
    toast.success(msg)
  } catch {
    toast.error('拼音转换失败')
  }
}

/* ---------- 按钮配置 ---------- */
const clipboardButtons = [
  { text: '粘贴', method: pasteText, class: 'px-3 py-2 bg-blue-500 text-white rounded text-sm' },
  { text: '复制', method: copyText, class: 'px-3 py-2 bg-green-500 text-white rounded text-sm' },
  {
    text: '清除空格',
    method: handleRemoveSpaces,
    class: 'px-3 py-2 bg-amber-500 text-white rounded text-sm',
  },
  {
    text: '压缩',
    method: handleCompressText,
    class: 'px-3 py-2 bg-orange-500 text-white rounded text-sm',
  },
  {
    text: '去除重复行',
    method: handleRemoveDuplicateLines,
    class: 'px-3 py-2 bg-indigo-500 text-white rounded text-sm',
  },
  { text: '清空', method: clearInput, class: 'px-3 py-2 bg-gray-600 text-white rounded text-sm' },
]

const transformButtons = [
  {
    text: '全部大写',
    method: () => handleConvertCase('upper'),
    class: 'px-3 py-2 bg-red-500 text-white rounded text-sm',
  },
  {
    text: '全部小写',
    method: () => handleConvertCase('lower'),
    class: 'px-3 py-2 bg-green-500 text-white rounded text-sm',
  },
  {
    text: '首字母大写',
    method: () => handleConvertCase('firstUpper'),
    class: 'px-3 py-2 bg-blue-500 text-white rounded text-sm',
  },
  {
    text: '首字母小写',
    method: () => handleConvertCase('firstLower'),
    class: 'px-3 py-2 bg-purple-500 text-white rounded text-sm',
  },
  {
    text: '句子首字母',
    method: () => handleConvertCase('sentence'),
    class: 'px-3 py-2 bg-yellow-500 text-white rounded text-sm',
  },
  {
    text: '标题大小写',
    method: () => handleConvertCase('title'),
    class: 'px-3 py-2 bg-indigo-500 text-white rounded text-sm',
  },
  {
    text: 'camelCase',
    method: () => handleConvertNaming('camel'),
    class: 'px-3 py-2 bg-pink-500 text-white rounded text-sm',
  },
  {
    text: 'snake_case',
    method: () => handleConvertNaming('snake'),
    class: 'px-3 py-2 bg-teal-500 text-white rounded text-sm',
  },
  {
    text: 'kebab-case',
    method: () => handleConvertNaming('kebab'),
    class: 'px-3 py-2 bg-orange-500 text-white rounded text-sm',
  },
]

const pinyinButtons = [
  {
    text: '拼音',
    method: () => convertPinyin(pinyin.STYLE_NORMAL, '已转换为拼音'),
    class: 'px-3 py-2 bg-cyan-500 text-white rounded text-sm',
  },
  {
    text: '带声调拼音',
    method: () => convertPinyin(pinyin.STYLE_TONE, '已转换为带声调拼音'),
    class: 'px-3 py-2 bg-emerald-500 text-white rounded text-sm',
  },
  {
    text: '拼音首字母',
    method: () => convertPinyin(pinyin.STYLE_FIRST_LETTER, '已转换为拼音首字母'),
    class: 'px-3 py-2 bg-lime-500 text-white rounded text-sm',
  },
]
</script>
