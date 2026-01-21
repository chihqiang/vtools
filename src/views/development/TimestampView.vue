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
            @click="copy(currentTimestamp.value)"
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
import { useToast } from '@/composables/useToast'
import SvgIcon from '@/components/SvgIcon.vue'
dayjs.extend(utc)
dayjs.extend(timezone)

const toast = useToast()

const timezoneOptions = ref([
  { value: 'local', label: '本地时区', shortLabel: '本地时区' },
  {
    value: 'Etc/GMT+12',
    label: 'Etc/GMT+12 (UTC-12:00) 国际日期变更线西',
    shortLabel: 'UTC-12:00',
  },
  { value: 'Etc/GMT+11', label: 'Etc/GMT+11 (UTC-11:00) 协调世界时-11', shortLabel: 'UTC-11:00' },
  {
    value: 'Pacific/Honolulu',
    label: 'Pacific/Honolulu (UTC-10:00) 夏威夷',
    shortLabel: 'UTC-10:00 夏威夷',
  },
  {
    value: 'Pacific/Gambier',
    label: 'Pacific/Gambier (UTC-09:00) 法属波利尼西亚甘比尔群岛',
    shortLabel: 'UTC-09:00',
  },
  {
    value: 'America/Santa_Isabel',
    label: 'America/Santa_Isabel (UTC-08:00) 下加利福尼亚州',
    shortLabel: 'UTC-08:00',
  },
  {
    value: 'America/Los_Angeles',
    label: 'America/Los_Angeles (UTC-08:00) 太平洋时间（美国和加拿大）',
    shortLabel: 'UTC-08:00 洛杉矶',
  },
  {
    value: 'America/Phoenix',
    label: 'America/Phoenix (UTC-07:00) 亚利桑那',
    shortLabel: 'UTC-07:00 亚利桑那',
  },
  {
    value: 'America/Denver',
    label: 'America/Denver (UTC-07:00) 山地时间（美国和加拿大）',
    shortLabel: 'UTC-07:00 丹佛',
  },
  {
    value: 'America/Guatemala',
    label: 'America/Guatemala (UTC-06:00) 中美洲',
    shortLabel: 'UTC-06:00 中美洲',
  },
  {
    value: 'America/Chicago',
    label: 'America/Chicago (UTC-06:00) 中部时间（美国和加拿大）',
    shortLabel: 'UTC-06:00 芝加哥',
  },
  {
    value: 'America/Regina',
    label: 'America/Regina (UTC-06:00) 萨斯喀彻温',
    shortLabel: 'UTC-06:00',
  },
  {
    value: 'America/Mexico_City',
    label: 'America/Mexico_City (UTC-06:00) 瓜达拉哈拉,墨西哥城,蒙特雷',
    shortLabel: 'UTC-06:00 墨西哥城',
  },
  {
    value: 'America/Bogota',
    label: 'America/Bogota (UTC-05:00) 波哥大,利马,基多',
    shortLabel: 'UTC-05:00 波哥大',
  },
  {
    value: 'America/Indiana/Indianapolis',
    label: 'America/Indiana/Indianapolis (UTC-05:00) 印地安那州（东部）',
    shortLabel: 'UTC-05:00 印第安纳',
  },
  {
    value: 'America/New_York',
    label: 'America/New_York (UTC-05:00) 东部时间（美国和加拿大）',
    shortLabel: 'UTC-05:00 纽约',
  },
  {
    value: 'America/Halifax',
    label: 'America/Halifax (UTC-04:00) 大西洋时间（加拿大）',
    shortLabel: 'UTC-04:00 哈利法克斯',
  },
  {
    value: 'America/Asuncion',
    label: 'America/Asuncion (UTC-04:00) 亚松森',
    shortLabel: 'UTC-04:00 亚松森',
  },
  {
    value: 'America/La_Paz',
    label: 'America/La_Paz (UTC-04:00) 乔治敦,拉巴斯,马瑙斯,圣胡安',
    shortLabel: 'UTC-04:00',
  },
  { value: 'America/Cuiaba', label: 'America/Cuiaba (UTC-04:00) 库亚巴', shortLabel: 'UTC-04:00' },
  {
    value: 'America/St_Johns',
    label: 'America/St_Johns (UTC-03:30) 纽芬兰',
    shortLabel: 'UTC-03:30 纽芬兰',
  },
  {
    value: 'America/Sao_Paulo',
    label: 'America/Sao_Paulo (UTC-03:00) 巴西利亚',
    shortLabel: 'UTC-03:00 圣保罗',
  },
  {
    value: 'America/Godthab',
    label: 'America/Godthab (UTC-03:00) 格陵兰',
    shortLabel: 'UTC-03:00 格陵兰',
  },
  {
    value: 'America/Cayenne',
    label: 'America/Cayenne (UTC-03:00) 卡宴,福塔雷萨',
    shortLabel: 'UTC-03:00',
  },
  {
    value: 'America/Argentina/Buenos_Aires',
    label: 'America/Argentina/Buenos_Aires (UTC-03:00) 布宜诺斯艾利斯',
    shortLabel: 'UTC-03:00 布宜诺斯艾利斯',
  },
  {
    value: 'America/Montevideo',
    label: 'America/Montevideo (UTC-03:00) 蒙得维的亚',
    shortLabel: 'UTC-03:00 蒙得维的亚',
  },
  { value: 'Etc/GMT+2', label: 'Etc/GMT+2 (UTC-02:00) 协调世界时-2', shortLabel: 'UTC-02:00' },
  {
    value: 'Atlantic/Azores',
    label: 'Atlantic/Azores (UTC-01:00) 亚速尔群岛',
    shortLabel: 'UTC-01:00 亚速尔',
  },
  {
    value: 'Africa/Casablanca',
    label: 'Africa/Casablanca (UTC+00:00) 卡萨布兰卡',
    shortLabel: 'UTC+00:00 卡萨布兰卡',
  },
  {
    value: 'Atlantic/Reykjavik',
    label: 'Atlantic/Reykjavik (UTC+00:00) 蒙罗维亚,雷克雅未克',
    shortLabel: 'UTC+00:00 雷克雅未克',
  },
  { value: 'Etc/GMT', label: 'Etc/GMT (UTC+00:00) 协调世界时', shortLabel: 'UTC+00:00 协调世界时' },
  {
    value: 'Europe/Berlin',
    label: 'Europe/Berlin (UTC+01:00) 阿姆斯特丹，柏林，伯尔尼，罗马，斯德哥尔摩，维也纳',
    shortLabel: 'UTC+01:00 柏林',
  },
  {
    value: 'Europe/Paris',
    label: 'Europe/Paris (UTC+01:00) 布鲁塞尔，哥本哈根，马德里，巴黎',
    shortLabel: 'UTC+01:00 巴黎',
  },
  {
    value: 'Africa/Lagos',
    label: 'Africa/Lagos (UTC+01:00) 中非西部',
    shortLabel: 'UTC+01:00 拉各斯',
  },
  {
    value: 'Europe/Budapest',
    label: 'Europe/Budapest (UTC+01:00) 贝尔格莱德，布拉迪斯拉发，布达佩斯，卢布尔雅那，布拉格',
    shortLabel: 'UTC+01:00 布达佩斯',
  },
  {
    value: 'Europe/Warsaw',
    label: 'Europe/Warsaw (UTC+01:00) 萨拉热窝，斯科普里，华沙，萨格勒布',
    shortLabel: 'UTC+01:00 华沙',
  },
  {
    value: 'Europe/Istanbul',
    label: 'Europe/Istanbul (UTC+02:00) 雅典，布加勒斯特，伊斯坦布尔',
    shortLabel: 'UTC+02:00 伊斯坦布尔',
  },
  { value: 'Africa/Cairo', label: 'Africa/Cairo (UTC+02:00) 开罗', shortLabel: 'UTC+02:00 开罗' },
  {
    value: 'Asia/Damascus',
    label: 'Asia/Damascus (UTC+02:00) 大马士革',
    shortLabel: 'UTC+02:00 大马士革',
  },
  { value: 'Asia/Amman', label: 'Asia/Amman (UTC+02:00) 安曼', shortLabel: 'UTC+02:00 安曼' },
  {
    value: 'Africa/Johannesburg',
    label: 'Africa/Johannesburg (UTC+02:00) 哈拉雷，比勒陀利亚',
    shortLabel: 'UTC+02:00 约翰内斯堡',
  },
  {
    value: 'Asia/Jerusalem',
    label: 'Asia/Jerusalem (UTC+02:00) 耶路撒冷',
    shortLabel: 'UTC+02:00 耶路撒冷',
  },
  { value: 'Asia/Beirut', label: 'Asia/Beirut (UTC+02:00) 贝鲁特', shortLabel: 'UTC+02:00 贝鲁特' },
  {
    value: 'Asia/Baghdad',
    label: 'Asia/Baghdad (UTC+03:00) 巴格达',
    shortLabel: 'UTC+03:00 巴格达',
  },
  {
    value: 'Europe/Minsk',
    label: 'Europe/Minsk (UTC+03:00) 明斯克',
    shortLabel: 'UTC+03:00 明斯克',
  },
  { value: 'Asia/Riyadh', label: 'Asia/Riyadh (UTC+03:00) 利雅得', shortLabel: 'UTC+03:00 利雅得' },
  {
    value: 'Africa/Nairobi',
    label: 'Africa/Nairobi (UTC+03:00) 内罗毕',
    shortLabel: 'UTC+03:00 内罗毕',
  },
  { value: 'Asia/Tehran', label: 'Asia/Tehran (UTC+03:30) 德黑兰', shortLabel: 'UTC+03:30 德黑兰' },
  {
    value: 'Europe/Moscow',
    label: 'Europe/Moscow (UTC+04:00) 莫斯科，圣彼得堡，伏尔加格勒',
    shortLabel: 'UTC+04:00 莫斯科',
  },
  {
    value: 'Asia/Tbilisi',
    label: 'Asia/Tbilisi (UTC+04:00) 第比利斯',
    shortLabel: 'UTC+04:00 第比利斯',
  },
  {
    value: 'Asia/Yerevan',
    label: 'Asia/Yerevan (UTC+04:00) 埃里温',
    shortLabel: 'UTC+04:00 埃里温',
  },
  {
    value: 'Asia/Dubai',
    label: 'Asia/Dubai (UTC+04:00) 阿布扎比，马斯喀特',
    shortLabel: 'UTC+04:00 迪拜',
  },
  { value: 'Asia/Baku', label: 'Asia/Baku (UTC+04:00) 巴库', shortLabel: 'UTC+04:00 巴库' },
  {
    value: 'Indian/Mauritius',
    label: 'Indian/Mauritius (UTC+04:00) 路易港',
    shortLabel: 'UTC+04:00 路易港',
  },
  { value: 'Asia/Kabul', label: 'Asia/Kabul (UTC+04:30) 喀布尔', shortLabel: 'UTC+04:30 喀布尔' },
  {
    value: 'Asia/Karachi',
    label: 'Asia/Karachi (UTC+05:00) 伊斯兰堡，卡拉奇',
    shortLabel: 'UTC+05:00 卡拉奇',
  },
  {
    value: 'Asia/Colombo',
    label: 'Asia/Colombo (UTC+05:30) 斯里加亚渥登普拉',
    shortLabel: 'UTC+05:30 科伦坡',
  },
  {
    value: 'Asia/Kolkata',
    label: 'Asia/Kolkata (UTC+05:30) 钦奈，加尔各答，新德里',
    shortLabel: 'UTC+05:30 新德里',
  },
  {
    value: 'Asia/Almaty',
    label: 'Asia/Almaty (UTC+06:00) 阿斯塔纳',
    shortLabel: 'UTC+06:00 阿拉木图',
  },
  { value: 'Asia/Dhaka', label: 'Asia/Dhaka (UTC+06:00) 达卡', shortLabel: 'UTC+06:00 达卡' },
  {
    value: 'Asia/Bangkok',
    label: 'Asia/Bangkok (UTC+07:00) 曼谷，河内，雅加达',
    shortLabel: 'UTC+07:00 曼谷',
  },
  {
    value: 'Asia/Novosibirsk',
    label: 'Asia/Novosibirsk (UTC+07:00) 新西伯利亚',
    shortLabel: 'UTC+07:00 新西伯利亚',
  },
  {
    value: 'Asia/Shanghai',
    label: 'Asia/Shanghai (UTC+08:00) 北京，重庆，中国香港，乌鲁木齐',
    shortLabel: 'UTC+08:00 上海',
  },
  {
    value: 'Australia/Perth',
    label: 'Australia/Perth (UTC+08:00) 佩思',
    shortLabel: 'UTC+08:00 珀斯',
  },
  { value: 'Asia/Taipei', label: 'Asia/Taipei (UTC+08:00) 台北', shortLabel: 'UTC+08:00 台北' },
  { value: 'Asia/Seoul', label: 'Asia/Seoul (UTC+09:00) 首尔', shortLabel: 'UTC+09:00 首尔' },
  {
    value: 'Asia/Tokyo',
    label: 'Asia/Tokyo (UTC+09:00) 大阪，札幌，东京',
    shortLabel: 'UTC+09:00 东京',
  },
  {
    value: 'Australia/Darwin',
    label: 'Australia/Darwin (UTC+09:30) 达尔文',
    shortLabel: 'UTC+09:30 达尔文',
  },
  {
    value: 'Australia/Adelaide',
    label: 'Australia/Adelaide (UTC+09:30) 阿德莱德',
    shortLabel: 'UTC+09:30 阿德莱德',
  },
  {
    value: 'Australia/Brisbane',
    label: 'Australia/Brisbane (UTC+10:00) 布里斯班',
    shortLabel: 'UTC+10:00 布里斯班',
  },
  {
    value: 'Pacific/Port_Moresby',
    label: 'Pacific/Port_Moresby (UTC+10:00) 关岛，莫尔兹比港',
    shortLabel: 'UTC+10:00 莫尔兹比港',
  },
  {
    value: 'Australia/Sydney',
    label: 'Australia/Sydney (UTC+10:00) 堪培拉，墨尔本，悉尼',
    shortLabel: 'UTC+10:00 悉尼',
  },
  {
    value: 'Pacific/Guadalcanal',
    label: 'Pacific/Guadalcanal (UTC+11:00) 所罗门群岛，新喀里多尼亚',
    shortLabel: 'UTC+11:00',
  },
  { value: 'Etc/GMT-12', label: 'Etc/GMT-12 (UTC+12:00) 协调世界时+12', shortLabel: 'UTC+12:00' },
  {
    value: 'Pacific/Fiji',
    label: 'Pacific/Fiji (UTC+12:00) 斐济，马绍尔群岛',
    shortLabel: 'UTC+12:00 斐济',
  },
  {
    value: 'Pacific/Auckland',
    label: 'Pacific/Auckland (UTC+12:00) 奥克兰，惠灵顿',
    shortLabel: 'UTC+12:00 奥克兰',
  },
  {
    value: 'Pacific/Tongatapu',
    label: 'Pacific/Tongatapu (UTC+13:00) 努库阿洛法',
    shortLabel: 'UTC+13:00 努库阿洛法',
  },
])

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
