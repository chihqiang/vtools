<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">时间戳工具</h2>
    <p class="text-gray-600 mb-6">时间戳转换工具，支持当前时间戳、时间戳转日期、日期转时间戳等功能。</p>
    
    <div class="space-y-6">
      <div class="border rounded-lg p-4 bg-gray-50">
        <h3 class="font-semibold text-gray-700 mb-3">当前时间戳</h3>
        <div class="flex items-center justify-between mb-2">
          <span class="text-gray-600">秒级时间戳：</span>
          <div class="flex items-center space-x-2">
            <span class="font-mono text-lg font-bold text-blue-600">{{ currentTimestamp.seconds }}</span>
            <button @click="copyToClipboard(currentTimestamp.seconds)" class="text-gray-500 hover:text-blue-500 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-gray-600">毫秒级时间戳：</span>
          <div class="flex items-center space-x-2">
            <span class="font-mono text-lg font-bold text-blue-600">{{ currentTimestamp.milliseconds }}</span>
            <button @click="copyToClipboard(currentTimestamp.milliseconds)" class="text-gray-500 hover:text-blue-500 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-gray-600">当前日期时间：</span>
          <div class="flex items-center space-x-2">
            <span class="font-mono text-gray-800">{{ currentTimestamp.datetime }}</span>
            <button @click="copyToClipboard(currentTimestamp.datetime)" class="text-gray-500 hover:text-blue-500 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div class="border rounded-lg p-4 bg-gray-50">
        <h3 class="font-semibold text-gray-700 mb-3">时间戳转日期</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-sm text-gray-600 mb-1">输入时间戳（秒或毫秒）</label>
            <input
              v-model="timestampInput"
              type="text"
              placeholder="例如：1704067200 或 1704067200000"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            @click="convertTimestampToDate"
            class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            转换
          </button>
          <div v-if="timestampResult" class="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <span class="text-gray-600">转换结果：</span>
            <span class="font-mono font-bold text-blue-600">{{ timestampResult }}</span>
          </div>
        </div>
      </div>
      
      <div class="border rounded-lg p-4 bg-gray-50">
        <h3 class="font-semibold text-gray-700 mb-3">日期转时间戳</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-sm text-gray-600 mb-1">选择日期时间</label>
            <input
              v-model="dateInput"
              type="datetime-local"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            @click="convertDateToTimestamp"
            class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            转换
          </button>
          <div v-if="dateResult" class="space-y-2">
            <div class="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span class="text-gray-600">秒级时间戳：</span>
              <div class="flex items-center space-x-2">
                <span class="font-mono font-bold text-blue-600">{{ dateResult.seconds }}</span>
                <button @click="copyToClipboard(dateResult.seconds)" class="text-gray-500 hover:text-blue-500 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div class="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span class="text-gray-600">毫秒级时间戳：</span>
              <div class="flex items-center space-x-2">
                <span class="font-mono font-bold text-blue-600">{{ dateResult.milliseconds }}</span>
                <button @click="copyToClipboard(dateResult.milliseconds)" class="text-gray-500 hover:text-blue-500 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useToast } from '@/composables/useToast'

const toast = useToast()

const currentTimestamp = ref({
  seconds: '',
  milliseconds: '',
  datetime: ''
})

const timestampInput = ref('')
const timestampResult = ref('')
const dateInput = ref('')
const dateResult = ref<{ seconds: string; milliseconds: string } | null>(null)

let timer: number | null = null

const updateCurrentTimestamp = () => {
  const now = new Date()
  currentTimestamp.value = {
    seconds: Math.floor(now.getTime() / 1000).toString(),
    milliseconds: now.getTime().toString(),
    datetime: formatDateTime(now)
  }
}

const formatDateTime = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

const convertTimestampToDate = () => {
  const input = timestampInput.value.trim()
  if (!input) {
    timestampResult.value = ''
    return
  }
  
  const timestamp = parseInt(input)
  if (isNaN(timestamp)) {
    timestampResult.value = '无效的时间戳'
    return
  }
  
  const date = new Date(timestamp < 1000000000000 ? timestamp * 1000 : timestamp)
  if (isNaN(date.getTime())) {
    timestampResult.value = '无效的时间戳'
    return
  }
  
  timestampResult.value = formatDateTime(date)
}

const convertDateToTimestamp = () => {
  const input = dateInput.value
  if (!input) {
    dateResult.value = null
    return
  }
  
  const date = new Date(input)
  if (isNaN(date.getTime())) {
    toast.error('无效的日期')
    return
  }
  
  dateResult.value = {
    seconds: Math.floor(date.getTime() / 1000).toString(),
    milliseconds: date.getTime().toString()
  }
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.success('已复制到剪贴板')
  } catch {
    toast.error('复制失败')
  }
}

onMounted(() => {
  updateCurrentTimestamp()
  timer = window.setInterval(updateCurrentTimestamp, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
</style>
