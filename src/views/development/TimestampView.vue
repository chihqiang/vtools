<template>
  <div class="h-full p-6 flex flex-col bg-gray-50 border border-gray-200 rounded-xl space-y-6">
    <!-- 第一部分：时间戳转换（带边框） -->
    <div class="border border-gray-300 rounded-lg p-4 bg-white">
      <div class="flex items-center gap-2">
        <SvgIcon
          :iconPath="'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-8h-2v3l-4-4 4-4v3z'"
          :size="20"
          :className="'text-indigo-600'"
        />
        <h2 class="text-lg font-semibold text-gray-900 mb-2">时间戳转换</h2>
      </div>
    </div>

    <!-- 主要内容区域：当前时间戳和转换功能（左右布局） -->
    <div class="flex flex-col md:flex-row gap-6">
      <!-- 左侧：当前时间戳和操作（带边框） -->
      <div class="border border-gray-300 rounded-lg p-4 bg-white space-y-4 flex-[0.3]">
        <!-- 时钟 -->
        <div class="flex flex-col items-center py-2">
          <!-- 模拟钟表 -->
          <div
            class="relative w-36 h-36 rounded-full border-4 border-gray-800 bg-white mb-2 shadow-md"
          >
            <!-- 表盘设计 -->
            <div
              class="absolute inset-0 rounded-full bg-gradient-to-br from-gray-50 to-gray-100"
            ></div>

            <!-- 数字 -->
            <div
              v-for="i in 12"
              :key="`num-${i}`"
              class="absolute top-1/2 left-1/2 text-sm font-bold text-gray-800"
              :style="{
                transform: `translate(-50%, -50%) rotate(${i * 30}deg) translate(0, -55px) rotate(-${i * 30}deg)`,
              }"
            >
              {{ i }}
            </div>

            <!-- 时针 -->
            <div
              class="absolute top-1/2 left-1/2 w-2 h-12 bg-gray-800 rounded-full origin-bottom shadow-sm"
              :style="{
                transform: `translate(-50%, -100%) rotate(${parseInt(currentDateTime.value?.split(':')[0] ?? '0') * 30 + parseInt(currentDateTime.value?.split(':')[1] ?? '0') * 0.5}deg)`,
              }"
            ></div>

            <!-- 分针 -->
            <div
              class="absolute top-1/2 left-1/2 w-1.5 h-14 bg-gray-600 rounded-full origin-bottom shadow-sm"
              :style="{
                transform: `translate(-50%, -100%) rotate(${parseInt(currentDateTime.value?.split(':')[1] ?? '0') * 6}deg)`,
              }"
            ></div>

            <!-- 秒针 -->
            <div
              class="absolute top-1/2 left-1/2 w-0.5 h-16 bg-red-500 rounded-full origin-bottom shadow-sm"
              :style="{
                transform: `translate(-50%, -100%) rotate(${parseInt(currentDateTime.value?.split(':')[2] ?? '0') * 6}deg)`,
              }"
            ></div>

            <!-- 中心圆点 -->
            <div
              class="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-gray-800 transform -translate-x-1/2 -translate-y-1/2 z-10 shadow"
            ></div>
          </div>

          <!-- 数字时间 -->
          <div class="text-lg font-bold font-mono text-gray-900">{{ currentDateTime.value }}</div>
          <div class="text-sm text-gray-500 mt-1">{{ currentDate.value }}</div>
        </div>

        <!-- 时间戳 -->
        <div class="flex items-center">
          <span class="text-sm text-gray-500 min-w-[80px]">时间戳：</span>
          <div class="flex-1 flex items-center">
            <span class="text-lg font-bold font-mono text-gray-900">{{
              currentTimestamp.value
            }}</span>
            <span class="text-sm text-gray-500 ml-1">{{
              timestampUnitNow === 'seconds' ? '秒' : '毫秒'
            }}</span>
          </div>
        </div>

        <!-- 农历信息 -->
        <div class="space-y-2">
          <div class="flex items-center">
            <span class="text-sm text-gray-500 min-w-[80px]">农历：</span>
            <span class="text-sm text-gray-900">{{ currentLunarInfo }}</span>
          </div>
          <div class="flex items-center">
            <span class="text-sm text-gray-500 min-w-[80px]">天干地支：</span>
            <span class="text-sm text-gray-900">{{ ganZhiInfo }}</span>
          </div>
          <div class="flex items-center">
            <span class="text-sm text-gray-500 min-w-[80px]">生肖：</span>
            <span class="text-sm text-gray-900">{{ shengxiaoInfo }}</span>
          </div>
        </div>

        <!-- 黄历宜忌 -->
        <div class="mt-4 space-y-2">
          <h4 class="text-sm font-medium text-gray-700">黄历宜忌</h4>
          <div class="flex items-start">
            <span class="text-sm text-gray-500 min-w-[80px]">宜：</span>
            <span class="text-sm text-green-700">{{ currentAlmanacYi }}</span>
          </div>
          <div class="flex items-start">
            <span class="text-sm text-gray-500 min-w-[80px]">忌：</span>
            <span class="text-sm text-red-700">{{ currentAlmanacJi }}</span>
          </div>
        </div>

        <!-- 操作 -->
        <div class="flex flex-row flex-wrap gap-2">
          <!-- 开始/停止按钮 -->
          <button
            @click="toggleTimer"
            :class="[
              'px-3 py-1 rounded-lg font-medium text-sm transition-colors w-[calc(50%-0.5rem)]',
              isRunning
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-green-500 text-white hover:bg-green-600',
            ]"
          >
            {{ isRunning ? '停止' : '开始' }}
          </button>

          <!-- 单位切换按钮（单个按钮） -->
          <button
            @click="toggleTimestampUnit"
            class="px-3 py-1 bg-blue-500 text-white rounded-lg font-medium text-sm hover:bg-blue-600 w-[calc(50%-0.5rem)]"
          >
            {{ timestampUnitNow === 'seconds' ? '切换到毫秒' : '切换到秒' }}
          </button>

          <!-- 复制按钮 -->
          <button
            @click="toastCopy(currentTimestamp.value)"
            class="px-3 py-1 bg-purple-500 text-white rounded-lg font-medium text-sm hover:bg-purple-600 w-[calc(50%-0.5rem)]"
          >
            复制
          </button>

          <!-- 当前时间按钮 -->
          <button
            @click="setCurrentTimestamp"
            class="px-3 py-1 bg-indigo-500 text-white rounded-lg font-medium text-sm hover:bg-indigo-600 w-[calc(50%-0.5rem)]"
          >
            填充当前时间
          </button>
        </div>
      </div>

      <!-- 右侧：转换功能区域（带边框） -->
      <div class="border border-gray-300 rounded-lg p-6 bg-white space-y-8 flex-[0.7]">
        <!-- 时间戳转日期时间 -->
        <div class="border border-gray-300 rounded-lg p-4 bg-white">
          <h3 class="font-semibold text-gray-900 mb-4 text-lg">时间戳转日期时间</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- 左边：输入参数 -->
            <div class="flex flex-col gap-3">
              <input
                v-model="timestampInput"
                @keydown.enter="convertTimestampToDate"
                placeholder="输入时间戳"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <select
                v-model="timestampUnit"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                @change="convertTimestampToDate"
              >
                <option value="seconds">秒</option>
                <option value="milliseconds">毫秒</option>
              </select>
            </div>

            <!-- 中间：转换按钮 -->
            <div class="flex items-center justify-center">
              <button
                @click="convertTimestampToDate"
                class="bg-indigo-600 text-white py-2 rounded-lg px-6 whitespace-nowrap hover:bg-indigo-700 transition-colors font-medium"
              >
                转换
              </button>
            </div>

            <!-- 右边：结果和时区 -->
            <div class="flex flex-col gap-3">
              <input
                v-model="timestampResult"
                placeholder="转换结果"
                class="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                readonly
              />
              <div class="relative">
                <select
                  v-model="timestampTimezone"
                  class="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  @change="convertTimestampToDate"
                >
                  <option
                    v-for="t in timezoneOptions"
                    :key="t.value"
                    :value="t.value"
                    :title="t.label"
                  >
                    {{ t.shortLabel }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- 日期时间转时间戳 -->
        <div class="border border-gray-300 rounded-lg p-4 bg-white">
          <h3 class="font-semibold text-gray-900 mb-4 text-lg">日期时间转时间戳</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- 左边：输入参数 -->
            <div class="flex flex-col gap-3">
              <input
                v-model="dateInput"
                @keydown.enter="convertDateToTimestamp"
                placeholder="YYYY-MM-DD HH:mm:ss"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <div class="relative">
                <select
                  v-model="dateTimezone"
                  class="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  @change="convertDateToTimestamp"
                >
                  <option
                    v-for="t in timezoneOptions"
                    :key="t.value"
                    :value="t.value"
                    :title="t.label"
                  >
                    {{ t.shortLabel }}
                  </option>
                </select>
              </div>
            </div>

            <!-- 中间：转换按钮 -->
            <div class="flex items-center justify-center">
              <button
                @click="convertDateToTimestamp"
                class="bg-indigo-600 text-white py-2 rounded-lg px-6 whitespace-nowrap hover:bg-indigo-700 transition-colors font-medium"
              >
                转换
              </button>
            </div>

            <!-- 右边：结果和单位 -->
            <div class="flex flex-col gap-3">
              <input
                v-model="dateResult.value"
                placeholder="转换结果"
                class="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                readonly
              />
              <select
                v-model="dateTimestampUnit"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                @change="convertDateToTimestamp"
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import SvgIcon from '@/components/SvgIcon.vue'
dayjs.extend(utc)
dayjs.extend(timezone)
import { toastCopy } from '@/utils/clipboard'

import { solar2lunar, getGanZhiString, getAlmanac, timezeros } from '@/utils/times'

const timezoneOptions = ref(timezeros)

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

const currentDateTime = computed(() => {
  return {
    value: now.value.format('HH:mm:ss'),
  }
})

const currentDate = computed(() => {
  return {
    value: now.value.format('YYYY-MM-DD'),
  }
})

// 农历信息
const currentLunarInfo = computed(() => {
  const date = now.value.toDate()
  const lunar = solar2lunar(date.getFullYear(), date.getMonth() + 1, date.getDate())
  return `${lunar.lunarMonthStr}${lunar.lunarDayStr}`
})

// 天干地支信息
const ganZhiInfo = computed(() => {
  const date = now.value.toDate()
  return getGanZhiString(date)
})

// 生肖信息
const shengxiaoInfo = computed(() => {
  const date = now.value.toDate()
  const lunar = solar2lunar(date.getFullYear(), date.getMonth() + 1, date.getDate())
  return lunar.shengxiao
})

// 黄历宜忌信息
const currentAlmanacYi = computed(() => {
  const date = now.value.toDate()
  const almanac = getAlmanac(date)
  return almanac.yi
})

const currentAlmanacJi = computed(() => {
  const date = now.value.toDate()
  const almanac = getAlmanac(date)
  return almanac.ji
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

// 切换时间戳单位
const toggleTimestampUnit = () => {
  timestampUnitNow.value = timestampUnitNow.value === 'seconds' ? 'milliseconds' : 'seconds'
}

/* ================= 转换逻辑 ================= */

const timestampInput = ref('')
const timestampUnit = ref<'seconds' | 'milliseconds'>('seconds')
const timestampTimezone = ref('local')
const timestampResult = ref('')

const dateInput = ref('')
const dateTimezone = ref('local')
const dateTimestampUnit = ref<'seconds' | 'milliseconds'>('seconds')
const dateResult = ref({ value: '', original: 0 })

const convertTimestampToDate = () => {
  const n = Number(timestampInput.value)
  if (Number.isNaN(n)) return

  const ms = timestampUnit.value === 'seconds' ? n * 1000 : n
  const d =
    timestampTimezone.value === 'local' ? dayjs(ms) : dayjs.utc(ms).tz(timestampTimezone.value)

  if (!d.isValid()) return
  timestampResult.value = d.format('YYYY-MM-DD HH:mm:ss')
}

const convertDateToTimestamp = () => {
  const d =
    dateTimezone.value === 'local'
      ? dayjs(dateInput.value)
      : dayjs.tz(dateInput.value, dateTimezone.value)

  if (!d.isValid()) return

  const timestamp = d.valueOf()
  dateResult.value = {
    value:
      dateTimestampUnit.value === 'seconds'
        ? Math.floor(timestamp / 1000).toString()
        : timestamp.toString(),
    original: timestamp,
  }
}

// 设置当前时间到输入框
const setCurrentTimestamp = () => {
  const currentTime = dayjs()
  const timestamp = currentTime.valueOf()

  // 填充时间戳输入框
  timestampInput.value =
    timestampUnit.value === 'seconds'
      ? Math.floor(timestamp / 1000).toString()
      : timestamp.toString()
  convertTimestampToDate()

  // 填充日期时间输入框
  dateInput.value = currentTime.format('YYYY-MM-DD HH:mm:ss')
  convertDateToTimestamp()
}

onMounted(() => startTimer())
onUnmounted(() => stopTimer())
</script>
