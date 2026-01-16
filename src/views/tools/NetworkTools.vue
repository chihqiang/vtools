<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
    <div class="max-w-7xl mx-auto">
      <div class="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex items-center gap-3">
            <svg class="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 class="text-lg md:text-xl font-semibold text-gray-900">基本信息</h2>
          </div>
          <button
            @click="refreshNetworkInfo"
            :disabled="infoLoading"
            class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg v-if="!infoLoading" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <svg v-else class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ infoLoading ? '刷新中' : '刷新' }}
          </button>
        </div>
        <div v-if="networkInfoItems.length === 0" class="text-center text-gray-600 py-5 text-sm">
          正在获取网络信息...
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
          <div
            v-for="(item, index) in networkInfoItems"
            :key="index"
            class="flex items-center p-4 border border-gray-200 rounded-lg bg-slate-50 hover:border-indigo-500 hover:bg-slate-100 transition-all"
          >
            <span class="text-sm font-medium text-gray-500 min-w-[80px] flex-shrink-0">{{ item.label }}：</span>
            <span class="text-sm font-semibold text-gray-900 font-mono">{{ item.value }}</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
            <div class="flex items-center gap-3">
              <svg class="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
              </svg>
              <h3 class="text-base font-semibold text-gray-900">HTTP Ping 测试</h3>
            </div>
            <button
              @click="runPingTest"
              :disabled="pingLoading"
              class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              {{ pingLoading ? '测试中...' : '开始测试' }}
            </button>
          </div>
          <div class="space-y-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-2">目标主机</label>
              <input
                v-model="pingHost"
                type="text"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="例: www.baidu.com"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-2">测试次数</label>
              <input
                v-model.number="pingCount"
                type="number"
                min="1"
                max="20"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div class="bg-slate-50 rounded-lg p-4 min-h-[200px] max-h-[300px] overflow-y-auto">
            <pre class="font-mono text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{{ pingResult }}</pre>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
            <div class="flex items-center gap-3">
              <svg class="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h3 class="text-base font-semibold text-gray-900">端口检测</h3>
            </div>
            <button
              @click="runPortTest"
              :disabled="portLoading"
              class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              {{ portLoading ? '检测中...' : '检测端口' }}
            </button>
          </div>
          <div class="space-y-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-2">目标主机</label>
              <input
                v-model="portHost"
                type="text"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="例: www.baidu.com"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-2">端口号</label>
              <input
                v-model.number="portNumber"
                type="number"
                min="1"
                max="65535"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-2">超时时间(秒)</label>
              <input
                v-model.number="portTimeout"
                type="number"
                min="1"
                max="30"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div class="bg-slate-50 rounded-lg p-4 min-h-[200px] max-h-[300px] overflow-y-auto">
            <pre class="font-mono text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{{ portResult }}</pre>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
            <div class="flex items-center gap-3">
              <svg class="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <h3 class="text-base font-semibold text-gray-900">DNS 解析</h3>
            </div>
            <button
              @click="runDnsTest"
              :disabled="dnsLoading"
              class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              {{ dnsLoading ? '解析中...' : '解析域名' }}
            </button>
          </div>
          <div class="space-y-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-2">域名</label>
              <input
                v-model="dnsHost"
                type="text"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="例: www.baidu.com"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-2">记录类型</label>
              <select v-model="dnsType" class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
                <option value="A">A (IPv4地址)</option>
                <option value="AAAA">AAAA (IPv6地址)</option>
                <option value="MX">MX (邮件服务器)</option>
                <option value="CNAME">CNAME (别名)</option>
                <option value="TXT">TXT (文本记录)</option>
              </select>
            </div>
          </div>
          <div class="bg-slate-50 rounded-lg p-4 min-h-[200px] max-h-[300px] overflow-y-auto">
            <pre class="font-mono text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{{ dnsResult }}</pre>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
            <div class="flex items-center gap-3">
              <svg class="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 class="text-base font-semibold text-gray-900">网速测试</h3>
            </div>
            <button
              @click="runSpeedTest"
              :disabled="speedLoading"
              class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              {{ speedLoading ? '测试中...' : '开始测试' }}
            </button>
          </div>
          <div class="space-y-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-2">测试URL</label>
              <input
                v-model="speedTestUrl"
                type="text"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="例: https://httpbin.org/bytes/1024"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-2">测试次数</label>
              <input
                v-model.number="speedTestCount"
                type="number"
                min="1"
                max="10"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div class="bg-slate-50 rounded-lg p-4 min-h-[200px] max-h-[300px] overflow-y-auto">
            <pre class="font-mono text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{{ speedResult }}</pre>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow md:col-span-2">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
            <div class="flex items-center gap-3">
              <svg class="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h3 class="text-base font-semibold text-gray-900">HTTP 状态检测</h3>
            </div>
            <button
              @click="runHttpTest"
              :disabled="httpLoading"
              class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              {{ httpLoading ? '检测中...' : '检测状态' }}
            </button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-2">网站URL</label>
              <input
                v-model="httpUrl"
                type="text"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="例: https://www.baidu.com"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-2">请求方法</label>
              <select v-model="httpMethod" class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="HEAD">HEAD</option>
              </select>
            </div>
          </div>
          <div class="bg-slate-50 rounded-lg p-4 min-h-[200px] max-h-[300px] overflow-y-auto">
            <pre class="font-mono text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{{ httpResult }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'

interface NetworkConnection {
  effectiveType?: string
  downlink?: number
  rtt?: number
  saveData?: boolean
}

interface ExtendedNavigator extends Navigator {
  connection?: NetworkConnection
  deviceMemory?: number
}

const toast = useToast()

const pingHost = ref('www.baidu.com')
const pingCount = ref(4)
const pingLoading = ref(false)
const pingResult = ref('点击按钮开始测试网络连通性')

const portHost = ref('www.baidu.com')
const portNumber = ref(80)
const portTimeout = ref(5)
const portLoading = ref(false)
const portResult = ref('点击按钮开始检测端口连通性')

const dnsHost = ref('www.baidu.com')
const dnsType = ref('A')
const dnsLoading = ref(false)
const dnsResult = ref('点击按钮开始DNS解析测试')

const speedTestUrl = ref('https://httpbin.org/bytes/1024')
const speedTestCount = ref(5)
const speedLoading = ref(false)
const speedResult = ref('点击按钮开始网速测试')

const httpUrl = ref('https://www.baidu.com')
const httpMethod = ref('GET')
const httpLoading = ref(false)
const httpResult = ref('点击按钮开始HTTP状态检测')

const networkInfo = ref('正在获取网络信息...')
const infoLoading = ref(false)

const networkInfoItems = ref<Array<{ label: string; value: string }>>([])

onMounted(() => {
  refreshNetworkInfo()
})

const refreshNetworkInfo = async () => {
  infoLoading.value = true
  networkInfoItems.value = []

  try {
    const items: Array<{ label: string; value: string }> = []
    items.push({
      label: '获取时间',
      value: new Date().toLocaleString()
    })
    items.push({
      label: '在线状态',
      value: navigator.onLine ? '在线' : '离线'
    })

    const connection = (navigator as ExtendedNavigator).connection
    if (connection) {
      items.push({
        label: '连接类型',
        value: connection.effectiveType || '未知'
      })
      
      items.push({
        label: '下行速度',
        value: `${connection.downlink || '未知'} Mbps`
      })

      items.push({
        label: '往返时间',
        value: `${connection.rtt || '未知'} ms`
      })

      items.push({
        label: '数据节流',
        value: connection.saveData ? '是' : '否'
      })
    }

    try {
      const ipServices = [
        'https://httpbin.org/ip',
        'https://api.ipify.org?format=json',
        'https://ipinfo.io/json'
      ]

      let ipFound = false
      for (const service of ipServices) {
        try {
          const ipResponse = await fetch(service)
          const ipData = await ipResponse.json()
          const ip = (ipData as { ip?: string; origin?: string; query?: string }).ip || (ipData as { ip?: string; origin?: string; query?: string }).origin || (ipData as { ip?: string; origin?: string; query?: string }).query
          if (ip) {
            items.push({
              label: '公网IP',
              value: ip
            })
            ipFound = true
            break
          }
        } catch {
          continue
        }
      }

      if (!ipFound) {
        items.push({
          label: '公网IP',
          value: '获取失败'
        })
      }
    } catch {
      items.push({
        label: '公网IP',
        value: '获取失败'
      })
    }

    networkInfoItems.value = items
  } catch (error) {
    networkInfo.value = `获取失败: ${error instanceof Error ? error.message : '未知错误'}`
    toast.error('获取网络信息失败')
  } finally {
    infoLoading.value = false
  }
}

const runPingTest = async () => {
  if (!pingHost.value.trim()) {
    toast.error('请输入目标主机地址')
    return
  }

  pingLoading.value = true
  pingResult.value = '正在测试...'

  try {
    let results = `HTTP PING ${pingHost.value} 测试结果:\n`
    results += `测试时间: ${new Date().toLocaleString()}\n`
    results += `目标主机: ${pingHost.value}\n`
    results += `测试次数: ${pingCount.value}\n`
    results += `测试方法: HTTP请求 (浏览器环境限制)\n\n`

    let successCount = 0
    let totalLatency = 0
    let minLatency = Infinity
    let maxLatency = 0

    for (let i = 1; i <= pingCount.value; i++) {
      const startTime = performance.now()

      try {
        let testUrl
        if (pingHost.value.startsWith('http://') || pingHost.value.startsWith('https://')) {
          testUrl = pingHost.value
        } else {
          testUrl = `https://${pingHost.value}`
        }

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000)

        await fetch(testUrl, {
          method: 'HEAD',
          mode: 'no-cors',
          signal: controller.signal,
          cache: 'no-cache'
        })

        clearTimeout(timeoutId)
        const endTime = performance.now()
        const latency = Math.round(endTime - startTime)

        successCount++
        totalLatency += latency
        minLatency = Math.min(minLatency, latency)
        maxLatency = Math.max(maxLatency, latency)

        results += `${i}. 响应时间: ${latency}ms - 连接成功\n`
      } catch (error) {
        const endTime = performance.now()
        const latency = Math.round(endTime - startTime)

        if (error instanceof Error && error.name === 'AbortError') {
          results += `${i}. 请求超时 (>8000ms) - 连接失败\n`
        } else {
          if (latency < 8000 && latency > 0) {
            successCount++
            totalLatency += latency
            minLatency = Math.min(minLatency, latency)
            maxLatency = Math.max(maxLatency, latency)
            results += `${i}. 响应时间: ${latency}ms - 连接成功 (CORS限制)\n`
          } else {
            results += `${i}. 连接失败: 网络不可达\n`
          }
        }
      }

      if (i < pingCount.value) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    results += `\n=== 统计信息 ===\n`
    results += `发送请求: ${pingCount.value} 个\n`
    results += `成功响应: ${successCount} 个\n`
    results += `成功率: ${(successCount / pingCount.value * 100).toFixed(1)}%\n`

    if (successCount > 0) {
      const avgLatency = Math.round(totalLatency / successCount)
      results += `最小延迟: ${minLatency}ms\n`
      results += `最大延迟: ${maxLatency}ms\n`
      results += `平均延迟: ${avgLatency}ms\n`
    }

    results += `\n注意: 浏览器环境使用HTTP请求模拟，结果仅供参考`

    pingResult.value = results
  } catch (error) {
    pingResult.value = `测试失败: ${error instanceof Error ? error.message : '未知错误'}`
    toast.error('测试失败')
  } finally {
    pingLoading.value = false
  }
}

const runPortTest = async () => {
  if (!portHost.value.trim() || !portNumber.value) {
    toast.error('请输入主机地址和端口号')
    return
  }

  portLoading.value = true
  portResult.value = '正在检测...'

  try {
    const startTime = performance.now()

    let testUrl
    if (portNumber.value === 80) {
      testUrl = `http://${portHost.value}`
    } else if (portNumber.value === 443) {
      testUrl = `https://${portHost.value}`
    } else {
      testUrl = `https://${portHost.value}:${portNumber.value}`
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), portTimeout.value * 1000)

    try {
      const response = await fetch(testUrl, {
        method: 'HEAD',
        signal: controller.signal,
        mode: 'no-cors'
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const endTime = performance.now()
      const latency = Math.round(endTime - startTime)

      let result = `端口连通性检测结果:\n`
      result += `测试时间: ${new Date().toLocaleString()}\n`
      result += `目标: ${portHost.value}:${portNumber.value}\n`
      result += `超时设置: ${portTimeout.value}秒\n\n`
      result += `端口状态: 可访问\n`
      result += `响应时间: ${latency}ms\n`
      result += `连接成功`

      portResult.value = result
      toast.success('端口可访问')
    } catch (error) {
      clearTimeout(timeoutId)
      const endTime = performance.now()
      const latency = Math.round(endTime - startTime)

      let result = `端口连通性检测结果:\n`
      result += `测试时间: ${new Date().toLocaleString()}\n`
      result += `目标: ${portHost.value}:${portNumber.value}\n\n`

      if (error instanceof Error && error.name === 'AbortError') {
        result += `端口状态: 超时\n`
        result += `错误信息: 请求超时`
      } else if (latency < portTimeout.value * 1000 && latency > 0) {
        result += `端口状态: 可能开放 (CORS限制)\n`
        result += `响应时间: ${latency}ms`
      } else {
        result += `端口状态: 关闭或被过滤\n`
        result += `错误信息: ${error instanceof Error ? error.name : '未知错误'}`
      }
      result += `\n注意: 浏览器环境限制，仅供参考`

      portResult.value = result
    }
  } catch (error) {
    portResult.value = `检测失败: ${error instanceof Error ? error.message : '未知错误'}`
    toast.error('检测失败')
  } finally {
    portLoading.value = false
  }
}

const runDnsTest = async () => {
  if (!dnsHost.value.trim()) {
    toast.error('请输入域名')
    return
  }

  dnsLoading.value = true
  dnsResult.value = '正在解析...'

  try {
    let results = `DNS 解析测试结果:\n`
    results += `测试时间: ${new Date().toLocaleString()}\n`
    results += `域名: ${dnsHost.value}\n`
    results += `记录类型: ${dnsType.value}\n\n`

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const testUrl = `https://${dnsHost.value}`
      await fetch(testUrl, {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      results += `解析状态: 成功\n`
      results += `说明: 域名可以正常访问\n`
      results += `\n注意: 浏览器环境无法直接查询DNS记录，此测试仅验证域名是否可访问\n`
      results += `如需详细DNS信息，请使用 nslookup 或 dig 命令行工具`
    } catch {
      results += `解析状态: 失败\n`
      results += `错误信息: 域名无法访问或DNS解析失败\n`
      results += `\n注意: 浏览器环境限制，无法直接查询DNS记录`
    }

    dnsResult.value = results
  } catch (error) {
    dnsResult.value = `测试失败: ${error instanceof Error ? error.message : '未知错误'}`
    toast.error('测试失败')
  } finally {
    dnsLoading.value = false
  }
}

const runSpeedTest = async () => {
  if (!speedTestUrl.value.trim()) {
    toast.error('请输入测试URL')
    return
  }

  speedLoading.value = true
  speedResult.value = '正在测试...'

  try {
    let results = `网速测试结果:\n`
    results += `测试时间: ${new Date().toLocaleString()}\n`
    results += `测试URL: ${speedTestUrl.value}\n`
    results += `测试次数: ${speedTestCount.value}\n\n`

    let totalBytes = 0
    let totalTime = 0
    let successCount = 0

    for (let i = 1; i <= speedTestCount.value; i++) {
      const startTime = performance.now()

      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)

        const response = await fetch(speedTestUrl.value, {
          method: 'GET',
          signal: controller.signal,
          cache: 'no-cache'
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const blob = await response.blob()
        const bytes = blob.size
        const endTime = performance.now()
        const duration = (endTime - startTime) / 1000

        totalBytes += bytes
        totalTime += duration
        successCount++

        const speed = (bytes / duration / 1024).toFixed(2)
        results += `${i}. 下载: ${(bytes / 1024).toFixed(2)}KB, 耗时: ${duration.toFixed(2)}s, 速度: ${speed}KB/s\n`
      } catch (error) {
        results += `${i}. 测试失败: ${error instanceof Error ? error.message : '未知错误'}\n`
      }

      if (i < speedTestCount.value) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    results += `\n=== 统计信息 ===\n`
    results += `成功次数: ${successCount}/${speedTestCount.value}\n`
    results += `总下载量: ${(totalBytes / 1024).toFixed(2)}KB\n`
    results += `总耗时: ${totalTime.toFixed(2)}s\n`

    if (successCount > 0 && totalTime > 0) {
      const avgSpeed = (totalBytes / totalTime / 1024).toFixed(2)
      results += `平均速度: ${avgSpeed}KB/s\n`
    }

    speedResult.value = results
  } catch (error) {
    speedResult.value = `测试失败: ${error instanceof Error ? error.message : '未知错误'}`
    toast.error('测试失败')
  } finally {
    speedLoading.value = false
  }
}

const runHttpTest = async () => {
  if (!httpUrl.value.trim()) {
    toast.error('请输入网站URL')
    return
  }

  httpLoading.value = true
  httpResult.value = '正在检测...'

  try {
    const startTime = performance.now()
    const response = await fetch(httpUrl.value, {
      method: httpMethod.value,
      mode: 'cors'
    })
    const endTime = performance.now()

    const responseTime = Math.round(endTime - startTime)

    let result = `HTTP状态检测结果:\n`
    result += `测试时间: ${new Date().toLocaleString()}\n`
    result += `请求URL: ${httpUrl.value}\n`
    result += `请求方法: ${httpMethod.value}\n\n`
    result += `状态码: ${response.status} ${response.statusText}\n`
    result += `响应时间: ${responseTime}ms\n`
    result += `内容类型: ${response.headers.get('content-type') || '未知'}\n`
    result += `服务器: ${response.headers.get('server') || '未知'}`

    httpResult.value = result
  } catch (error) {
    httpResult.value = `HTTP检测失败: ${error instanceof Error ? error.message : '未知错误'}\n\n可能原因:\n- CORS策略限制\n- 网络连接问题\n- 目标服务器不可达`
    toast.error('HTTP检测失败')
  } finally {
    httpLoading.value = false
  }
}
</script>
