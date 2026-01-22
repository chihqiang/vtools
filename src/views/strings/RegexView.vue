<template>
  <div class="max-w-7xl mx-auto px-4 py-6">
    <div class="bg-white rounded-lg shadow-md p-6">
      <!-- 标题 -->
      <div class="mb-8 text-center">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">正则表达式工具</h1>
        <p class="text-gray-600">测试、验证和生成正则表达式</p>
      </div>

      <!-- 主要内容区域 -->
      <div class="grid grid-cols-1 gap-8">
        <!-- 上部：输入和操作区域 -->
        <div class="border border-gray-300 rounded-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-gray-700">正则表达式</h3>
            <div class="flex space-x-2">
              <button
                @click="pasteRegex"
                class="px-3 py-2 bg-blue-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
              >
                粘贴
              </button>
              <button
                @click="copyRegex"
                class="px-3 py-2 bg-green-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
              >
                复制
              </button>
              <button
                @click="clearAll"
                class="px-3 py-2 bg-gray-600 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
              >
                清空
              </button>
            </div>
          </div>

          <!-- 正则表达式输入 -->
          <div class="mb-4">
            <h4 class="font-medium text-gray-700 mb-2">正则表达式</h4>
            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <input
                v-model="regexPattern"
                placeholder="请输入正则表达式，例如: ^[a-zA-Z0-9]+$"
                class="w-full p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <!-- 常用正则表达式元字符和模式 -->
          <div class="mb-6">
            <h4 class="font-medium text-gray-700 mb-2">常用匹配模式</h4>
            <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="(meta, index) in regexMetaCharacters"
                  :key="index"
                  @click="addMetaCharacter(meta.pattern)"
                  class="px-3 py-1.5 bg-blue-50 text-gray-900 rounded-full text-sm hover:bg-blue-100 hover:text-gray-900 transition-all duration-150 shadow-sm"
                  :title="meta.description"
                >
                  <code class="font-mono">{{ meta.pattern }}</code>
                </button>
              </div>
            </div>
          </div>

          <!-- 常用正则表达式示例 -->
          <div class="mb-6">
            <h3 class="font-semibold text-gray-700 mb-3">常用正则表达式</h3>
            <div
              class="border border-gray-200 rounded-lg p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2"
            >
              <button
                v-for="(example, index) in commonRegexPatterns"
                :key="index"
                @click="useExample(example.pattern)"
                class="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-md text-sm hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              >
                {{ example.description }}
              </button>
            </div>
          </div>

          <!-- 测试文本 -->
          <div class="mb-6">
            <h3 class="font-semibold text-gray-700 mb-3">测试文本</h3>
            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <textarea
                v-model="testText"
                placeholder="请输入要测试的文本"
                class="w-full p-4 font-mono text-sm resize-y min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <!-- 正则表达式标志 -->
            <div class="mt-3 flex flex-wrap gap-3">
              <label class="flex items-center space-x-2">
                <input
                  type="checkbox"
                  v-model="regexFlags.global"
                  class="rounded text-blue-500 focus:ring-blue-500"
                />
                <span class="text-sm text-gray-700">全局匹配 (g)</span>
              </label>
              <label class="flex items-center space-x-2">
                <input
                  type="checkbox"
                  v-model="regexFlags.ignoreCase"
                  class="rounded text-blue-500 focus:ring-blue-500"
                />
                <span class="text-sm text-gray-700">忽略大小写 (i)</span>
              </label>
              <label class="flex items-center space-x-2">
                <input
                  type="checkbox"
                  v-model="regexFlags.multiline"
                  class="rounded text-blue-500 focus:ring-blue-500"
                />
                <span class="text-sm text-gray-700">多行模式 (m)</span>
              </label>
              <label class="flex items-center space-x-2">
                <input
                  type="checkbox"
                  v-model="regexFlags.dotAll"
                  class="rounded text-blue-500 focus:ring-blue-500"
                />
                <span class="text-sm text-gray-700">点号匹配所有 (s)</span>
              </label>
            </div>
          </div>

          <!-- 操作区域 -->
          <div class="mb-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                @click="testRegex"
                class="px-4 py-2 bg-blue-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
              >
                测试匹配
              </button>
              <button
                @click="validateRegex"
                class="px-4 py-2 bg-green-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
              >
                验证表达式
              </button>
              <button
                @click="generateRegex"
                class="px-4 py-2 bg-purple-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
              >
                生成表达式
              </button>
            </div>
          </div>
        </div>

        <!-- 下部：结果显示区域 -->
        <div class="border border-gray-300 rounded-lg p-6">
          <h3 class="font-semibold text-gray-700 mb-3">测试结果</h3>

          <!-- 匹配结果 -->
          <div v-if="matchResults.length > 0" class="mb-4">
            <p class="text-sm text-gray-600 mb-2">匹配到 {{ matchResults.length }} 个结果:</p>
            <div class="border border-gray-300 rounded-lg max-h-[300px] overflow-y-auto">
              <table class="w-full">
                <thead class="bg-gray-50 sticky top-0">
                  <tr>
                    <th
                      class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      序号
                    </th>
                    <th
                      class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      匹配内容
                    </th>
                    <th
                      class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      位置
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="(result, index) in matchResults" :key="index">
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {{ index + 1 }}
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm font-mono text-blue-600">
                      {{ result.text }}
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {{ result.index }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 验证结果 -->
          <div
            v-if="validationResult"
            class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <p class="text-sm text-green-600">{{ validationResult }}</p>
          </div>

          <!-- 错误信息 -->
          <div v-if="errorMessage" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600">{{ errorMessage }}</p>
          </div>
        </div>
      </div>

      <!-- 正则表达式详解 -->
      <div class="mt-12">
        <h2 class="text-xl font-bold text-gray-800 mb-4">正则表达式详解</h2>
        <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-700 mb-3">基本语法</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <p class="text-sm font-mono text-gray-700">^</p>
              <p class="text-xs text-gray-500">匹配字符串开头</p>
            </div>
            <div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <p class="text-sm font-mono text-gray-700">$</p>
              <p class="text-xs text-gray-500">匹配字符串结尾</p>
            </div>
            <div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <p class="text-sm font-mono text-gray-700">.</p>
              <p class="text-xs text-gray-500">匹配任意字符（除换行符）</p>
            </div>
            <div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <p class="text-sm font-mono text-gray-700">*</p>
              <p class="text-xs text-gray-500">匹配前面的表达式 0 次或多次</p>
            </div>
            <div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <p class="text-sm font-mono text-gray-700">+</p>
              <p class="text-xs text-gray-500">匹配前面的表达式 1 次或多次</p>
            </div>
            <div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <p class="text-sm font-mono text-gray-700">?</p>
              <p class="text-xs text-gray-500">匹配前面的表达式 0 次或 1 次</p>
            </div>
          </div>

          <h3 class="text-lg font-semibold text-gray-700 mb-3">字符类</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <p class="text-sm font-mono text-gray-700">[abc]</p>
              <p class="text-xs text-gray-500">匹配方括号内的任意字符</p>
            </div>
            <div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <p class="text-sm font-mono text-gray-700">[^abc]</p>
              <p class="text-xs text-gray-500">匹配除方括号内字符外的任意字符</p>
            </div>
            <div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <p class="text-sm font-mono text-gray-700">[a-z]</p>
              <p class="text-xs text-gray-500">匹配 a 到 z 之间的任意字符</p>
            </div>
            <div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <p class="text-sm font-mono text-gray-700">[A-Z]</p>
              <p class="text-xs text-gray-500">匹配 A 到 Z 之间的任意字符</p>
            </div>
            <div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <p class="text-sm font-mono text-gray-700">[0-9]</p>
              <p class="text-xs text-gray-500">匹配 0 到 9 之间的任意字符</p>
            </div>
            <div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <p class="text-sm font-mono text-gray-700">\d</p>
              <p class="text-xs text-gray-500">匹配数字，等同于 [0-9]</p>
            </div>
          </div>

          <h3 class="text-lg font-semibold text-gray-700 mb-3">常用示例</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <p class="text-sm font-mono text-gray-700">^[a-zA-Z0-9]+$</p>
              <p class="text-xs text-gray-500">匹配字母和数字</p>
            </div>
            <div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <p class="text-sm font-mono text-gray-700">
                ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$
              </p>
              <p class="text-xs text-gray-500">匹配电子邮件地址</p>
            </div>
            <div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <p class="text-sm font-mono text-gray-700">^1[3-9]\d{9}$</p>
              <p class="text-xs text-gray-500">匹配中国大陆手机号</p>
            </div>
            <div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <p class="text-sm font-mono text-gray-700">^\d{4}-\d{2}-\d{2}$</p>
              <p class="text-xs text-gray-500">匹配日期格式 (YYYY-MM-DD)</p>
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
import { toastCopy } from '@/utils/clipboard'

const toast = useToast()
const regexPattern = ref('')
const testText = ref('')
const matchResults = ref<{ text: string; index: number }[]>([])
const validationResult = ref('')
const errorMessage = ref('')

// 正则表达式标志
const regexFlags = ref({
  global: true,
  ignoreCase: false,
  multiline: false,
  dotAll: false,
})

// 生成标志字符串
const getFlagsString = () => {
  let flags = ''
  if (regexFlags.value.global) flags += 'g'
  if (regexFlags.value.ignoreCase) flags += 'i'
  if (regexFlags.value.multiline) flags += 'm'
  if (regexFlags.value.dotAll) flags += 's'
  return flags
}

// 常用正则表达式元字符和模式
const regexMetaCharacters = ref([
  { pattern: '.', description: '匹配任意字符' },
  { pattern: '^', description: '匹配开始位置' },
  { pattern: '$', description: '匹配结束位置' },
  { pattern: '*', description: '匹配0次或多次' },
  { pattern: '+', description: '匹配1次或多次' },
  { pattern: '?', description: '匹配0次或1次' },
  { pattern: '{n}', description: '匹配n次' },
  { pattern: '{n,}', description: '匹配至少n次' },
  { pattern: '{n,m}', description: '匹配n到m次' },
  { pattern: '[abc]', description: '匹配a、b或c' },
  { pattern: '[^abc]', description: '匹配除a、b、c外的字符' },
  { pattern: '\\d', description: '匹配数字' },
  { pattern: '\\D', description: '匹配非数字' },
  { pattern: '\\w', description: '匹配字母、数字、下划线' },
  { pattern: '\\W', description: '匹配非字母、数字、下划线' },
  { pattern: '\\s', description: '匹配空白字符' },
  { pattern: '\\S', description: '匹配非空白字符' },
  { pattern: '|', description: '或操作符' },
  { pattern: '(...)', description: '捕获组' },
  { pattern: '(?:...)', description: '非捕获组' },
])

// 常用正则表达式示例
const commonRegexPatterns = ref([
  { pattern: '^[a-zA-Z0-9]+$', description: '字母和数字' },
  { pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', description: '电子邮件' },
  { pattern: '^1[3-9]\\d{9}$', description: '中国大陆手机号' },
  { pattern: '^\\d{4}-\\d{2}-\\d{2}$', description: '日期 (YYYY-MM-DD)' },
  { pattern: '^\\d{17}[\\dXx]$', description: '身份证号' },
  {
    pattern: '^https?:\\/\\/[\\w\\-]+(\\.[\\w\\-]+)+([\\w\\-.,@?^=%&:/~+#]*[\\w\\-@?^=%&/~+#])?$',
    description: 'URL地址',
  },
  { pattern: '^\\d{6}$', description: '邮政编码' },
  { pattern: '^[A-Za-z0-9]{6,16}$', description: '密码强度' },
  { pattern: '^\\d{3,4}-?\\d{7,8}$', description: '固定电话' },
  {
    pattern:
      '^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
    description: 'IP地址 (IPv4)',
  },
  { pattern: '^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\\.[a-zA-Z]{2,}$', description: '域名' },
  { pattern: '^\\d{4} \\d{4} \\d{4} \\d{4}$|^\\d{16}$', description: '信用卡号' },
  { pattern: '^[\\u4e00-\\u9fa5]+$', description: '中文字符' },
  { pattern: '^-?\\d+$', description: '整数' },
  { pattern: '^-?\\d+\\.\\d+$', description: '小数' },
  { pattern: '^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$', description: '十六进制颜色码' },
  { pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$', description: '时间 (HH:MM:SS)' },
  { pattern: '^[a-zA-Z0-9_-]{3,16}$', description: '用户名' },
  { pattern: '^\\d{16,19}$', description: '银行卡号' },
])

// 使用示例表达式
const useExample = (pattern: string) => {
  regexPattern.value = pattern
  toast.success('已使用示例表达式')
}

// 添加正则表达式元字符
const addMetaCharacter = (pattern: string) => {
  regexPattern.value += pattern
}

/* ---------- 剪贴板 ---------- */

const pasteRegex = async () => {
  try {
    regexPattern.value = await navigator.clipboard.readText()
    toast.success('已粘贴')
  } catch {
    toast.error('粘贴失败')
  }
}

const copyRegex = async () => {
  if (!regexPattern.value.trim()) {
    toast.warning('请先输入或生成内容')
    return
  }
  toastCopy(regexPattern.value)
}

const clearAll = () => {
  regexPattern.value = ''
  testText.value = ''
  matchResults.value = []
  validationResult.value = ''
  errorMessage.value = ''
  toast.success('已清空')
}

/* ---------- 正则表达式功能 ---------- */

const ensureInput = () => {
  if (!regexPattern.value.trim()) {
    toast.warning('请先输入正则表达式')
    return false
  }
  return true
}

const testRegex = () => {
  if (!ensureInput()) return
  if (!testText.value.trim()) {
    toast.warning('请输入要测试的文本')
    return
  }

  try {
    const flags = getFlagsString()
    const regex = new RegExp(regexPattern.value, flags)
    const results: { text: string; index: number }[] = []
    let match

    if (regex.global) {
      while ((match = regex.exec(testText.value)) !== null) {
        results.push({ text: match[0], index: match.index })
        // 防止零宽度匹配导致的无限循环
        if (match.index === regex.lastIndex) {
          regex.lastIndex++
        }
      }
    } else {
      match = regex.exec(testText.value)
      if (match) {
        results.push({ text: match[0], index: match.index })
      }
    }

    matchResults.value = results
    validationResult.value = ''
    errorMessage.value = ''
    toast.success(`测试完成，匹配到 ${results.length} 个结果`)
  } catch (error: unknown) {
    errorMessage.value = error instanceof Error ? error.message : '未知错误'
    matchResults.value = []
    validationResult.value = ''
    toast.error('测试失败')
  }
}

const validateRegex = () => {
  if (!ensureInput()) return

  try {
    const flags = getFlagsString()
    new RegExp(regexPattern.value, flags)
    validationResult.value = `正则表达式有效 (标志: ${flags || '无'})`
    errorMessage.value = ''
    matchResults.value = []
    toast.success('验证成功')
  } catch (error: unknown) {
    errorMessage.value = error instanceof Error ? error.message : '未知错误'
    validationResult.value = ''
    matchResults.value = []
    toast.error('验证失败')
  }
}

// 生成正则表达式
const generateRegex = () => {
  // 简单的正则表达式生成
  // 这里实现一个基于常见模式的生成器
  const patterns = [
    { pattern: '^[a-zA-Z0-9]+$', description: '字母和数字' },
    { pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', description: '电子邮件' },
    { pattern: '^1[3-9]\\d{9}$', description: '中国大陆手机号' },
    { pattern: '^\\d{4}-\\d{2}-\\d{2}$', description: '日期 (YYYY-MM-DD)' },
    { pattern: '^\\d{17}[\\dXx]$', description: '身份证号' },
    {
      pattern: '^https?:\\/\\/[\\w\\-]+(\\.[\\w\\-]+)+([\\w\\-.,@?^=%&:/~+#]*[\\w\\-@?^=%&/~+#])?$',
      description: 'URL地址',
    },
    { pattern: '^\\d{6}$', description: '邮政编码' },
    { pattern: '^[A-Za-z0-9]{6,16}$', description: '密码强度' },
    { pattern: '^\\d{3,4}-?\\d{7,8}$', description: '固定电话' },
    { pattern: '^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$', description: 'IPv4地址' },
    {
      pattern: '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$',
      description: 'UUID',
    },
    { pattern: '^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$', description: '十六进制颜色' },
  ]

  // 随机选择一个模式
  const randomIndex = Math.floor(Math.random() * patterns.length)
  const randomPattern = patterns[randomIndex]
  if (randomPattern) {
    regexPattern.value = randomPattern.pattern
    toast.success(`生成了正则表达式: ${randomPattern.description}`)
  } else {
    toast.error('生成失败，请重试')
  }
}
</script>

<style scoped></style>
