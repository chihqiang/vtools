<template>
  <div class="bg-white rounded-lg shadow-md p-6 h-full">
    <!-- 输入区 -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-semibold text-gray-700">文本内容</h3>
        <div class="flex flex-wrap gap-2">
          <button
            @click="pasteText"
            class="px-3 py-2 bg-blue-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            粘贴
          </button>
          <button
            @click="copyText"
            class="px-3 py-2 bg-green-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            复制
          </button>
          <button
            @click="removeSpaces"
            class="px-3 py-2 bg-amber-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            清除空格
          </button>
          <button
            @click="clearInput"
            class="px-3 py-2 bg-gray-600 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            清空
          </button>
        </div>
      </div>

      <div class="border border-gray-300 rounded-lg overflow-hidden">
        <textarea
          v-model="inputText"
          placeholder="请输入文本，然后选择转换方式..."
          class="w-full min-h-[400px] p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>
    </div>

    <!-- 转换区 -->
    <div class="mt-6">
      <h3 class="font-semibold text-gray-700 mb-3">转换方式</h3>
      <div class="border border-gray-300 rounded-lg p-4">
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
          <button
            @click="toUpper"
            class="px-3 py-2 bg-red-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            全部大写
          </button>
          <button
            @click="toLower"
            class="px-3 py-2 bg-green-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            全部小写
          </button>
          <button
            @click="firstUpper"
            class="px-3 py-2 bg-blue-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            首字母大写
          </button>
          <button
            @click="firstLower"
            class="px-3 py-2 bg-purple-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            首字母小写
          </button>
          <button
            @click="sentenceCase"
            class="px-3 py-2 bg-yellow-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            句子首字母
          </button>
          <button
            @click="titleCase"
            class="px-3 py-2 bg-indigo-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            标题大小写
          </button>
          <button
            @click="camelCase"
            class="px-3 py-2 bg-pink-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            camelCase
          </button>
          <button
            @click="snakeCase"
            class="px-3 py-2 bg-teal-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            snake_case
          </button>
          <button
            @click="kebabCase"
            class="px-3 py-2 bg-orange-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            kebab-case
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
            @click="toPinyin"
            class="px-3 py-2 bg-cyan-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            拼音
          </button>
          <button
            @click="toPinyinWithTone"
            class="px-3 py-2 bg-emerald-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            带声调拼音
          </button>
          <button
            @click="toPinyinInitials"
            class="px-3 py-2 bg-lime-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            拼音首字母
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/composables/useToast'
import pinyin from 'pinyin'

const toast = useToast()
const inputText = ref('')

/* ---------- 工具 ---------- */

const ensureInput = () => {
  if (!inputText.value.trim()) {
    toast.error('请输入要转换的文本')
    return false
  }
  return true
}

/* ---------- 基础转换 ---------- */

const toUpper = () => {
  if (!ensureInput()) return
  inputText.value = inputText.value.toUpperCase()
  toast.success('已转换为大写')
}

const toLower = () => {
  if (!ensureInput()) return
  inputText.value = inputText.value.toLowerCase()
  toast.success('已转换为小写')
}

const firstUpper = () => {
  if (!ensureInput()) return
  inputText.value = inputText.value.charAt(0).toUpperCase() + inputText.value.slice(1)
  toast.success('首字母已大写')
}

const firstLower = () => {
  if (!ensureInput()) return
  inputText.value = inputText.value.charAt(0).toLowerCase() + inputText.value.slice(1)
  toast.success('首字母已小写')
}

/* ---------- 句子 / 标题 ---------- */

const sentenceCase = () => {
  if (!ensureInput()) return
  inputText.value = inputText.value
    .toLowerCase()
    .replace(/(^|[.!?\n]\s*)([a-z])/g, (_, s, c) => s + c.toUpperCase())
  toast.success('句子首字母已大写')
}

const titleCase = () => {
  if (!ensureInput()) return

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

  const words = inputText.value.toLowerCase().split(/\s+/)
  inputText.value = words
    .map((w, i) =>
      i === 0 || i === words.length - 1 || !ignore.has(w)
        ? w.charAt(0).toUpperCase() + w.slice(1)
        : w,
    )
    .join(' ')

  toast.success('标题大小写转换成功')
}

/* ---------- 命名法 ---------- */

const extractWords = () =>
  inputText.value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)

const camelCase = () => {
  if (!ensureInput()) return
  const words = extractWords()
  if (!words.length) return toast.error('没有有效单词')
  inputText.value =
    words[0] +
    words
      .slice(1)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join('')
  toast.success('camelCase 转换成功')
}

const snakeCase = () => {
  if (!ensureInput()) return
  inputText.value = extractWords().join('_')
  toast.success('snake_case 转换成功')
}

const kebabCase = () => {
  if (!ensureInput()) return
  inputText.value = extractWords().join('-')
  toast.success('kebab-case 转换成功')
}

/* ---------- 拼音转换 ---------- */

const toPinyin = () => {
  if (!ensureInput()) return
  try {
    const result = pinyin(inputText.value, {
      style: pinyin.STYLE_NORMAL,
      heteronym: false,
      segment: true,
    })
    inputText.value = result.map((item: string[]) => item[0]).join(' ')
    toast.success('已转换为拼音')
  } catch (error) {
    console.error('拼音转换失败:', error)
    toast.error('拼音转换失败')
  }
}

const toPinyinWithTone = () => {
  if (!ensureInput()) return
  try {
    const result = pinyin(inputText.value, {
      style: pinyin.STYLE_TONE,
      heteronym: false,
      segment: true,
    })
    inputText.value = result.map((item: string[]) => item[0]).join(' ')
    toast.success('已转换为带声调拼音')
  } catch (error) {
    console.error('拼音转换失败:', error)
    toast.error('拼音转换失败')
  }
}

const toPinyinInitials = () => {
  if (!ensureInput()) return
  try {
    const result = pinyin(inputText.value, {
      style: pinyin.STYLE_FIRST_LETTER,
      heteronym: false,
      segment: true,
    })
    inputText.value = result.map((item: string[]) => item[0]).join(' ')
    toast.success('已转换为拼音首字母')
  } catch (error) {
    console.error('拼音转换失败:', error)
    toast.error('拼音转换失败')
  }
}

/* ---------- 剪贴板 ---------- */

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
</script>
