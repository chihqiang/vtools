<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <div class="bg-white rounded-xl shadow-sm p-4 md:p-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex items-center gap-3">
            <svg class="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 class="text-lg md:text-xl font-semibold text-gray-900">当前时间</h2>
          </div>
          <button
            @click="toggleTimer"
            :class="[
              'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
              isRunning ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'
            ]"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path v-if="isRunning" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path v-if="!isRunning" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ isRunning ? '停止' : '开始' }}
          </button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <div class="flex items-center p-4 border border-gray-200 rounded-lg bg-slate-50 hover:border-indigo-500 hover:bg-slate-100 transition-all">
            <span class="text-sm font-medium text-gray-500 min-w-[80px] flex-shrink-0">时间戳：</span>
            <span class="text-sm font-semibold text-gray-900 font-mono flex-1">{{ currentTimestamp.value }}</span>
            <button @click="copyToClipboard(currentTimestamp.value)" class="ml-2 p-1.5 text-gray-400 hover:text-indigo-600 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          <div class="flex items-center p-4 border border-gray-200 rounded-lg bg-slate-50 hover:border-indigo-500 hover:bg-slate-100 transition-all">
            <span class="text-sm font-medium text-gray-500 min-w-[80px] flex-shrink-0">单位：</span>
            <select
              v-model="currentTimestamp.unit"
              @change="updateCurrentTimestamp"
              class="text-sm font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 cursor-pointer"
            >
              <option value="seconds">秒</option>
              <option value="milliseconds">毫秒</option>
            </select>
          </div>
          <div class="flex items-center p-4 border border-gray-200 rounded-lg bg-slate-50 hover:border-indigo-500 hover:bg-slate-100 transition-all">
            <span class="text-sm font-medium text-gray-500 min-w-[80px] flex-shrink-0">日期时间：</span>
            <span class="text-sm font-semibold text-gray-900 font-mono flex-1">{{ currentTimestamp.datetime }}</span>
            <button @click="copyToClipboard(currentTimestamp.datetime)" class="ml-2 p-1.5 text-gray-400 hover:text-indigo-600 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center gap-3 mb-5">
            <svg class="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 class="text-base font-semibold text-gray-900">时间戳转日期时间</h3>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">时间戳</label>
              <input
                v-model="timestampInput"
                type="text"
                placeholder="输入时间戳"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">单位</label>
                <select
                  v-model="timestampUnit"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="seconds">秒</option>
                  <option value="milliseconds">毫秒</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">时区</label>
                <select
                  v-model="timestampTimezone"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option v-for="option in timezoneOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>
            </div>
            <button
              @click="convertTimestampToDate"
              class="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              转换
            </button>
            <div v-if="timestampResult" class="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700">转换结果</span>
                <button @click="copyToClipboard(timestampResult)" class="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
              <span class="text-lg font-mono font-bold text-indigo-600 mt-2 block">{{ timestampResult }}</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center gap-3 mb-5">
            <svg class="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-base font-semibold text-gray-900">日期时间转时间戳</h3>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">日期时间</label>
              <input
                v-model="dateInput.datetime"
                type="text"
                placeholder="例如：2024-01-01 12:00:00"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">时区</label>
              <select
                v-model="dateTimezone"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option v-for="option in timezoneOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>
            <button
              @click="convertDateToTimestamp"
              class="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              转换
            </button>
            <div v-if="dateResult.value" class="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700">转换结果</span>
                <button @click="copyToClipboard(dateResult.value)" class="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
              <span class="text-lg font-mono font-bold text-indigo-600 block">{{ dateResult.value }}</span>
              <div class="flex items-center gap-2 mt-3">
                <span class="text-sm font-medium text-gray-700">单位：</span>
                <select
                  v-model="dateResult.unit"
                  @change="updateDateResultUnit"
                  class="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
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

declare global {
  interface Intl {
    supportedValuesOf(code: 'timezone'): string[]
  }
}

const toast = useToast()

type TimezoneType = string

interface TimezoneOption {
  value: TimezoneType
  label: string
}

const getTimezoneOffset = (tz: string): string => {
  if (tz === 'local') {
    const offset = -new Date().getTimezoneOffset() / 60
    const sign = offset >= 0 ? '+' : ''
    return `UTC${sign}${offset}`
  }
  if (tz === 'UTC') {
    return 'UTC+0'
  }
  try {
    const offset = dayjs().tz(tz).utcOffset() / 60
    const sign = offset >= 0 ? '+' : ''
    return `UTC${sign}${offset}`
  } catch {
    return ''
  }
}

const commonTimezones = [
  'UTC',
  'Africa/Cairo',
  'Africa/Johannesburg',
  'Africa/Lagos',
  'Africa/Nairobi',
  'America/Argentina/Buenos_Aires',
  'America/Bogota',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Mexico_City',
  'America/New_York',
  'America/Phoenix',
  'America/Sao_Paulo',
  'America/Toronto',
  'America/Vancouver',
  'Asia/Bangkok',
  'Asia/Dubai',
  'Asia/Hong_Kong',
  'Asia/Jakarta',
  'Asia/Kolkata',
  'Asia/Seoul',
  'Asia/Shanghai',
  'Asia/Singapore',
  'Asia/Taipei',
  'Asia/Tehran',
  'Asia/Tokyo',
  'Australia/Brisbane',
  'Australia/Melbourne',
  'Australia/Sydney',
  'Europe/Berlin',
  'Europe/Istanbul',
  'Europe/London',
  'Europe/Madrid',
  'Europe/Moscow',
  'Europe/Paris',
  'Europe/Rome',
  'Pacific/Auckland',
  'Pacific/Honolulu'
]

const allTimezones = (() => {
  try {
    const supportedTimezones = ((Intl as unknown) as { supportedValuesOf(code: 'timezone'): string[] }).supportedValuesOf('timezone')
    return ['local', 'UTC', ...supportedTimezones.sort()]
  } catch {
    return ['local', ...commonTimezones.sort()]
  }
})()

const timezoneOptions: TimezoneOption[] = allTimezones.map(tz => ({
  value: tz,
  label: tz === 'local' ? '本地时区' : `${tz} (${getTimezoneOffset(tz)})`
}))

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
