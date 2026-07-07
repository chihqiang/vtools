<template>
  <div class="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h2 class="text-xl font-bold text-gray-800">加密解密工具</h2>
      <p class="text-sm text-gray-500 mt-1">
        支持 Base64、URL 编码解码及多种哈希算法，输入即见结果
      </p>
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
              @click="toggleCase"
              :disabled="!inputText"
              class="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-md text-sm hover:bg-amber-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              大小写切换
            </button>
            <button
              @click="pasteInput"
              class="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
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
            placeholder="请输入要加密 / 解密的文本..."
            class="w-full flex-1 min-h-[200px] p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            spellcheck="false"
          ></textarea>
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
              title="将结果作为输入，便于链式操作"
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
            class="w-full flex-1 min-h-[200px] p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
            spellcheck="false"
            readonly
          ></textarea>
        </div>
        <p v-if="lastAction" class="mt-2 text-xs text-gray-400">上次操作：{{ lastAction }}</p>
      </div>
    </div>

    <!-- 操作按钮区 -->
    <div class="space-y-4">
      <!-- 编码/解码 -->
      <div>
        <h4 class="text-sm font-medium text-gray-600 mb-2">编码 / 解码</h4>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="btn in encodeButtons"
            :key="btn.text"
            @click="applyAction(btn.fn, btn.text)"
            :disabled="!inputText"
            :class="[
              'px-3 py-2 rounded-md text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed border',
              btn.decode
                ? 'bg-green-50 text-green-700 hover:bg-green-100 border-green-100'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100',
            ]"
          >
            {{ btn.text }}
          </button>
        </div>
      </div>

      <!-- 哈希算法（单向） -->
      <div>
        <h4 class="text-sm font-medium text-gray-600 mb-2">
          哈希算法<span class="text-gray-400 font-normal">（单向，不可逆）</span>
        </h4>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="btn in hashButtons"
            :key="btn.text"
            @click="applyAction(btn.fn, btn.text)"
            :disabled="!inputText"
            class="px-3 py-2 bg-indigo-50 text-indigo-700 rounded-md text-sm hover:bg-indigo-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-indigo-100"
          >
            {{ btn.text }}
          </button>
        </div>
      </div>

      <!-- HMAC -->
      <div>
        <h4 class="text-sm font-medium text-gray-600 mb-2">
          HMAC<span class="text-gray-400 font-normal">（默认密钥：vtools-secret-key）</span>
        </h4>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="btn in hmacButtons"
            :key="btn.text"
            @click="applyAction(btn.fn, btn.text)"
            :disabled="!inputText"
            class="px-3 py-2 bg-orange-50 text-orange-700 rounded-md text-sm hover:bg-orange-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-orange-100"
          >
            {{ btn.text }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/composables/useToast'
import { base64, url } from '@/utils/encoding'
import { md5Hash, sha, ripemd, hmac } from '@/utils/hash'
import { toastCopy } from '@/utils/clipboard'

const toast = useToast()
const inputText = ref('')
const outputText = ref('')
const lastAction = ref('')

/* ---------- 通用操作应用 ---------- */
const applyAction = (fn: (text: string) => string, label: string) => {
  if (!inputText.value.trim()) {
    toast.warning('请先输入文本')
    return
  }
  try {
    outputText.value = fn(inputText.value)
    lastAction.value = label
    toast.success(`${label} 完成`)
  } catch {
    toast.error(`${label} 失败，请确认输入内容`)
  }
}

/* ---------- 剪贴板 ---------- */
const pasteInput = async () => {
  try {
    inputText.value = await navigator.clipboard.readText()
    toast.success('已粘贴')
  } catch {
    toast.error('粘贴失败，请手动 Ctrl+V 粘贴')
  }
}

const copyOutput = async () => {
  if (!outputText.value) {
    toast.warning('没有可复制的内容')
    return
  }
  toastCopy(outputText.value, '转换结果')
}

const clearInput = () => {
  inputText.value = ''
  outputText.value = ''
  lastAction.value = ''
  toast.info('已清空')
}

// 将输出结果作为输入，便于链式操作
const useAsInput = () => {
  inputText.value = outputText.value
  outputText.value = ''
  lastAction.value = ''
  toast.info('已将结果设为输入')
}

/* ---------- 大小写切换 ---------- */
const toggleCase = () => {
  if (!inputText.value.trim()) {
    toast.warning('请先输入文本')
    return
  }
  const hasLowerCase = /[a-z]/.test(inputText.value)
  const hasUpperCase = /[A-Z]/.test(inputText.value)

  if (hasUpperCase && !hasLowerCase) {
    inputText.value = inputText.value.toLowerCase()
    toast.success('已转换为小写')
  } else {
    inputText.value = inputText.value.toUpperCase()
    toast.success('已转换为大写')
  }
}

/* ---------- 按钮配置 ---------- */
const encodeButtons = [
  { text: 'Base64 编码', fn: base64.encrypt, decode: false },
  { text: 'Base64 解码', fn: base64.decrypt, decode: true },
  { text: 'URL 编码', fn: url.encode, decode: false },
  { text: 'URL 解码', fn: url.decode, decode: true },
]

const hashButtons = [
  { text: 'MD5 32位', fn: md5Hash[32] },
  { text: 'MD5 16位', fn: md5Hash[16] },
  { text: 'SHA1', fn: sha.sha1 },
  { text: 'SHA224', fn: sha.sha224 },
  { text: 'SHA256', fn: sha.sha256 },
  { text: 'SHA384', fn: sha.sha384 },
  { text: 'SHA512', fn: sha.sha512 },
  { text: 'SHA3', fn: sha.sha3 },
  { text: 'RIPEMD160', fn: ripemd.ripemd160 },
]

const hmacButtons = [
  { text: 'HMAC-MD5', fn: (t: string) => hmac.md5(t) },
  { text: 'HMAC-SHA1', fn: (t: string) => hmac.sha1(t) },
  { text: 'HMAC-SHA256', fn: (t: string) => hmac.sha256(t) },
]
</script>
