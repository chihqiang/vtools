<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">时间戳工具</h2>
    <p class="text-gray-600 mb-6">时间戳转换工具，支持当前时间戳、时间戳转日期、日期转时间戳等功能。</p>
    
    <div class="space-y-6">
      <div class="border rounded-lg p-4 bg-gray-50">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-6">
            <div class="flex items-center space-x-2">
              <span class="text-gray-600 text-sm">时间戳：</span>
              <span class="font-mono text-lg font-bold text-blue-600">{{ currentTimestamp.value }}</span>
              <button @click="copyToClipboard(currentTimestamp.value)" class="text-gray-500 hover:text-blue-500 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </button>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-gray-600 text-sm">单位：</span>
              <select
                v-model="currentTimestamp.unit"
                @change="updateCurrentTimestamp"
                class="px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="seconds">秒</option>
                <option value="milliseconds">毫秒</option>
              </select>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-gray-600 text-sm">当前日期时间：</span>
              <span class="font-mono text-gray-800">{{ currentTimestamp.datetime }}</span>
              <button @click="copyToClipboard(currentTimestamp.datetime)" class="text-gray-500 hover:text-blue-500 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </button>
            </div>
          </div>
          <button
            @click="toggleTimer"
            :class="[
              'px-3 py-1 rounded text-sm transition-colors',
              isRunning ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'
            ]"
          >
            {{ isRunning ? '停止' : '开始' }}
          </button>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="border rounded-lg p-4 bg-gray-50">
          <h3 class="font-semibold text-gray-700 mb-3">时间戳转日期时间</h3>
          <div class="space-y-3">
            <div class="flex space-x-3">
              <div class="flex-1">
                <label class="block text-sm text-gray-600 mb-1">时间戳</label>
                <input
                  v-model="timestampInput"
                  type="text"
                  placeholder="输入时间戳"
                  class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div class="w-32">
                <label class="block text-sm text-gray-600 mb-1">单位</label>
                <select
                  v-model="timestampUnit"
                  class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="seconds">秒</option>
                  <option value="milliseconds">毫秒</option>
                </select>
              </div>
            </div>
            <div class="flex space-x-3">
              <div class="flex-1">
                <label class="block text-sm text-gray-600 mb-1">时区</label>
                <select
                  v-model="timestampTimezone"
                  class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option v-for="option in timezoneOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>
              <div class="flex-1">
                <label class="block text-sm text-gray-600 mb-1">&nbsp;</label>
                <button
                  @click="convertTimestampToDate"
                  class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  转换
                </button>
              </div>
            </div>
            <div v-if="timestampResult" class="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span class="text-gray-600">转换结果：</span>
              <div class="flex items-center space-x-2 mt-2">
                <span class="font-mono font-bold text-blue-600">{{ timestampResult }}</span>
                <button @click="copyToClipboard(timestampResult)" class="text-gray-500 hover:text-blue-500 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="border rounded-lg p-4 bg-gray-50">
          <h3 class="font-semibold text-gray-700 mb-3">日期时间转时间戳</h3>
          <div class="space-y-3">
            <div class="flex space-x-3">
              <div class="flex-1">
                <label class="block text-sm text-gray-600 mb-1">日期时间</label>
                <input
                  v-model="dateInput.datetime"
                  type="text"
                  placeholder="例如：2024-01-01 12:00:00"
                  class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div class="w-40">
                <label class="block text-sm text-gray-600 mb-1">时区</label>
                <select
                  v-model="dateTimezone"
                  class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option v-for="option in timezoneOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>
            </div>
            <div class="flex space-x-3">
              <div class="flex-1">
                <label class="block text-sm text-gray-600 mb-1">&nbsp;</label>
                <button
                  @click="convertDateToTimestamp"
                  class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  转换
                </button>
              </div>
            </div>
            <div v-if="dateResult.value" class="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span class="text-gray-600">转换结果：</span>
              <div class="flex items-center space-x-2 mt-2">
                <span class="font-mono font-bold text-blue-600">{{ dateResult.value }}</span>
                <button @click="copyToClipboard(dateResult.value)" class="text-gray-500 hover:text-blue-500 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                </button>
              </div>
              <div class="flex items-center space-x-2 mt-2">
                <span class="text-gray-600">单位：</span>
                <select
                  v-model="dateResult.unit"
                  @change="updateDateResultUnit"
                  class="px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="seconds">秒</option>
                  <option value="milliseconds">毫秒</option>
                </select>
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
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

const toast = useToast()

type TimezoneType = 'local' | 'UTC' | 'Asia/Shanghai' | 'America/New_York' | 'America/Los_Angeles' | 'Europe/London' | 'Europe/Paris' | 'Asia/Tokyo'

interface TimezoneOption {
  value: TimezoneType
  label: string
}

const timezoneOptions: TimezoneOption[] = [
  { value: 'local', label: '本地时区' },
  { value: 'UTC', label: 'UTC (UTC+0)' },
  { value: 'Asia/Shanghai', label: '中国 (UTC+8)' },
  { value: 'America/New_York', label: '美国东部 (UTC-5)' },
  { value: 'America/Los_Angeles', label: '美国西部 (UTC-8)' },
  { value: 'Europe/London', label: '伦敦 (UTC+0)' },
  { value: 'Europe/Paris', label: '巴黎 (UTC+1)' },
  { value: 'Asia/Tokyo', label: '东京 (UTC+9)' }
]

const currentTimestamp = ref({
  value: '',
  unit: 'seconds' as 'seconds' | 'milliseconds',
  datetime: ''
})

const timestampInput = ref('')
const timestampUnit = ref('seconds' as 'seconds' | 'milliseconds')
const timestampTimezone = ref<TimezoneType>('local')
const timestampResult = ref('')

const dateInput = ref({
  datetime: ''
})

const dateTimezone = ref<TimezoneType>('local')
const dateResult = ref({
  value: '',
  unit: 'seconds' as 'seconds' | 'milliseconds',
  originalTimestamp: 0 as number
})

let timer: number | null = null
const isRunning = ref(true)

const updateCurrentTimestamp = () => {
  const now = dayjs()
  const timestamp = now.valueOf()
  
  currentTimestamp.value = {
    value: currentTimestamp.value.unit === 'seconds' 
      ? Math.floor(timestamp / 1000).toString() 
      : timestamp.toString(),
    unit: currentTimestamp.value.unit,
    datetime: now.format('YYYY-MM-DD HH:mm:ss')
  }
}

const toggleTimer = () => {
  isRunning.value = !isRunning.value
  if (isRunning.value) {
    updateCurrentTimestamp()
    timer = window.setInterval(updateCurrentTimestamp, 1000)
  } else {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }
}

const convertTimestampToDate = () => {
  const input = timestampInput.value.trim()
  if (!input) {
    return
  }
  
  const timestamp = parseInt(input)
  if (isNaN(timestamp)) {
    toast.error('无效的时间戳')
    return
  }
  
  const adjustedTimestamp = timestampUnit.value === 'seconds' ? timestamp * 1000 : timestamp
  
  let result: dayjs.Dayjs
  if (timestampTimezone.value === 'local') {
    result = dayjs(adjustedTimestamp)
  } else {
    result = dayjs.utc(adjustedTimestamp).tz(timestampTimezone.value)
  }
  
  if (!result.isValid()) {
    toast.error('无效的时间戳')
    return
  }
  
  timestampResult.value = result.format('YYYY-MM-DD HH:mm:ss')
}

const convertDateToTimestamp = () => {
  const input = dateInput.value.datetime.trim()
  if (!input) {
    toast.error('请输入日期时间')
    return
  }
  
  let result: dayjs.Dayjs
  if (dateTimezone.value === 'local') {
    result = dayjs(input)
  } else {
    result = dayjs.tz(input, dateTimezone.value)
  }
  
  if (!result.isValid()) {
    toast.error('无效的日期格式，请使用格式：YYYY-MM-DD HH:mm:ss')
    return
  }
  
  updateDateResult(result)
}

const updateDateResult = (date: dayjs.Dayjs) => {
  const timestamp = date.valueOf()
  dateResult.value = {
    value: dateResult.value.unit === 'seconds' 
      ? Math.floor(timestamp / 1000).toString() 
      : timestamp.toString(),
    unit: dateResult.value.unit,
    originalTimestamp: timestamp
  }
}

const updateDateResultUnit = () => {
  const currentValue = dateResult.value.value
  if (!currentValue) return
  
  const newUnit = dateResult.value.unit
  let result: string
  
  if (newUnit === 'seconds') {
    result = Math.floor(dateResult.value.originalTimestamp / 1000).toString()
  } else {
    result = dateResult.value.originalTimestamp.toString()
  }
  
  dateResult.value = {
    value: result,
    unit: newUnit,
    originalTimestamp: dateResult.value.originalTimestamp
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
  
  const now = dayjs()
  const timestamp = now.valueOf()
  
  timestampInput.value = Math.floor(timestamp / 1000).toString()
  dateInput.value.datetime = now.format('YYYY-MM-DD HH:mm:ss')
  
  convertTimestampToDate()
  convertDateToTimestamp()
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
</style>
