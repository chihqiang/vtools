<template>
  <div class="bg-gray-50 rounded-xl border border-gray-200 p-6">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 左侧输入 -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-gray-800 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-blue-500"></span>
            输入
            <span
              v-if="leftContent.trim()"
              class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
            >
              {{ formatNames[leftType] }}
            </span>
          </h3>

          <div class="flex gap-2">
            <button
              @click="swapContent"
              class="px-3 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700"
            >
              🔄 交换
            </button>
            <button
              @click="clearLeft"
              class="px-3 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
            >
              清空
            </button>
          </div>
        </div>

        <div class="border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
          <div class="overflow-y-auto" :style="{ height: containerHeight }">
            <textarea
              v-model="leftContent"
              @input="debouncedConvert"
              placeholder="请输入或粘贴 JSON 或 YAML..."
              class="w-full h-full p-4 font-mono text-sm bg-gray-50 focus:bg-white focus:outline-none resize-none"
              spellcheck="false"
            />
          </div>
        </div>
      </div>

      <!-- 右侧输出 -->
      <div>
        <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h3 class="font-semibold text-gray-800 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-green-500"></span>
            输出
            <span
              v-if="rightContent"
              class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
            >
              {{ formatNames[rightType] }}
            </span>
          </h3>

          <div class="flex flex-wrap items-center gap-3">
            <!-- JSON 选项 -->
            <div v-if="rightType === 'json'" class="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-md">
              <label class="text-sm text-gray-600">缩进:</label>
              <input
                type="number"
                v-model="jsonIndent"
                min="0"
                max="8"
                class="w-16 px-2 py-1 border rounded-md text-sm"
              />
              <label class="flex items-center gap-1 text-sm text-gray-600">
                <input type="checkbox" v-model="jsonSortKeys" />
                排序
              </label>
            </div>

            <!-- YAML 选项 -->
            <div v-if="rightType === 'yaml'" class="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-md">
              <label class="text-sm text-gray-600">缩进:</label>
              <input
                type="number"
                v-model="yamlIndent"
                min="1"
                max="8"
                class="w-16 px-2 py-1 border rounded-md text-sm"
              />
            </div>

            <div class="flex gap-2">
              <button
                @click="copyRight"
                class="px-3 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
              >
                复制
              </button>
              <button
                @click="downloadRight"
                class="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
              >
                下载
              </button>
              <button
                @click="clearRight"
                class="px-3 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
              >
                清空
              </button>
            </div>
          </div>
        </div>

        <div class="border border-gray-300 rounded-lg overflow-hidden bg-white">
          <div class="overflow-y-auto bg-gray-50" :style="{ height: containerHeight }">
            <pre v-if="rightContent" class="p-4 font-mono text-sm whitespace-pre-wrap">{{
              rightContent
            }}</pre>

            <div v-else class="flex items-center justify-center h-full text-gray-400">
              等待转换结果
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as YAML from 'yaml'
import { useToast } from '@/composables/useToast'
import { debounce } from 'lodash'

/* ================= Toast ================= */
const toast = useToast()

/* ================= 类型 ================= */
type JsonValue = string | number | boolean | null | JsonObject | JsonArray
type JsonObject = { [key: string]: JsonValue }
type JsonArray = JsonValue[]

/* ================= 状态 ================= */
const leftContent = ref('')
const rightContent = ref('')

const leftType = ref<'json' | 'yaml'>('json')
const rightType = ref<'json' | 'yaml'>('yaml')

const containerHeight = ref('400px')

/* ================= 选项 ================= */
const jsonIndent = ref(2)
const jsonSortKeys = ref(false)
const yamlIndent = ref(2)

const formatNames = { json: 'JSON', yaml: 'YAML' }

/* ================= 高度计算（关键） ================= */
const calculateHeight = () => {
  const viewport = window.innerHeight
  const reserved = 260 // 页面头部 + padding + 选项区
  containerHeight.value = `${Math.max(360, viewport - reserved)}px`
}

onMounted(() => {
  calculateHeight()
  window.addEventListener('resize', calculateHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', calculateHeight)
})
watch([jsonIndent, jsonSortKeys, yamlIndent], () => {
  if (leftContent.value.trim()) {
    convertContent()
  }
})
/* ================= 工具 ================= */

const detectInput = (content: string) => {
  try {
    return { type: 'json' as const, data: JSON.parse(content) as JsonValue }
  } catch {
    return { type: 'yaml' as const, data: YAML.parse(content) as JsonValue }
  }
}

const sortObject = (v: JsonValue | undefined): JsonValue => {
  if (v === undefined) return null
  if (Array.isArray(v)) {
    return v.map((item) => {
      return sortObject(item)
    })
  }
  if (v && typeof v === 'object') {
    return Object.keys(v)
      .sort()
      .reduce((acc: JsonObject, k) => {
        acc[k] = sortObject(v[k])
        return acc
      }, {})
  }
  return v
}

const convert = (data: JsonValue, format: 'json' | 'yaml') => {
  if (format === 'json') {
    const output = jsonSortKeys.value ? sortObject(data) : data
    return JSON.stringify(output, null, jsonIndent.value)
  }
  return YAML.stringify(data, { indent: yamlIndent.value })
}

/* ================= 转换 ================= */
let hasToast = false

const convertContent = (showToast = false) => {
  if (!leftContent.value.trim()) {
    rightContent.value = ''
    hasToast = false
    return
  }

  try {
    const { type, data } = detectInput(leftContent.value)
    leftType.value = type
    rightType.value = type === 'json' ? 'yaml' : 'json'
    rightContent.value = convert(data, rightType.value)

    if (showToast || !hasToast) {
      toast.success(`${formatNames[leftType.value]} → ${formatNames[rightType.value]} 转换成功`)
      hasToast = true
    }
  } catch {
    rightContent.value = ''
    hasToast = false
  }
}

const debouncedConvert = debounce(() => convertContent(false), 300)

/* ================= 操作 ================= */
const clearLeft = () => {
  leftContent.value = ''
  rightContent.value = ''
  hasToast = false
  toast.warning('已清空输入')
}

const clearRight = () => {
  rightContent.value = ''
  toast.warning('已清空输出')
}

const copyRight = async () => {
  if (!rightContent.value) return
  await navigator.clipboard.writeText(rightContent.value)
  toast.success('已复制')
}
const downloadRight = () => {
  if (!rightContent.value) return

  const blob = new Blob([rightContent.value], { type: 'text/plain;charset=utf-8' })
  const filename = `data.${rightType.value}`

  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  toast.success(`已下载 ${filename}`)
}
const swapContent = () => {
  if (!rightContent.value) return
  leftContent.value = rightContent.value
  rightContent.value = ''
  hasToast = false
  convertContent(true)
}
</script>
