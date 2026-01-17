<template>
  <div class="bg-white rounded-lg shadow-md p-6 h-full">
    <!-- 输入区 -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-semibold text-gray-700">文本内容</h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="btn in clipboardButtons"
            :key="btn.text"
            @click="btn.method"
            :class="btn.class"
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
        ></textarea>
      </div>

      <div class="mt-2 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div
          v-for="(value, key) in textStats"
          :key="key"
          :class="statColors[key]"
          class="rounded-lg p-3 border shadow-sm"
        >
          <div class="text-xs font-medium mb-1 text-gray-600">{{ statLabels[key] }}</div>
          <div class="text-2xl font-bold font-mono">{{ value }}</div>
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

const toast = useToast()
const inputText = ref('')

/* ---------- 文本统计 ---------- */
const textStats = computed(() => {
  const text = inputText.value
  return {
    charCount: text.length,
    byteCount: new Blob([text]).size,
    lineCount: text ? text.split('\n').length : 0,
    wordCount: text.trim() ? text.trim().split(/\s+/).length : 0,
  }
})

const statLabels: Record<string, string> = {
  charCount: '字符数',
  byteCount: '字节数',
  lineCount: '行数',
  wordCount: '单词数',
}

const statColors: Record<string, string> = {
  charCount: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 text-blue-700',
  byteCount: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 text-green-700',
  lineCount: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 text-purple-700',
  wordCount: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 text-orange-700',
}

/* ---------- 工具函数 ---------- */
const ensureInput = () => {
  if (!inputText.value.trim()) {
    toast.error('请输入要转换的文本')
    return false
  }
  return true
}

const removeSpaces = () => {
  if (!ensureInput()) return
  inputText.value = inputText.value.replace(/\s+/g, '')
  toast.success('已清除所有空格')
}

const clearInput = () => {
  inputText.value = ''
  toast.success('已清空')
}

const pasteText = async () => {
  try {
    inputText.value = await navigator.clipboard.readText()
    toast.success('已粘贴')
  } catch {
    toast.error('粘贴失败')
  }
}

const copyText = async () => {
  if (!ensureInput()) return
  try {
    await navigator.clipboard.writeText(inputText.value)
    toast.success('已复制')
  } catch {
    toast.error('复制失败')
  }
}

/* ---------- 文本转换 ---------- */
const convertCase = (type: string) => {
  if (!ensureInput()) return
  let text = inputText.value
  switch (type) {
    case 'upper':
      text = text.toUpperCase()
      break
    case 'lower':
      text = text.toLowerCase()
      break
    case 'firstUpper':
      text = text.charAt(0).toUpperCase() + text.slice(1)
      break
    case 'firstLower':
      text = text.charAt(0).toLowerCase() + text.slice(1)
      break
    case 'sentence':
      text = text.toLowerCase().replace(/(^|[.!?\n]\s*)([a-z])/g, (_, s, c) => s + c.toUpperCase())
      break
    case 'title':
      const ignore = new Set([
        'a',
        'an',
        'the',
        'and',
        'but',
        'or',
        'for',
        'nor',
        'on',
        'at',
        'to',
        'from',
        'by',
        'in',
        'of',
        'with',
        'about',
        'as',
        'into',
        'like',
        'through',
        'after',
        'over',
        'between',
        'out',
        'against',
        'during',
        'before',
        'under',
        'around',
        'among',
      ])
      const words = text.toLowerCase().split(/\s+/)
      text = words
        .map((w, i) =>
          i === 0 || i === words.length - 1 || !ignore.has(w)
            ? w.charAt(0).toUpperCase() + w.slice(1)
            : w,
        )
        .join(' ')
      break
  }
  inputText.value = text
  toast.success('转换成功')
}

/* ---------- 命名法 ---------- */
const extractWords = () =>
  inputText.value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)

const convertNaming = (type: 'camel' | 'snake' | 'kebab') => {
  if (!ensureInput()) return
  const words = extractWords()
  if (!words.length) return toast.error('没有有效单词')

  let result = ''
  if (type === 'camel')
    result =
      words[0] +
      words
        .slice(1)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join('')
  if (type === 'snake') result = words.join('_')
  if (type === 'kebab') result = words.join('-')

  inputText.value = result
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
    method: removeSpaces,
    class: 'px-3 py-2 bg-amber-500 text-white rounded text-sm',
  },
  { text: '清空', method: clearInput, class: 'px-3 py-2 bg-gray-600 text-white rounded text-sm' },
]

const transformButtons = [
  {
    text: '全部大写',
    method: () => convertCase('upper'),
    class: 'px-3 py-2 bg-red-500 text-white rounded text-sm',
  },
  {
    text: '全部小写',
    method: () => convertCase('lower'),
    class: 'px-3 py-2 bg-green-500 text-white rounded text-sm',
  },
  {
    text: '首字母大写',
    method: () => convertCase('firstUpper'),
    class: 'px-3 py-2 bg-blue-500 text-white rounded text-sm',
  },
  {
    text: '首字母小写',
    method: () => convertCase('firstLower'),
    class: 'px-3 py-2 bg-purple-500 text-white rounded text-sm',
  },
  {
    text: '句子首字母',
    method: () => convertCase('sentence'),
    class: 'px-3 py-2 bg-yellow-500 text-white rounded text-sm',
  },
  {
    text: '标题大小写',
    method: () => convertCase('title'),
    class: 'px-3 py-2 bg-indigo-500 text-white rounded text-sm',
  },
  {
    text: 'camelCase',
    method: () => convertNaming('camel'),
    class: 'px-3 py-2 bg-pink-500 text-white rounded text-sm',
  },
  {
    text: 'snake_case',
    method: () => convertNaming('snake'),
    class: 'px-3 py-2 bg-teal-500 text-white rounded text-sm',
  },
  {
    text: 'kebab-case',
    method: () => convertNaming('kebab'),
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
