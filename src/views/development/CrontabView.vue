<template>
  <div class="max-w-7xl mx-auto px-4 py-6">
    <div class="bg-white rounded-lg shadow-md p-6">
      <!-- 标题 -->
      <div class="mb-8 text-center">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Crontab 表达式解析工具</h1>
        <p class="text-gray-600">解析、验证和生成 Crontab 表达式的执行时间</p>
      </div>

      <!-- 主要内容区域 -->
      <div class="grid grid-cols-1 gap-8">
        <!-- 上部：输入和操作区域 -->
        <div class="border border-gray-300 rounded-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-gray-700">Crontab 表达式</h3>
            <div class="flex space-x-2">
              <button
                @click="pasteInput"
                class="px-3 py-2 bg-blue-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
              >
                粘贴
              </button>
              <button
                @click="copyOutput"
                class="px-3 py-2 bg-green-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
              >
                复制
              </button>
              <button
                @click="clearInput"
                class="px-3 py-2 bg-gray-600 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
              >
                清空
              </button>
            </div>
          </div>

          <div class="mb-6">
            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <input
                v-model="cronExpression"
                placeholder="请输入 Crontab 表达式，例如: * * * * *"
                class="w-full p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <!-- 操作区域 -->
          <div class="mb-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                @click="parseCron"
                class="px-4 py-2 bg-blue-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
              >
                解析表达式
              </button>
              <button
                @click="generateNextRunTimes"
                class="px-4 py-2 bg-green-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
              >
                生成执行时间
              </button>
              <button
                @click="validateCron"
                class="px-4 py-2 bg-purple-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
              >
                验证表达式
              </button>
            </div>
          </div>

          <!-- 常见Cron表达式示例 -->
          <div>
            <h3 class="font-semibold text-gray-700 mb-3">常见Cron表达式</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                v-for="(example, index) in commonCronExpressions"
                :key="index"
                @click="useExample(example.expression)"
                class="px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-all duration-150 shadow-sm hover:shadow"
              >
                {{ example.description }}
              </button>
            </div>
          </div>
        </div>

        <!-- 下部：结果显示区域 -->
        <div class="border border-gray-300 rounded-lg p-6">
          <h3 class="font-semibold text-gray-700 mb-3">解析结果</h3>

          <!-- 下一次执行时间 -->
          <div v-if="nextRunTime" class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p class="text-sm text-gray-600 mb-1">下一次执行时间:</p>
            <p class="font-mono text-blue-600">{{ nextRunTime }}</p>
          </div>

          <!-- 执行时间列表 -->
          <div v-if="nextRunTimes.length > 0" class="mb-4">
            <p class="text-sm text-gray-600 mb-2">未来执行时间 ({{ nextRunTimes.length }} 次):</p>
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
                      时间
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="(time, index) in nextRunTimes" :key="index">
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {{ index + 1 }}
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm font-mono text-gray-900">
                      {{ time }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 解析错误 -->
          <div v-if="parseError" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600">{{ parseError }}</p>
          </div>
        </div>
      </div>

      <!-- Crontab 命令详解 -->
      <div class="mt-12">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Crontab 命令详解</h2>
        <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-700 mb-3">Crontab 表达式语法</h3>
          <p class="text-gray-600 mb-4">Crontab 表达式由 5 个字段组成，分别表示：</p>
          <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <p class="text-sm font-medium text-gray-700">分钟</p>
              <p class="text-xs text-gray-500">0-59</p>
            </div>
            <div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <p class="text-sm font-medium text-gray-700">小时</p>
              <p class="text-xs text-gray-500">0-23</p>
            </div>
            <div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <p class="text-sm font-medium text-gray-700">日期</p>
              <p class="text-xs text-gray-500">1-31</p>
            </div>
            <div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <p class="text-sm font-medium text-gray-700">月份</p>
              <p class="text-xs text-gray-500">1-12</p>
            </div>
            <div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <p class="text-sm font-medium text-gray-700">星期</p>
              <p class="text-xs text-gray-500">0-7 (0和7都表示周日)</p>
            </div>
          </div>

          <h3 class="text-lg font-semibold text-gray-700 mb-3">特殊字符说明</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <p class="text-sm font-medium text-gray-700">*</p>
              <p class="text-xs text-gray-500">匹配任意值</p>
            </div>
            <div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <p class="text-sm font-medium text-gray-700">/</p>
              <p class="text-xs text-gray-500">步长值，例如 */5 表示每5个单位</p>
            </div>
            <div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <p class="text-sm font-medium text-gray-700">-</p>
              <p class="text-xs text-gray-500">范围，例如 1-5 表示1到5</p>
            </div>
            <div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <p class="text-sm font-medium text-gray-700">,</p>
              <p class="text-xs text-gray-500">列举值，例如 1,3,5 表示1、3、5</p>
            </div>
          </div>

          <h3 class="text-lg font-semibold text-gray-700 mb-3">示例</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <p class="text-sm font-mono text-gray-700">* * * * *</p>
              <p class="text-xs text-gray-500">每分钟执行</p>
            </div>
            <div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <p class="text-sm font-mono text-gray-700">0 * * * *</p>
              <p class="text-xs text-gray-500">每小时执行</p>
            </div>
            <div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <p class="text-sm font-mono text-gray-700">0 0 * * *</p>
              <p class="text-xs text-gray-500">每天执行</p>
            </div>
            <div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <p class="text-sm font-mono text-gray-700">0 0 * * 0</p>
              <p class="text-xs text-gray-500">每周执行</p>
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
import { CronExpressionParser } from 'cron-parser'

const toast = useToast()
const cronExpression = ref('')
const nextRunTime = ref('')
const nextRunTimes = ref<string[]>([])
const parseError = ref('')

// 常见Cron表达式示例
const commonCronExpressions = ref([
  { expression: '* * * * *', description: '每分钟执行' },
  { expression: '0 * * * *', description: '每小时执行' },
  { expression: '0 0 * * *', description: '每天执行' },
  { expression: '0 0 * * 0', description: '每周执行' },
  { expression: '0 0 1 * *', description: '每月执行' },
  { expression: '0 0 1 1 *', description: '每年执行' },
  { expression: '*/5 * * * *', description: '每5分钟执行' },
  { expression: '0 */2 * * *', description: '每2小时执行' },
  { expression: '0 9-17 * * *', description: '工作日9点到17点每小时执行' },
  { expression: '0 0 * * 1-5', description: '工作日每天执行' },
  { expression: '0 0 * * 6,0', description: '周末每天执行' },
  { expression: '0 0 15 * *', description: '每月15日执行' },
])

// 使用示例表达式
const useExample = (expression: string) => {
  cronExpression.value = expression
  toast.success('已使用示例表达式')
}

/* ---------- 剪贴板 ---------- */

const pasteInput = async () => {
  try {
    cronExpression.value = await navigator.clipboard.readText()
    toast.success('已粘贴')
  } catch {
    toast.error('粘贴失败')
  }
}

const copyOutput = async () => {
  if (!cronExpression.value.trim()) {
    toast.warning('请先输入或生成内容')
    return
  }
  try {
    await navigator.clipboard.writeText(cronExpression.value)
    toast.success('已复制到剪贴板')
  } catch {
    toast.error('复制失败')
  }
}

const clearInput = () => {
  cronExpression.value = ''
  nextRunTime.value = ''
  nextRunTimes.value = []
  parseError.value = ''
  toast.success('已清空')
}

/* ---------- Crontab 解析功能 ---------- */

const ensureInput = () => {
  if (!cronExpression.value.trim()) {
    toast.warning('请先输入 Crontab 表达式')
    return false
  }
  return true
}

const parseCron = () => {
  if (!ensureInput()) return

  try {
    const interval = CronExpressionParser.parse(cronExpression.value)
    const nextDate = new Date(interval.next().toDate())
    nextRunTime.value = new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(nextDate)
    parseError.value = ''
    toast.success('解析成功')
  } catch (error: unknown) {
    parseError.value = error instanceof Error ? error.message : '未知错误'
    nextRunTime.value = ''
    nextRunTimes.value = []
    toast.error('解析失败')
  }
}

const generateNextRunTimes = () => {
  if (!ensureInput()) return

  try {
    const interval = CronExpressionParser.parse(cronExpression.value)
    const times: string[] = interval.take(10).map((date) => {
      return new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(new Date(date.toDate()))
    })

    nextRunTimes.value = times
    nextRunTime.value = times[0] || ''
    parseError.value = ''
    toast.success('生成成功')
  } catch (error: unknown) {
    parseError.value = error instanceof Error ? error.message : '未知错误'
    nextRunTime.value = ''
    nextRunTimes.value = []
    toast.error('生成失败')
  }
}

const validateCron = () => {
  if (!ensureInput()) return

  try {
    CronExpressionParser.parse(cronExpression.value)
    parseError.value = ''
    toast.success('表达式有效')
  } catch (error: unknown) {
    parseError.value = error instanceof Error ? error.message : '未知错误'
    toast.error('表达式无效')
  }
}
</script>

<style scoped></style>
