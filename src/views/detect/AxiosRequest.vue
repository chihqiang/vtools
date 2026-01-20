<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <h1 class="text-2xl font-bold text-gray-800">HTTP 请求构建器（基于 Axios）</h1>
    </div>

    <div class="flex gap-6">
      <!-- 左侧：请求历史记录 -->
      <div
        class="w-1/4 min-w-[250px] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col"
      >
        <div class="p-3 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-sm font-medium text-gray-700">请求历史</h3>
          <button
            @click="clearHistory"
            class="text-xs text-red-500 hover:text-red-700 transition"
            :disabled="requestHistory.length === 0"
          >
            清空历史
          </button>
        </div>
        <div class="overflow-y-auto flex-1">
          <div v-if="requestHistory.length === 0" class="p-4 text-xs text-gray-500 text-center">
            暂无请求历史
          </div>
          <div
            v-for="item in requestHistory"
            :key="item.id"
            @click="restoreRequestFromHistory(item)"
            class="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition group"
          >
            <div class="flex items-start gap-2 mb-1">
              <span
                class="text-xs font-medium px-1.5 py-0.5 rounded"
                :class="getStatusClass(item.statusCode)"
              >
                {{ item.method }}
              </span>
              <span class="text-xs font-medium text-gray-700 flex-1 truncate">
                {{ item.url }}
              </span>
              <button
                @click.stop="deleteHistoryItem(item.id)"
                class="text-gray-400 hover:text-red-500 text-xs opacity-0 group-hover:opacity-100 transition"
              >
                删除
              </button>
            </div>
            <div class="flex items-center gap-2 text-xs">
              <span class="text-gray-500">
                {{ new Date(item.timestamp).toLocaleString() }}
              </span>
              <span class="text-gray-500">•</span>
              <span :class="getStatusTextClass(item.statusCode)">
                {{ item.statusCode }}
              </span>
              <span class="text-gray-500">•</span>
              <span class="text-gray-500"> {{ item.responseTime }}ms </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：请求构建器 -->
      <div class="flex-1 bg-white rounded-lg shadow-sm border border-gray-200">
        <!-- 请求方式和地址 -->
        <div class="p-4 border-b border-gray-200">
          <div class="flex flex-wrap gap-2 items-center">
            <select
              v-model="request.method"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 min-w-[100px]"
            >
              <option v-for="method in httpMethods" :key="method" :value="method">
                {{ method }}
              </option>
            </select>
            <input
              v-model="request.url"
              placeholder="输入请求地址"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 min-w-[200px]"
            />
            <button
              @click="sendRequest"
              :disabled="isLoading"
              class="px-6 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {{ isLoading ? '发送中...' : '发送请求' }}
            </button>
            <button
              @click="clearAll"
              class="px-6 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition"
            >
              清空
            </button>
          </div>
        </div>

        <!-- 请求内容选项卡（Body和Header） -->
        <div class="border-b border-gray-200">
          <div class="flex">
            <button
              v-for="tab in contentTabs"
              :key="tab.value"
              @click="activeContentTab = tab.value"
              :class="[
                'px-4 py-2 text-sm font-medium',
                activeContentTab === tab.value
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
              ]"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <!-- 请求内容 -->
        <div class="border-b border-gray-200">
          <!-- Body选项卡 -->
          <div v-if="activeContentTab === 'body'">
            <!-- 请求体参数选项卡 -->
            <div class="border-b border-gray-200">
              <div class="flex">
                <button
                  v-for="tab in paramTabs"
                  :key="tab.value"
                  @click="activeParamTab = tab.value"
                  :class="[
                    'px-4 py-2 text-sm font-medium',
                    activeParamTab === tab.value
                      ? 'border-b-2 border-indigo-500 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
                  ]"
                >
                  {{ tab.label }}
                </button>
              </div>
            </div>

            <!-- 请求体参数内容 -->
            <div class="p-4 border-b border-gray-200">
              <!-- form-data -->
              <div v-if="activeParamTab === 'form-data'" class="space-y-4">
                <div
                  v-for="(item, index) in formDataParams"
                  :key="index"
                  class="flex gap-2 flex-wrap"
                >
                  <input
                    v-model="item.key"
                    placeholder="键"
                    class="w-1/6 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                  <select
                    v-model="item.type"
                    class="w-1/6 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option
                      v-for="type in paramTypes"
                      :key="type"
                      :value="type"
                      :disabled="isUrlEncodedMode && type === ParamType.FILE"
                    >
                      {{ type }}
                    </option>
                  </select>
                  <div class="flex-1 flex gap-2">
                    <input
                      v-if="item.type !== ParamType.FILE"
                      v-model="item.value"
                      placeholder="值"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
                    />
                    <div v-if="item.type === ParamType.FILE" class="flex-1 relative">
                      <input
                        type="file"
                        @change="handleFileChange($event, index)"
                        class="absolute inset-0 opacity-0 cursor-pointer"
                        aria-hidden="true"
                      />
                      <div
                        class="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md text-sm focus-within:ring-2 focus-within:ring-indigo-500"
                      >
                        <span class="text-gray-500">
                          {{ item.file ? item.file.name : '选择文件' }}
                        </span>
                        <span class="bg-indigo-100 text-indigo-600 text-xs px-2 py-1 rounded">
                          浏览
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    @click="removeFormDataParam(index)"
                    class="px-3 py-2 bg-red-100 text-red-600 rounded-md text-sm hover:bg-red-200 transition"
                  >
                    删除
                  </button>
                </div>
                <button
                  @click="addFormDataParam"
                  class="px-4 py-2 bg-green-100 text-green-600 rounded-md text-sm hover:bg-green-200 transition"
                >
                  添加参数
                </button>
              </div>

              <!-- x-www-form-urlencoded -->
              <div v-else-if="activeParamTab === 'x-www-form-urlencoded'" class="space-y-4">
                <div
                  v-for="(item, index) in urlEncodedParams"
                  :key="index"
                  class="flex gap-2 flex-wrap"
                >
                  <input
                    v-model="item.key"
                    placeholder="键"
                    class="w-1/6 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                  <select
                    v-model="item.type"
                    class="w-1/6 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option
                      v-for="type in paramTypes"
                      :key="type"
                      :value="type"
                      :disabled="type === ParamType.FILE"
                    >
                      {{ type }}
                    </option>
                  </select>
                  <input
                    v-model="item.value"
                    placeholder="值"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    @click="removeUrlEncodedParam(index)"
                    class="px-3 py-2 bg-red-100 text-red-600 rounded-md text-sm hover:bg-red-200 transition"
                  >
                    删除
                  </button>
                </div>
                <button
                  @click="addUrlEncodedParam"
                  class="px-4 py-2 bg-green-100 text-green-600 rounded-md text-sm hover:bg-green-200 transition"
                >
                  添加参数
                </button>
              </div>

              <!-- json -->
              <div v-else-if="activeParamTab === 'json'" class="space-y-4">
                <textarea
                  v-model="jsonParams"
                  placeholder="输入JSON格式的参数"
                  class="w-full h-64 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>

              <!-- Query Params -->
              <div v-else-if="activeParamTab === 'query-params'" class="space-y-4">
                <div v-for="(item, index) in queryParams" :key="index" class="flex gap-2">
                  <input
                    v-model="item.key"
                    placeholder="键"
                    class="w-1/4 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    v-model="item.value"
                    placeholder="值"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    @click="removeQueryParam(index)"
                    class="px-3 py-2 bg-red-100 text-red-600 rounded-md text-sm hover:bg-red-200 transition"
                  >
                    删除
                  </button>
                </div>
                <button
                  @click="addQueryParam"
                  class="px-4 py-2 bg-green-100 text-green-600 rounded-md text-sm hover:bg-green-200 transition"
                >
                  添加参数
                </button>
              </div>
            </div>
          </div>

          <!-- Header选项卡 -->
          <div v-else-if="activeContentTab === 'header'">
            <div class="p-4 border-b border-gray-200">
              <div class="space-y-4">
                <div v-for="(item, index) in requestHeaders" :key="index" class="flex gap-2">
                  <input
                    v-model="item.key"
                    placeholder="键"
                    class="w-1/4 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    v-model="item.value"
                    placeholder="值"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    @click="removeRequestHeader(index)"
                    class="px-3 py-2 bg-red-100 text-red-600 rounded-md text-sm hover:bg-red-200 transition"
                  >
                    删除
                  </button>
                </div>
                <div>
                  <button
                    @click="addRequestHeader"
                    class="px-4 py-2 bg-green-100 text-green-600 rounded-md text-sm hover:bg-green-200 transition"
                  >
                    添加请求头
                  </button>
                </div>
                <!-- 预设请求头按钮组 -->
                <div class="flex flex-wrap gap-2 mt-2">
                  <button
                    v-for="(preset, index) in presetHeaders"
                    :key="index"
                    @click="addPresetHeader(preset)"
                    class="px-3 py-2 bg-blue-100 text-blue-600 rounded-md text-xs hover:bg-blue-200 transition whitespace-nowrap"
                  >
                    {{ preset.key }}: {{ preset.value }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 响应结果 -->
        <div class="p-4">
          <h3 class="text-sm font-medium text-gray-700 mb-3">响应结果</h3>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-gray-500 mb-1">状态码</p>
                <p class="text-sm font-medium">{{ response.statusCode }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 mb-1">响应时间</p>
                <p class="text-sm font-medium">{{ response.responseTime }}ms</p>
              </div>
            </div>
            <div>
              <div class="flex items-center justify-between mb-1">
                <p class="text-xs text-gray-500">响应头</p>
                <button
                  @click="isHeadersExpanded = !isHeadersExpanded"
                  class="text-xs text-indigo-500 hover:text-indigo-700 transition"
                >
                  {{ isHeadersExpanded ? '收起' : '展开' }}
                </button>
              </div>
              <pre
                v-if="isHeadersExpanded"
                class="text-xs font-mono p-2 bg-gray-50 border border-gray-200 rounded overflow-x-auto"
                >{{ JSON.stringify(response.headers, null, 2) }}</pre
              >
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">响应体</p>
              <pre
                class="text-xs font-mono p-2 bg-gray-50 border border-gray-200 rounded overflow-x-auto"
                >{{ formatResponseBody(response.body, response.headers['content-type']) }}</pre
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'
import { Dexie, type Table } from 'dexie'
import { useToast } from '@/composables/useToast'

// 初始化toast组件
const toast = useToast()

// HTTP方法枚举
enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
}

// HTTP方法数组，用于模板循环
const httpMethods = Object.values(HttpMethod)

// 参数类型枚举
enum ParamType {
  STRING = 'string',
  INT = 'int',
  BOOL = 'bool',
  NUMBER = 'number',
  ARRAY = 'array',
  FILE = 'file',
}

// 参数类型数组，用于模板循环
const paramTypes = Object.values(ParamType)

// 请求状态
interface RequestParam {
  key: string
  value: string
  type: ParamType
}

interface FormDataParam extends RequestParam {
  file?: File | null
}

// 请求头接口（不需要type字段）
interface RequestHeader {
  key: string
  value: string
}

interface Request {
  method: HttpMethod
  url: string
}

interface Response {
  statusCode: string
  headers: Record<string, string>
  body: unknown
  responseTime: number
}

// 请求数据
const request = reactive<Request>({
  method: HttpMethod.GET,
  url: '',
})

// 请求内容选项卡（Body和Header）
const activeContentTab = ref('body')
const contentTabs = [
  { label: 'Body', value: 'body' },
  { label: 'Header', value: 'header' },
]

// 常见预设请求头
const presetHeaders = [
  { key: 'Content-Type', value: 'application/json' },
  { key: 'Content-Type', value: 'application/x-www-form-urlencoded' },
  { key: 'Content-Type', value: 'multipart/form-data' },
  { key: 'Accept', value: 'application/json' },
  { key: 'Authorization', value: 'Bearer {token}' },
  { key: 'User-Agent', value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
  { key: 'X-Requested-With', value: 'XMLHttpRequest' },
  { key: 'Cache-Control', value: 'no-cache' },
  { key: 'Origin', value: 'https://tools.zhiqiag.wang' },
  { key: 'Referer', value: 'https://tools.zhiqiag.wang' },
]

// 请求体参数选项卡
const activeParamTab = ref<string>('x-www-form-urlencoded')
const paramTabs = [
  { label: 'form-data', value: 'form-data' },
  { label: 'x-www-form-urlencoded', value: 'x-www-form-urlencoded' },
  { label: 'json', value: 'json' },
  { label: 'Query Params', value: 'query-params' },
]

// 请求参数
const formDataParams = reactive<FormDataParam[]>([
  { key: '', value: '', type: ParamType.STRING, file: null },
])
const urlEncodedParams = reactive<RequestParam[]>([{ key: '', value: '', type: ParamType.STRING }])
const jsonParams = ref('')
const queryParams = reactive<RequestParam[]>([{ key: '', value: '', type: ParamType.STRING }])

// 请求头
const requestHeaders = reactive<RequestHeader[]>([{ key: '', value: '' }])

// 响应数据
const response = reactive<Response>({
  statusCode: '',
  headers: {},
  body: '',
  responseTime: 0,
})

// 加载状态
const isLoading = ref(false)

// 响应头折叠/展开状态
const isHeadersExpanded = ref(true)

// 计算属性：当前是否为x-www-form-urlencoded模式
const isUrlEncodedMode = computed(() => activeParamTab.value === 'x-www-form-urlencoded')

// 请求历史记录相关
interface RequestHistoryItem {
  id: string
  timestamp: number
  method: HttpMethod
  url: string
  statusCode: string
  responseTime: number
  // 存储请求的关键信息，用于恢复请求
  requestData: {
    method: HttpMethod
    url: string
    activeContentTab: string
    activeParamTab: string
    formDataParams: FormDataParam[]
    urlEncodedParams: RequestParam[]
    jsonParams: string
    queryParams: RequestParam[]
    requestHeaders: RequestHeader[]
  }
}

// 创建Dexie数据库
class RequestHistoryDB extends Dexie {
  requestHistory!: Table<RequestHistoryItem, string>

  constructor() {
    super('HttpRequestHistoryDB')

    // 定义数据库架构
    this.version(1).stores({
      requestHistory: 'id, timestamp, method, url, statusCode, responseTime', // 定义索引
    })
  }
}

// 初始化数据库实例
const db = new RequestHistoryDB()

// 尝试打开数据库并检查状态
db.open().catch((error) => {
  toast.error(`Failed to open database: ${error instanceof Error ? error.message : String(error)}`)
})

// 请求历史记录
const requestHistory = ref<RequestHistoryItem[]>([])

// 加载历史记录
const loadRequestHistory = async () => {
  try {
    // 获取所有记录
    const allRecords = await db.requestHistory.toArray()

    // 按时间倒序排序
    const sortedRecords = allRecords.sort((a, b) => b.timestamp - a.timestamp)

    // 更新UI
    requestHistory.value = sortedRecords
  } catch (error) {
    toast.error(
      `Failed to load request history: ${error instanceof Error ? error.message : String(error)}`,
    )
    requestHistory.value = []
  }
}

// 添加请求到历史记录
const addToHistory = async (requestData: RequestHistoryItem['requestData'], response: Response) => {
  // 完全重写历史记录存储逻辑，使用最简单的方式确保数据可序列化

  // 直接构建纯JavaScript对象，不使用任何Vue响应式对象
  const historyItem: RequestHistoryItem = {
    id: Date.now().toString(),
    timestamp: Date.now(),
    method: requestData.method as HttpMethod, // 确保类型正确
    url: requestData.url,
    statusCode: response.statusCode,
    responseTime: response.responseTime,
    requestData: {
      method: requestData.method as HttpMethod,
      url: requestData.url,
      activeContentTab: requestData.activeContentTab,
      activeParamTab: requestData.activeParamTab,
      // 处理formDataParams - 过滤掉key为空格的参数
      formDataParams: requestData.formDataParams
        .filter((param: FormDataParam) => param.key.trim() !== '')
        .map((param: FormDataParam) => ({
          key: param.key,
          value: param.value,
          type: param.type,
          file: null, // 确保file为null
        })),
      // 处理urlEncodedParams - 过滤掉key为空格的参数
      urlEncodedParams: requestData.urlEncodedParams
        .filter((param: RequestParam) => param.key.trim() !== '')
        .map((param: RequestParam) => ({
          key: param.key,
          value: param.value,
          type: param.type,
        })),
      // 处理jsonParams
      jsonParams: requestData.jsonParams,
      // 处理queryParams - 过滤掉key为空格的参数
      queryParams: requestData.queryParams
        .filter((param: RequestParam) => param.key.trim() !== '')
        .map((param: RequestParam) => ({
          key: param.key,
          value: param.value,
          type: param.type,
        })),
      // 处理requestHeaders - 过滤掉key为空格的参数
      requestHeaders: requestData.requestHeaders
        .filter((header: RequestHeader) => header.key.trim() !== '')
        .map((header: RequestHeader) => ({
          key: header.key,
          value: header.value,
        })),
    },
  }

  // 再次使用JSON序列化/反序列化确保数据完全纯净
  const pureHistoryItem = JSON.parse(JSON.stringify(historyItem))

  try {
    // 添加新记录到数据库 - 使用完全纯净的数据
    await db.requestHistory.add(pureHistoryItem)

    // 立即更新UI，确保数据显示
    requestHistory.value.unshift(pureHistoryItem)
  } catch (error) {
    toast.error(
      `Failed to save request history: ${error instanceof Error ? error.message : String(error)}`,
    )
    // 如果数据库操作失败，至少在内存中显示记录
    requestHistory.value.unshift(pureHistoryItem)
  }
}

// 从历史记录中恢复请求
const restoreRequestFromHistory = (item: RequestHistoryItem) => {
  // 恢复请求基本信息
  request.method = item.requestData.method
  request.url = item.requestData.url

  // 恢复选项卡状态
  activeContentTab.value = item.requestData.activeContentTab
  activeParamTab.value = item.requestData.activeParamTab

  // 恢复参数
  formDataParams.length = 0
  item.requestData.formDataParams.forEach((param) => formDataParams.push({ ...param, file: null }))

  urlEncodedParams.length = 0
  item.requestData.urlEncodedParams.forEach((param) => urlEncodedParams.push({ ...param }))

  jsonParams.value = item.requestData.jsonParams

  queryParams.length = 0
  item.requestData.queryParams.forEach((param) => queryParams.push({ ...param }))

  // 恢复请求头
  requestHeaders.length = 0
  item.requestData.requestHeaders.forEach((header) => requestHeaders.push({ ...header }))
}

// 删除历史记录项
const deleteHistoryItem = async (id: string) => {
  try {
    // 从数据库删除
    await db.requestHistory.delete(id)
    // 立即从UI中移除，提供即时反馈
    requestHistory.value = requestHistory.value.filter((item) => item.id !== id)
  } catch (error) {
    toast.error(
      `Failed to delete history item: ${error instanceof Error ? error.message : String(error)}`,
    )
    // 如果数据库删除失败，至少从UI中移除
    requestHistory.value = requestHistory.value.filter((item) => item.id !== id)
  }
}

// 清空历史记录
const clearHistory = async () => {
  try {
    // 从数据库清空
    await db.requestHistory.clear()
    // 立即清空UI
    requestHistory.value = []
  } catch (error) {
    toast.error(
      `Failed to clear history: ${error instanceof Error ? error.message : String(error)}`,
    )
    // 如果数据库清空失败，至少清空UI
    requestHistory.value = []
  }
}

// 获取状态码对应的颜色类
const getStatusClass = (statusCode: string) => {
  const code = parseInt(statusCode, 10)
  if (code >= 200 && code < 300) {
    return 'bg-green-100 text-green-700'
  } else if (code >= 300 && code < 400) {
    return 'bg-yellow-100 text-yellow-700'
  } else if (code >= 400 && code < 500) {
    return 'bg-orange-100 text-orange-700'
  } else if (code >= 500) {
    return 'bg-red-100 text-red-700'
  }
  return 'bg-gray-100 text-gray-700'
}

// 获取状态码文本的颜色类
const getStatusTextClass = (statusCode: string) => {
  const code = parseInt(statusCode, 10)
  if (code >= 200 && code < 300) {
    return 'text-green-600'
  } else if (code >= 300 && code < 400) {
    return 'text-yellow-600'
  } else if (code >= 400 && code < 500) {
    return 'text-orange-600'
  } else if (code >= 500) {
    return 'text-red-600'
  }
  return 'text-gray-600'
}

// 组件挂载时加载历史记录
onMounted(() => {
  loadRequestHistory()
})

// 通用参数操作函数
const addParam = <T,>(array: T[], defaultValue: T) => {
  array.push(defaultValue)
}

const removeParam = <T,>(array: T[], index: number) => {
  if (array.length > 1) {
    array.splice(index, 1)
  }
}

// 处理文件上传
const handleFileChange = (event: Event, index: number) => {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (files && files.length > 0 && index < formDataParams.length) {
    // 使用类型断言确保参数存在
    const param = formDataParams[index] as FormDataParam
    param.file = files[0]
  }
}

// 添加和删除参数
const addFormDataParam = () => {
  addParam(formDataParams, { key: '', value: '', type: ParamType.STRING, file: null })
}

const removeFormDataParam = (index: number) => {
  removeParam(formDataParams, index)
}

const addUrlEncodedParam = () => {
  addParam(urlEncodedParams, { key: '', value: '', type: ParamType.STRING })
}

const removeUrlEncodedParam = (index: number) => {
  removeParam(urlEncodedParams, index)
}

// 添加和删除请求头
const addRequestHeader = () => {
  addParam(requestHeaders, { key: '', value: '' })
}

const removeRequestHeader = (index: number) => {
  removeParam(requestHeaders, index)
}

// 添加预设请求头
const addPresetHeader = (preset: RequestHeader) => {
  // 检查是否已存在相同的key
  const existingIndex = requestHeaders.findIndex(
    (h) => h.key.toLowerCase() === preset.key.toLowerCase(),
  )
  if (existingIndex !== -1 && requestHeaders[existingIndex]) {
    // 更新现有请求头的值
    requestHeaders[existingIndex].value = preset.value
  } else {
    // 添加新的请求头
    addParam(requestHeaders, { ...preset })
  }
}

// 添加和删除查询参数
const addQueryParam = () => {
  addParam(queryParams, { key: '', value: '', type: ParamType.STRING })
}

const removeQueryParam = (index: number) => {
  removeParam(queryParams, index)
}

// 构建带查询参数的URL
const buildUrlWithQueryParams = (url: string) => {
  if (activeParamTab.value !== 'query-params') {
    return url
  }

  // 确保URL不包含未编码的空格
  const encodedUrl = url.replace(/\s+/g, '%20')

  const params = queryParams
    .filter((p) => p.key)
    .map((p) => {
      const convertedValue = convertParamValue(p.value, p.type)
      if (Array.isArray(convertedValue)) {
        // 对于数组类型，使用key[]=value1&key[]=value2的格式
        return convertedValue
          .map((val) => `${encodeURIComponent(p.key)}[]=${encodeURIComponent(String(val))}`)
          .join('&')
      }
      return `${encodeURIComponent(p.key)}=${encodeURIComponent(String(convertedValue))}`
    })
    .join('&')

  if (!params) {
    return encodedUrl
  }

  const separator = encodedUrl.includes('?') ? '&' : '?'
  return `${encodedUrl}${separator}${params}`
}

// 发送请求
const sendRequest = async () => {
  if (!request.url) {
    // 清空之前的响应数据
    response.statusCode = ''
    response.headers = {}
    response.body = ''
    response.responseTime = 0
    // 弹出错误提示
    toast.error('请输入请求地址')
    return
  }

  // 简单的URL验证
  try {
    new URL(request.url)
  } catch {
    // 清空之前的响应数据
    response.statusCode = ''
    response.headers = {}
    response.body = ''
    response.responseTime = 0
    // 弹出错误提示
    toast.error('请输入有效的URL地址')
    return
  }

  isLoading.value = true
  const startTime = Date.now()

  try {
    // 构建axios请求配置
    const config: AxiosRequestConfig = {
      method: request.method,
      headers: {
        ...getHeadersObject(),
      },
      // 禁用axios的自动JSON解析，以便手动处理不同类型的响应
      responseType: 'text' as const,
    }

    // 只有当Content-Type不为空时才添加
    const contentType = getContentType()
    if (contentType) {
      config.headers = {
        'Content-Type': contentType,
        ...config.headers,
      }
    }

    // 添加请求体
    if (
      request.method !== HttpMethod.GET &&
      request.method !== HttpMethod.HEAD &&
      activeParamTab.value !== 'query-params'
    ) {
      config.data = await getRequestBody()
    }

    // 构建带查询参数的URL，并确保URL中的空格被正确编码
    const urlWithQueryParams = buildUrlWithQueryParams(request.url.replace(/\s+/g, '%20'))

    // 发送请求
    const responseData = await axios(urlWithQueryParams, config)
    const endTime = Date.now()

    // 处理响应
    response.statusCode = responseData.status.toString()
    response.responseTime = endTime - startTime

    // 解析响应头
    const headers: Record<string, string> = {}
    for (const [key, value] of Object.entries(responseData.headers)) {
      if (value) {
        headers[key] = Array.isArray(value) ? value.join(', ') : String(value)
      }
    }
    response.headers = headers

    // 解析响应体
    response.body = responseData.data

    // 添加到历史记录
    addToHistory(
      {
        method: request.method,
        url: request.url,
        activeContentTab: activeContentTab.value,
        activeParamTab: activeParamTab.value,
        formDataParams: JSON.parse(JSON.stringify(formDataParams)), // 深拷贝，移除文件对象
        urlEncodedParams: [...urlEncodedParams],
        jsonParams: jsonParams.value,
        queryParams: [...queryParams],
        requestHeaders: [...requestHeaders],
      },
      response,
    )
  } catch (error) {
    // 从Axios错误中提取实际的状态码
    let statusCode = '500'
    let errorMessage = '请求失败'

    if (error instanceof Error) {
      // 使用类型保护检查是否是Axios错误
      const isAxiosError = (
        err: Error,
      ): err is Error & { response?: { status?: number; data?: unknown }; request?: unknown } => {
        return 'response' in err || 'request' in err
      }

      if (isAxiosError(error)) {
        if (error.response && typeof error.response.status === 'number') {
          // 请求发出且服务器返回了状态码，但状态码不在2xx范围内
          statusCode = error.response.status.toString()
          // 确保错误信息是字符串类型
          errorMessage = error.response.data ? String(error.response.data) : error.message
        } else if (error.request) {
          // 请求发出但没有收到响应
          errorMessage = '网络错误，未收到服务器响应'
        } else {
          // 请求配置错误
          errorMessage = error.message
        }
      } else {
        // 其他类型的错误
        errorMessage = error.message
      }
    }

    response.statusCode = statusCode
    response.body = errorMessage
    response.responseTime = Date.now() - startTime

    // 弹出错误提示
    toast.error(`请求失败 (${statusCode}): ${errorMessage}`)

    // 移除失败请求的历史记录添加，只记录成功的请求
  } finally {
    isLoading.value = false
  }
}

// 获取内容类型
const getContentType = () => {
  if (activeParamTab.value === 'json') {
    return 'application/json'
  } else if (activeParamTab.value === 'x-www-form-urlencoded') {
    return 'application/x-www-form-urlencoded'
  } else {
    return '' // 对于form-data和query-params，不需要手动设置Content-Type
  }
}

// 获取请求头对象
const getHeadersObject = () => {
  const headers: Record<string, string> = {}
  requestHeaders.forEach((header) => {
    if (header.key && header.value) {
      headers[header.key] = header.value
    }
  })
  return headers
}

// 根据参数类型转换值
const convertParamValue = (
  value: string,
  type: ParamType,
): string | number | boolean | string[] => {
  try {
    switch (type) {
      case ParamType.INT:
        return parseInt(value, 10)
      case ParamType.NUMBER:
        return parseFloat(value)
      case ParamType.BOOL:
        const lowerValue = value.toLowerCase()
        return lowerValue === 'true' || lowerValue === '1' || lowerValue === 'yes'
      case ParamType.ARRAY:
        // 假设数组值使用逗号分隔
        return value.split(',').map((item) => item.trim())
      case ParamType.STRING:
      case ParamType.FILE:
      default:
        return value
    }
  } catch {
    // 转换失败时返回原始值
    return value
  }
}

// 获取请求体
const getRequestBody = async () => {
  if (activeParamTab.value === 'json' && jsonParams.value) {
    return jsonParams.value
  } else if (activeParamTab.value === 'x-www-form-urlencoded') {
    const params = urlEncodedParams
      .filter((p) => p.key) // 只包含有键的参数
      .map((p) => {
        const convertedValue = convertParamValue(p.value, p.type)
        if (Array.isArray(convertedValue)) {
          // 对于数组类型，使用key[]=value1&key[]=value2的格式
          return convertedValue
            .map((val) => `${encodeURIComponent(p.key)}[]=${encodeURIComponent(String(val))}`)
            .join('&')
        }
        return `${encodeURIComponent(p.key)}=${encodeURIComponent(String(convertedValue))}`
      })
      .join('&')
    return params
  } else if (activeParamTab.value === 'form-data') {
    const formData = new FormData()
    formDataParams.forEach((param) => {
      if (param.key && param.type === ParamType.FILE && param.file) {
        formData.append(param.key, param.file)
      } else if (param.key) {
        const convertedValue = convertParamValue(param.value, param.type)
        if (Array.isArray(convertedValue)) {
          // 对于数组类型，使用key[]=value1&key[]=value2的格式
          convertedValue.forEach((val) => {
            formData.append(`${param.key}[]`, String(val))
          })
        } else {
          formData.append(param.key, String(convertedValue))
        }
      }
    })
    return formData
  }
  return ''
}

// 格式化响应体
const formatResponseBody = (body: unknown, contentType: string = '') => {
  if (typeof body !== 'string') {
    return JSON.stringify(body, null, 2)
  }

  // 根据Content-Type处理不同格式
  if (contentType.includes('application/json') || contentType.includes('text/json')) {
    try {
      return JSON.stringify(JSON.parse(body), null, 2)
    } catch {
      return body // JSON解析失败，返回原始字符串
    }
  } else {
    // 其他类型内容直接返回
    return body
  }
}

// 清空所有
const clearAll = () => {
  request.method = HttpMethod.GET
  request.url = ''

  formDataParams.splice(0, formDataParams.length)
  formDataParams.push({ key: '', value: '', type: ParamType.STRING, file: null })

  urlEncodedParams.splice(0, urlEncodedParams.length)
  urlEncodedParams.push({ key: '', value: '', type: ParamType.STRING })

  jsonParams.value = ''

  queryParams.splice(0, queryParams.length)
  queryParams.push({ key: '', value: '', type: ParamType.STRING })

  requestHeaders.splice(0, requestHeaders.length)
  requestHeaders.push({ key: '', value: '' })

  response.statusCode = ''
  response.headers = {}
  response.body = ''
  response.responseTime = 0
}
</script>

<style scoped>
/* 组件样式 */
</style>
