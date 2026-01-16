<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- 当前时间 -->
      <div class="bg-white rounded-xl shadow-sm p-4 md:p-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex items-center gap-3">
            <svg
              class="w-6 h-6 text-indigo-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 class="text-lg md:text-xl font-semibold text-gray-900">当前时间</h2>
          </div>

          <button
            @click="toggleTimer"
            :class="[
              'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
              isRunning
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-green-500 text-white hover:bg-green-600',
            ]"
          >
            {{ isRunning ? '停止' : '开始' }}
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <!-- 时间戳 -->
          <div class="flex items-center p-4 border border-gray-200 rounded-lg bg-slate-50">
            <span class="text-sm text-gray-500 min-w-[80px]">时间戳：</span>
            <span class="text-lg font-bold font-mono text-gray-900 flex-1">
              {{ currentTimestamp.value }}
            </span>
            <button
              @click="copy(currentTimestamp.value)"
              title="复制"
              class="ml-2 text-gray-400 hover:text-indigo-600"
            >
              ⧉
            </button>
          </div>

          <!-- 单位 -->
          <div class="flex items-center p-4 border border-gray-200 rounded-lg bg-slate-50">
            <span class="text-sm text-gray-500 min-w-[80px]">单位：</span>
            <select v-model="timestampUnitNow" class="bg-transparent font-semibold cursor-pointer">
              <option value="seconds">秒</option>
              <option value="milliseconds">毫秒</option>
            </select>
          </div>

          <!-- 日期 -->
          <div class="flex items-center p-4 border border-gray-200 rounded-lg bg-slate-50">
            <span class="text-sm text-gray-500 min-w-[80px]">日期：</span>
            <span class="text-sm font-mono text-gray-700 flex-1">
              {{ currentTimestamp.datetime }}
            </span>
            <button
              @click="copy(currentTimestamp.datetime)"
              title="复制"
              class="ml-2 text-gray-400 hover:text-indigo-600"
            >
              ⧉
            </button>
          </div>
        </div>
      </div>

      <!-- 转换区 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 时间戳 -> 日期 -->
        <div class="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <h3 class="font-semibold text-gray-900 mb-4">时间戳转日期</h3>

          <input
            v-model="timestampInput"
            @keydown.enter="convertTimestampToDate"
            placeholder="输入时间戳"
            class="w-full mb-3 px-4 py-2 border rounded-lg"
          />

          <div class="grid grid-cols-2 gap-3 mb-3">
            <select v-model="timestampUnit" class="px-3 py-2 border rounded-lg">
              <option value="seconds">秒</option>
              <option value="milliseconds">毫秒</option>
            </select>
            <select v-model="timestampTimezone" class="px-3 py-2 border rounded-lg">
              <option v-for="t in timezoneOptions" :key="t.value" :value="t.value">
                {{ t.label }}
              </option>
            </select>
          </div>

          <button
            @click="convertTimestampToDate"
            class="w-full bg-indigo-600 text-white py-2 rounded-lg"
          >
            转换
          </button>

          <div v-if="timestampResult" class="mt-4 p-3 bg-indigo-50 rounded-lg">
            <span class="font-mono font-bold text-indigo-600">
              {{ timestampResult }}
            </span>
          </div>
        </div>

        <!-- 日期 -> 时间戳 -->
        <div class="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <h3 class="font-semibold text-gray-900 mb-4">日期转时间戳</h3>

          <input
            v-model="dateInput"
            @keydown.enter="convertDateToTimestamp"
            placeholder="YYYY-MM-DD HH:mm:ss"
            class="w-full mb-3 px-4 py-2 border rounded-lg"
          />

          <select v-model="dateTimezone" class="w-full px-3 py-2 border rounded-lg mb-3">
            <option v-for="t in timezoneOptions" :key="t.value" :value="t.value">
              {{ t.label }}
            </option>
          </select>

          <button
            @click="convertDateToTimestamp"
            class="w-full bg-indigo-600 text-white py-2 rounded-lg"
          >
            转换
          </button>

          <div v-if="dateResult.value" class="mt-4 p-3 bg-indigo-50 rounded-lg">
            <span class="font-mono font-bold text-indigo-600">
              {{ dateResult.value }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { useToast } from '@/composables/useToast'

dayjs.extend(utc)
dayjs.extend(timezone)

const toast = useToast()
/* ================= 当前时间 ================= */

const now = ref(dayjs())
const timestampUnitNow = ref<'seconds' | 'milliseconds'>('seconds')

const currentTimestamp = computed(() => {
  const ts = now.value.valueOf()
  return {
    value: timestampUnitNow.value === 'seconds' ? Math.floor(ts / 1000).toString() : ts.toString(),
    datetime: now.value.format('YYYY-MM-DD HH:mm:ss'),
  }
})

let timer: number | null = null
const isRunning = ref(true)

const startTimer = () => {
  if (timer) return
  timer = window.setInterval(() => {
    now.value = dayjs()
  }, 1000)
}

const stopTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

const toggleTimer = () => {
  isRunning.value = !isRunning.value
  if (isRunning.value) {
    startTimer()
  } else {
    stopTimer()
  }
}

/* ================= 转换逻辑 ================= */

const timestampInput = ref('')
const timestampUnit = ref<'seconds' | 'milliseconds'>('seconds')
const timestampTimezone = ref('local')
const timestampResult = ref('')

const dateInput = ref('')
const dateTimezone = ref('local')
const dateResult = ref({ value: '', original: 0 })

const timezoneOptions = [
  { value: 'local', label: '本地时区' },
  { value: 'UTC', label: 'UTC' },
  { value: 'Asia/Shanghai', label: 'Asia/Shanghai' },
]

const convertTimestampToDate = () => {
  const n = Number(timestampInput.value)
  if (Number.isNaN(n)) return toast.error('无效时间戳')

  const ms = timestampUnit.value === 'seconds' ? n * 1000 : n
  const d =
    timestampTimezone.value === 'local' ? dayjs(ms) : dayjs.utc(ms).tz(timestampTimezone.value)

  if (!d.isValid()) return toast.error('无效时间戳')
  timestampResult.value = d.format('YYYY-MM-DD HH:mm:ss')
}

const convertDateToTimestamp = () => {
  const d =
    dateTimezone.value === 'local'
      ? dayjs(dateInput.value)
      : dayjs.tz(dateInput.value, dateTimezone.value)

  if (!d.isValid()) return toast.error('无效日期格式')

  dateResult.value = {
    value: Math.floor(d.valueOf() / 1000).toString(),
    original: d.valueOf(),
  }
}

/* ================= 工具 ================= */

const copy = async (text: string) => {
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    toast.success('已复制')
  } catch {
    toast.error('复制失败')
  }
}

onMounted(() => startTimer())
onUnmounted(() => stopTimer())
</script>
