<template>
  <div class="bg-white rounded-xl shadow-md p-6 h-full">
    <!-- Header -->
    <div class="mb-6 border border-gray-200 rounded-lg p-4">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">JSON 转结构体工具</h2>
          <p class="text-sm text-gray-500 mt-1">将 JSON 数据转换为各种编程语言的结构体定义</p>
        </div>
        <button
          @click="clearAll"
          class="px-4 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors w-fit"
        >
          清空全部
        </button>
      </div>
    </div>

    <!-- 主内容区 - 左右布局 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 左边：输入设置 -->
      <div class="border border-gray-200 rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-gray-700">输入设置</h3>
          <button
            @click="generateStruct"
            :disabled="!jsonInput || !selectedLanguage || !structName"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
          >
            <span v-if="isGenerating">生成中...</span>
            <span v-else>生成结构体</span>
          </button>
        </div>

        <!-- JSON 输入 -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">输入 JSON</label>
          <textarea
            v-model="jsonInput"
            placeholder="请输入 JSON 数据..."
            class="w-full min-h-[300px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none"
          ></textarea>
        </div>

        <!-- 语言选择和结构体名称 -->
        <div class="grid grid-cols-1 gap-4">
          <!-- 语言选择 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">目标语言</label>
            <select
              v-model="selectedLanguage"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="lang in availableLanguages" :key="lang.value" :value="lang.value">
                {{ lang.label }}
              </option>
            </select>
          </div>

          <!-- 结构体名称 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">结构体名称</label>
            <input
              v-model="structName"
              type="text"
              placeholder="例如：Root"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- 高级配置 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">高级配置</label>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- 所有属性可选 -->
              <div>
                <label class="flex items-center gap-2">
                  <input
                    v-model="configOptions.allPropertiesOptional"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <span class="text-sm text-gray-700">所有属性可选</span>
                </label>
              </div>
              <!-- 按字母顺序排列属性 -->
              <div>
                <label class="flex items-center gap-2">
                  <input
                    v-model="configOptions.alphabetizeProperties"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <span class="text-sm text-gray-700">按字母顺序排列属性</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右边：结果显示 -->
      <div class="border border-gray-200 rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-gray-700">生成结果</h3>
          <div class="flex gap-2">
            <button
              @click="copyResult"
              :disabled="!structResult"
              class="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              复制结果
            </button>
            <button
              @click="downloadResult"
              :disabled="!structResult"
              class="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              下载结果
            </button>
          </div>
        </div>

        <!-- 结果显示 -->
        <div
          v-if="structResult"
          class="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[300px]"
        >
          <pre class="font-mono text-sm whitespace-pre-wrap break-words">{{ structResult }}</pre>
        </div>
        <div
          v-else
          class="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[300px] flex items-center justify-center"
        >
          <p class="text-gray-500">请输入 JSON 数据并点击生成按钮</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { quicktype, InputData, jsonInputForTargetLanguage } from 'quicktype-core'
import type { LanguageName } from 'quicktype-core/dist/language/types'
import { useToast } from '@/composables/useToast'
import { toastCopy } from '@/utils/clipboard'

const toast = useToast()

// 输入和设置
const jsonInput = ref('')
const selectedLanguage = ref<LanguageName>('typescript')
const structName = ref('Root')
const structResult = ref('')
const isGenerating = ref(false)
const configOptions = ref({
  allPropertiesOptional: false,
  alphabetizeProperties: true,
})

// 可用语言列表
const availableLanguages = [
  // 常用语言
  { label: 'TypeScript', value: 'typescript' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'Go', value: 'go' },
  { label: 'C#', value: 'csharp' },
  { label: 'Rust', value: 'rust' },
  { label: 'Swift', value: 'swift' },
  { label: 'Kotlin', value: 'kotlin' },
  { label: 'PHP', value: 'php' },
  { label: 'Ruby', value: 'ruby' },
  { label: 'Dart', value: 'dart' },
  { label: 'C++', value: 'c++' },

  // TypeScript 变体
  { label: 'TypeScript Zod', value: 'typescript-zod' },
  { label: 'TypeScript Effect Schema', value: 'typescript-effect-schema' },
  { label: 'Flow', value: 'flow' },

  // JavaScript 变体
  { label: 'JavaScript PropTypes', value: 'javascript-prop-types' },

  // 函数式语言
  { label: 'Elixir', value: 'elixir' },
  { label: 'Elm', value: 'elm' },
  { label: 'Haskell', value: 'haskell' },
  { label: 'Scala 3', value: 'scala3' },

  // 其他
  { label: 'Objective-C', value: 'objective-c' },
  { label: 'Smithy4a', value: 'smithy4a' },
  { label: 'JSON Schema', value: 'json-schema' },
]

// 监听配置变化，自动重新生成
watch(
  [() => configOptions.value, () => selectedLanguage.value, () => structName.value],
  async () => {
    if (jsonInput.value && selectedLanguage.value && structName.value && structResult.value) {
      await generateStruct()
    }
  },
  { deep: true },
)

// 生成结构体
const generateStruct = async () => {
  if (!jsonInput.value || !selectedLanguage.value || !structName.value) return
  if (isGenerating.value) return

  isGenerating.value = true

  try {
    JSON.parse(jsonInput.value)
  } catch {
    toast.error('JSON 格式错误，请检查输入')
    isGenerating.value = false
    return
  }

  try {
    // 使用 quicktype-core 的基本 API
    const inputData = new InputData()
    const jsonInputInstance = jsonInputForTargetLanguage(selectedLanguage.value)
    await jsonInputInstance.addSource({
      name: structName.value,
      samples: [jsonInput.value],
    })
    inputData.addInput(jsonInputInstance)

    const result = await quicktype({
      lang: selectedLanguage.value,
      inputData,
      allPropertiesOptional: configOptions.value.allPropertiesOptional,
      alphabetizeProperties: configOptions.value.alphabetizeProperties,
      indentation: '  ',
      rendererOptions: {
        'just-types': true,
        'acronym-style': 'pascal',
        'sort-properties': configOptions.value.alphabetizeProperties,
      },
    })

    structResult.value = result.lines.join('\n')
    toast.success('生成成功')
  } catch (error) {
    console.error('生成错误:', error)
    toast.error('生成失败，请检查输入或尝试其他语言')
  } finally {
    isGenerating.value = false
  }
}

// 复制结果
const copyResult = () => {
  if (!structResult.value) return
  toastCopy(structResult.value)
}

// 下载结果
const downloadResult = () => {
  if (!structResult.value) return

  const extension = getFileExtension(selectedLanguage.value)
  const blob = new Blob([structResult.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${structName.value}.${extension}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  toast.success('下载成功')
}

// 获取文件扩展名
const getFileExtension = (lang: string): string => {
  const extensions: Record<string, string> = {
    typescript: 'ts',
    javascript: 'js',
    java: 'java',
    csharp: 'cs',
    go: 'go',
    python: 'py',
    swift: 'swift',
    kotlin: 'kt',
    rust: 'rs',
    php: 'php',
    ruby: 'rb',
    dart: 'dart',
  }
  return extensions[lang] || 'txt'
}

// 清空全部
const clearAll = () => {
  jsonInput.value = ''
  structResult.value = ''
  toast.info('已清空全部')
}
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
