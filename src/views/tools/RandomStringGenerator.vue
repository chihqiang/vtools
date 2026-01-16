<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
    <div class="max-w-7xl mx-auto">
      <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-4 md:p-6 mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex items-center gap-3">
            <svg class="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m2 0a2 2 0 01-2-2m2 0a2 2 0 01-2-2m2 0a2 2 0 01-2-2M9 7a2 2 0 012 2m2 0a2 2 0 01-2-2m2 0a2 2 0 01-2-2m2 0a2 2 0 01-2-2" />
            </svg>
            <h1 class="text-xl md:text-2xl font-bold text-gray-900">随机字符串生成器</h1>
          </div>
          <button
            @click="generateRandomStrings"
            :disabled="generating"
            class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg v-if="!generating" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7m7 0V3l-9 11m0 0v7m0 0h9" />
            </svg>
            <svg v-else class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ generating ? '生成中...' : '生成' }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 左侧参数设置 -->
        <div class="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <div class="flex items-center gap-2 mb-6">
            <svg class="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c-.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c1.756-.426 1.756-2.924 0-3.35a1.724 1.724 0 002.573-1.066c1.543.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35z" />
            </svg>
            <h2 class="text-lg font-semibold text-gray-900">参数设置</h2>
          </div>

          <div class="space-y-6">
            <!-- 字符串长度 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">字符串长度</label>
              <div class="flex items-center gap-3">
                <input
                  v-model="length"
                  type="range"
                  min="1"
                  max="128"
                  class="flex-1"
                />
                <span class="w-12 text-center text-sm font-mono bg-gray-100 px-2 py-1 rounded">{{ length }}</span>
              </div>
            </div>

            <!-- 字符类型 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">字符类型</label>
              <div class="space-y-3">
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    v-model="includeUppercase"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span class="text-sm text-gray-700">大写字母 (A-Z)</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    v-model="includeLowercase"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span class="text-sm text-gray-700">小写字母 (a-z)</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    v-model="includeNumbers"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span class="text-sm text-gray-700">数字 (0-9)</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    v-model="includeSpecialChars"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span class="text-sm text-gray-700">特殊字符 (!@#$%^&amp;*^&amp;*()-_=+[]{}|;:'",.&lt;&gt;/?)</span>
                </label>
              </div>
            </div>

            <!-- 生成数量 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">生成数量</label>
              <div class="flex items-center gap-3">
                <input
                  v-model="count"
                  type="range"
                  min="1"
                  max="20"
                  class="flex-1"
                />
                <span class="w-12 text-center text-sm font-mono bg-gray-100 px-2 py-1 rounded">{{ count }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧显示结果 -->
        <div class="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <div class="flex items-center gap-2 mb-6">
            <svg class="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 5 1 0 01.707.293l5.414 5.414a1 5 1 0 01.707.293H19a2 2 0 002-2v-6a2 2 0 00-2-2H7a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
            <h2 class="text-lg font-semibold text-gray-900">生成结果</h2>
          </div>

          <div v-if="!randomStrings.length" class="text-center py-12">
            <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 002 2H6a2 2 0 01-2-2v-7m16 0v7a2 2 0 002 2z" />
            </svg>
            <p class="text-gray-500">点击"生成"按钮创建随机字符串</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="(str, index) in randomStrings"
              :key="index"
              class="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div class="flex items-start justify-between gap-2">
                <span class="text-sm font-mono text-gray-900 break-all flex-1">{{ str }}</span>
                <button
                  @click="copyToClipboard(str, `字符串 ${index + 1}`)"
                  class="p-1.5 bg-gray-200 rounded hover:bg-gray-300 transition-colors flex-shrink-0"
                  title="复制"
                >
                  <svg class="w-3.5 h-3.5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/composables/useToast'

const toast = useToast()
const generating = ref(false)
const length = ref(32)
const count = ref(1)
const includeUppercase = ref(true)
const includeLowercase = ref(true)
const includeNumbers = ref(true)
const includeSpecialChars = ref(true)
const randomStrings = ref<string[]>([])

const generateRandomStrings = () => {
  if (!includeUppercase.value && !includeLowercase.value && !includeNumbers.value && !includeSpecialChars.value) {
    toast.error('请至少选择一种字符类型')
    return
  }

  generating.value = true
  randomStrings.value = []

  try {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
    const numberChars = '0123456789'
    const specialChars = '!@#$%^&*^&*()-_=+[]{}|;:\'",.<>/?'

    let charset = ''
    if (includeUppercase.value) charset += uppercaseChars
    if (includeLowercase.value) charset += lowercaseChars
    if (includeNumbers.value) charset += numberChars
    if (includeSpecialChars.value) charset += specialChars

    for (let i = 0; i < count.value; i++) {
      let randomString = ''
      for (let j = 0; j < length.value; j++) {
        const randomIndex = Math.floor(Math.random() * charset.length)
        randomString += charset[randomIndex]
      }
      randomStrings.value.push(randomString)
    }
  } catch (error) {
    console.error('生成随机字符串失败:', error)
    toast.error('生成失败，请重试')
  } finally {
    generating.value = false
  }
}

const copyToClipboard = (text: string, label: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      toast.success(`${label}已复制到剪贴板`)
    })
    .catch(() => {
      toast.error('复制失败')
    })
}
</script>