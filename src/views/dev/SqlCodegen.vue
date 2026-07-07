<template>
  <div class="bg-white rounded-xl shadow-md p-6">
    <div class="mb-6 border border-gray-200 rounded-lg p-4">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">SQL 转结构体</h2>
          <p class="text-sm text-gray-500 mt-1">
            将 SQL DDL 语句转换为 TypeScript / Go / GORM / XORM 结构体定义
          </p>
        </div>
        <button
          @click="clearAll"
          class="px-4 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 w-fit"
        >
          清空全部
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 左边：输入设置 -->
      <div class="border border-gray-200 rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-gray-700">输入设置</h3>
          <button
            @click="generate"
            :disabled="!sqlInput || !selectedLang"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
          >
            生成结构体
          </button>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">SQL DDL</label>
          <textarea
            v-model="sqlInput"
            placeholder="请输入 SQL DDL 语句..."
            class="w-full min-h-[300px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">目标语言</label>
            <select
              v-model="selectedLang"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="opt in languageOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">数据库方言</label>
            <select
              v-model="dialect"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="mysql">MySQL</option>
              <option value="postgresql">PostgreSQL</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">命名空间 / 包名</label>
            <input
              v-model="namespace"
              type="text"
              placeholder="例如：models"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">数据库名称</label>
            <input
              v-model="dbName"
              type="text"
              placeholder="例如：my_db"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              :disabled="!result"
              class="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              复制结果
            </button>
            <button
              @click="downloadResult"
              :disabled="!result"
              class="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              下载结果
            </button>
          </div>
        </div>

        <div v-if="result" class="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[300px]">
          <pre class="font-mono text-sm whitespace-pre-wrap break-words">{{ result }}</pre>
        </div>
        <div
          v-else
          class="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[300px] flex items-center justify-center"
        >
          <p class="text-gray-500">请输入 SQL DDL 并点击生成按钮</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { generateCode } from '@chihqiang/sql-quicktype'
import { useToast } from '@/composables/useToast'
import { toastCopy } from '@/utils/clipboard'
import { downloader } from '@/utils/file'

const toast = useToast()

const sqlInput = ref('')
const selectedLang = ref('typescript')
const dialect = ref('mysql')
const namespace = ref('')
const dbName = ref('')
const result = ref('')

const languageOptions = [
  { value: 'typescript', label: 'TypeScript' },
  { value: 'go', label: 'Go' },
  { value: 'gorm', label: 'Go GORM' },
  { value: 'xorm', label: 'Go XORM' },
]

const generate = () => {
  if (!sqlInput.value.trim()) {
    toast.error('请输入 SQL DDL 语句')
    return
  }
  try {
    result.value = generateCode(sqlInput.value, {
      language: selectedLang.value as 'typescript' | 'go' | 'gorm' | 'xorm',
      namespace: namespace.value || undefined,
      dialect: dialect.value || undefined,
      dbName: dbName.value || undefined,
    })
    toast.success('生成成功')
  } catch (e) {
    toast.error(`生成失败：${e instanceof Error ? e.message : '未知错误'}`)
  }
}

const copyResult = () => {
  if (!result.value) return
  toastCopy(result.value)
}

const downloadResult = () => {
  if (!result.value) return
  const extMap: Record<string, string> = { typescript: 'ts', go: 'go', gorm: 'go', xorm: 'go' }
  const ext = extMap[selectedLang.value] || 'txt'
  downloader.text(result.value, { filename: `model.${ext}`, mimeType: 'text/plain;charset=utf-8' })
  toast.success('下载成功')
}

const clearAll = () => {
  sqlInput.value = ''
  result.value = ''
  toast.info('已清空全部')
}
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
