<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-4 md:p-6 mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex items-center gap-3">
            <svg
              class="w-8 h-8 text-blue-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 7a2 2 0 012 2m2 0a2 2 0 01-2-2M9 7a2 2 0 012 2"
              />
            </svg>
            <h1 class="text-xl md:text-2xl font-bold text-gray-900">随机字符串生成器</h1>
          </div>

          <button
            @click="generateRandomStrings"
            :disabled="generating"
            class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              v-if="!generating"
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7"
              />
            </svg>

            <svg
              v-else
              class="w-4 h-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9"
              />
            </svg>

            {{ generating ? '生成中...' : '生成' }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 参数设置 -->
        <div class="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">参数设置</h2>

          <div class="space-y-6">
            <!-- 长度 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"> 字符串长度 </label>
              <div class="flex items-center gap-3">
                <input v-model.number="length" type="range" min="1" max="128" class="flex-1" />
                <span class="w-12 text-center text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                  {{ length }}
                </span>
              </div>
            </div>

            <!-- 字符类型 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3"> 字符类型 </label>
              <div class="space-y-3">
                <label class="flex items-center gap-3 cursor-pointer">
                  <input v-model="includeUppercase" type="checkbox" class="w-4 h-4 text-blue-600" />
                  <span class="text-sm">大写字母 (A-Z)</span>
                </label>

                <label class="flex items-center gap-3 cursor-pointer">
                  <input v-model="includeLowercase" type="checkbox" class="w-4 h-4 text-blue-600" />
                  <span class="text-sm">小写字母 (a-z)</span>
                </label>

                <label class="flex items-center gap-3 cursor-pointer">
                  <input v-model="includeNumbers" type="checkbox" class="w-4 h-4 text-blue-600" />
                  <span class="text-sm">数字 (0-9)</span>
                </label>

                <div>
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input
                      v-model="includeSpecialChars"
                      type="checkbox"
                      class="w-4 h-4 text-blue-600"
                    />
                    <span class="text-sm"> 特殊字符 (自定义) </span>
                  </label>
                  <div v-if="includeSpecialChars" class="mt-2 pl-7">
                    <input
                      v-model="customSpecialChars"
                      type="text"
                      placeholder="输入特殊字符，如: !@#$%"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- 数量 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"> 生成数量 </label>
              <div class="flex items-center gap-3">
                <input v-model.number="count" type="range" min="1" max="20" class="flex-1" />
                <span class="w-12 text-center text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                  {{ count }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 结果 -->
        <div class="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">生成结果</h2>

          <div v-if="!randomStrings.length" class="text-center py-12 text-gray-500">
            点击「生成」按钮创建随机字符串
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="(str, index) in randomStrings"
              :key="index"
              class="p-3 bg-gray-50 rounded-lg border hover:border-blue-500 transition"
            >
              <div class="flex items-start gap-2">
                <span class="text-sm font-mono break-all flex-1">
                  {{ str }}
                </span>
                <button
                  @click="copyToClipboard(str, `字符串 ${index + 1}`)"
                  class="p-1.5 bg-gray-200 rounded hover:bg-gray-300"
                  title="复制"
                >
                  📋
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
const length = ref<number>(32)
const count = ref<number>(1)

const includeUppercase = ref(true)
const includeLowercase = ref(true)
const includeNumbers = ref(true)
const includeSpecialChars = ref(true)
const customSpecialChars = ref('!@#$%^&*_')

const randomStrings = ref<string[]>([])

const generateRandomStrings = () => {
  if (generating.value) return

  if (
    !includeUppercase.value &&
    !includeLowercase.value &&
    !includeNumbers.value &&
    !includeSpecialChars.value
  ) {
    toast.error('请至少选择一种字符类型')
    return
  }

  generating.value = true
  randomStrings.value = []

  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'

  // 使用用户自定义的特殊字符
  const special = customSpecialChars.value

  // 如果用户选择了特殊字符但没有输入任何字符，给出警告
  if (includeSpecialChars.value && !special.trim()) {
    toast.warning('请输入特殊字符或取消选择特殊字符选项')
    return
  }

  let charset = ''
  if (includeUppercase.value) charset += uppercase
  if (includeLowercase.value) charset += lowercase
  if (includeNumbers.value) charset += numbers
  if (includeSpecialChars.value && special) charset += special

  try {
    for (let i = 0; i < count.value; i++) {
      let result = ''
      for (let j = 0; j < length.value; j++) {
        result += charset[Math.floor(Math.random() * charset.length)]
      }
      randomStrings.value.push(result)
    }
  } catch (e) {
    console.error(e)
    toast.error('生成失败')
  } finally {
    generating.value = false
  }
}

const copyToClipboard = async (text: string, label: string) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(`${label} 已复制`)
  } catch {
    toast.error('复制失败')
  }
}
</script>
