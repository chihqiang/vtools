<template>
  <div class="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
    <!-- 标题 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6">
      <h1 class="text-xl sm:text-2xl font-bold text-gray-800">WebSocket 测试工具</h1>
    </div>

    <div class="flex flex-col lg:flex-row gap-4 sm:gap-6">
      <!-- 左侧设置区域 -->
      <div class="w-full lg:w-[450px] space-y-4">
        <!-- 服务器地址 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-3 border-b border-gray-200">
            <h3 class="text-sm font-medium text-gray-700">服务器地址</h3>
          </div>
          <div class="p-3 space-y-3">
            <input
              v-model="connection.url"
              placeholder="ws:// 或 wss:// 地址"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
            />
            <div class="flex gap-2">
              <button
                v-if="!isConnected"
                @click="connect"
                :disabled="isConnecting || !connection.url"
                class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {{ isConnecting ? '连接中...' : '连接' }}
              </button>
              <button
                v-else
                @click="disconnect"
                class="flex-1 px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition"
              >
                断开连接
              </button>
              <button
                @click="clearAll"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition"
              >
                清空
              </button>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-500">状态:</span>
              <span class="text-xs font-medium px-2 py-0.5 rounded" :class="getStatusClass()">
                {{ getStatusText() }}
              </span>
              <span v-if="isConnected" class="text-xs text-gray-500 ml-auto">
                {{ connectionDuration }}
              </span>
            </div>
          </div>
        </div>

        <!-- 心跳检测 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-3 border-b border-gray-200">
            <h3 class="text-sm font-medium text-gray-700">心跳检测</h3>
          </div>
          <div class="p-3 space-y-4">
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2 flex-1">
                <span class="text-xs text-gray-500">每隔</span>
                <input
                  v-model.number="heartbeat.interval"
                  type="number"
                  min="1"
                  :disabled="heartbeat.active"
                  placeholder="间隔"
                  class="w-16 px-2 py-1.5 border border-gray-300 rounded-md text-xs focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <span class="text-xs text-gray-500">秒发送内容</span>
                <div class="flex items-center gap-2">
                  <span
                    class="px-2 py-1 text-xs bg-gray-200 rounded cursor-pointer"
                    @click="toggleHeartbeatMessage"
                  >
                    {{ heartbeatMessages[selectedHeartbeatIndex] }}
                  </span>
                </div>
              </div>
              <button
                @click="toggleHeartbeat"
                :class="[
                  'px-3 py-1.5 rounded-md text-xs transition',
                  heartbeat.active
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700',
                ]"
              >
                {{ heartbeat.active ? '停止发送' : '开始发送' }}
              </button>
            </div>
          </div>
        </div>

        <!-- 连接信息 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-3 border-b border-gray-200">
            <h3 class="text-sm font-medium text-gray-700">连接信息</h3>
          </div>
          <div class="p-3 space-y-2 text-xs">
            <div class="flex justify-between">
              <span class="text-gray-500">发送消息数:</span>
              <span class="font-medium">{{ sentCount }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">接收消息数:</span>
              <span class="font-medium">{{ receivedCount }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">心跳发送数:</span>
              <span class="font-medium">{{ heartbeatCount }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">连接时间:</span>
              <span class="font-medium">{{
                connectionTime ? formatTime(connectionTime) : '-'
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">连接时长:</span>
              <span class="font-medium">{{ connectionDuration }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：消息列表和发送区域 -->
      <div class="flex-1 space-y-4">
        <!-- 消息列表 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-[600px]">
          <div class="p-3 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
            <h3 class="text-sm font-medium text-gray-700">消息列表</h3>
            <button
              @click="clearMessages"
              class="text-xs text-red-500 hover:text-red-700 transition"
              :disabled="messages.length === 0"
            >
              清空消息
            </button>
          </div>
          <!-- 固定高度 + 滚动 -->
          <div
            ref="messagesContainer"
            class="flex-1 overflow-y-auto bg-gray-50 px-3 py-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          >
            <div v-if="messages.length === 0" class="text-xs text-gray-500 text-center py-8">
              暂无消息记录
            </div>
            <div
              v-for="(msg, index) in messages"
              :key="index"
              class="flex w-full mb-3"
              :class="getMessageContainerClass(msg)"
            >
              <div
                class="p-3 rounded-lg border text-xs max-w-[80%] overflow-y-auto"
                :class="getMessageClass(msg)"
              >
                <div class="flex justify-between items-center mb-1 flex-shrink-0">
                  <span class="font-medium text-gray-600">{{ getMessageLabel(msg) }}</span>
                  <span class="text-gray-400">{{ formatTime(msg.timestamp) }}</span>
                </div>
                <pre class="whitespace-pre-wrap break-all font-mono">{{ msg.content }}</pre>
              </div>
            </div>
          </div>
        </div>

        <!-- 发送消息内容 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-3 border-b border-gray-200">
            <h3 class="text-sm font-medium text-gray-700">发送消息</h3>
          </div>
          <div class="p-3">
            <div class="flex gap-3">
              <textarea
                v-model="messageContent"
                placeholder="输入消息内容"
                class="flex-1 h-32 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:ring-2 focus:ring-indigo-500 resize-none"
              ></textarea>
              <button
                @click="sendMessage"
                :disabled="!isConnected"
                class="w-28 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition disabled:bg-indigo-400 disabled:cursor-not-allowed self-start"
              >
                发送消息
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onUnmounted, nextTick } from 'vue'
import { useToast } from '@/composables/useToast'

const toast = useToast()

/**
 * 连接配置接口
 */
interface Connection {
  /** WebSocket 服务器地址 */
  url: string
}

/**
 * 消息接口
 */
interface Message {
  /** 消息类型：发送、接收、心跳 */
  type: 'sent' | 'received' | 'heartbeat'
  /** 消息内容 */
  content: string
  /** 消息时间戳 */
  timestamp: number
}

/**
 * 心跳配置接口
 */
interface Heartbeat {
  /** 是否启用心跳 */
  enabled: boolean
  /** 心跳间隔（秒） */
  interval: number
  /** 是否正在发送心跳 */
  active: boolean
}

// 连接配置
const connection = reactive<Connection>({ url: '' })
// 连接状态
const isConnected = ref(false)
// 连接中状态
const isConnecting = ref(false)
// 连接时间戳
const connectionTime = ref<number | null>(null)
// 连接时长定时器
const connectionDurationTimer = ref<ReturnType<typeof setInterval> | null>(null)
// 连接时长文本
const connectionDuration = ref('0秒')

// 消息输入内容
const messageContent = ref('')

// 心跳配置
const heartbeat = reactive<Heartbeat>({ enabled: false, interval: 30, active: false })
// 心跳消息列表
const heartbeatMessages = ref(['ping', 'hello', 'heartbeat'])
// 当前选中的心跳消息索引
const selectedHeartbeatIndex = ref(0)
// 心跳定时器
const heartbeatTimer = ref<ReturnType<typeof setInterval> | null>(null)
// 心跳发送次数
const heartbeatCount = ref(0)

// 消息列表
const messages = ref<Message[]>([])
// 发送消息次数
const sentCount = ref(0)
// 接收消息次数
const receivedCount = ref(0)

// WebSocket 实例
let ws: WebSocket | null = null
// 消息容器 DOM 引用
const messagesContainer = ref<HTMLDivElement | null>(null)

/**
 * 获取状态样式类
 */
const getStatusClass = () =>
  isConnecting.value
    ? 'bg-yellow-100 text-yellow-700'
    : isConnected.value
      ? 'bg-green-100 text-green-700'
      : 'bg-gray-100 text-gray-700'

/**
 * 获取状态文本
 */
const getStatusText = () =>
  isConnecting.value ? '连接中' : isConnected.value ? '已连接' : '未连接'

/**
 * 获取消息容器样式类
 * @param msg 消息对象
 */
const getMessageContainerClass = (msg: Message) =>
  msg.type === 'heartbeat'
    ? 'justify-center'
    : msg.type === 'sent'
      ? 'justify-end'
      : 'justify-start'

/**
 * 获取消息样式类
 * @param msg 消息对象
 */
const getMessageClass = (msg: Message) =>
  msg.type === 'heartbeat'
    ? 'bg-purple-100 border-purple-400 text-purple-800'
    : msg.type === 'sent'
      ? 'bg-blue-100 border-blue-400 text-blue-800'
      : 'bg-green-100 border-green-400 text-green-800'

/**
 * 获取消息标签
 * @param msg 消息对象
 */
const getMessageLabel = (msg: Message) =>
  msg.type === 'heartbeat' ? '心跳' : msg.type === 'sent' ? '发送' : '接收'

/**
 * 格式化时间戳
 * @param ts 时间戳
 */
const formatTime = (ts: number) => new Date(ts).toLocaleTimeString()

/**
 * 滚动到消息底部
 */
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

/**
 * 连接 WebSocket
 */
const connect = () => {
  if (!connection.url) return toast.error('请输入WebSocket地址')
  isConnecting.value = true
  try {
    ws = new WebSocket(connection.url)

    // 连接成功回调
    ws.onopen = () => {
      isConnected.value = true
      isConnecting.value = false
      connectionTime.value = Date.now()
      // 重置计数和状态
      sentCount.value = 0
      receivedCount.value = 0
      heartbeatCount.value = 0
      heartbeat.active = false
      messages.value = []
      // 启动连接时长计时器
      startConnectionDurationTimer()
      // 如果启用了心跳，启动心跳
      if (heartbeat.enabled) startHeartbeat()
      toast.success('WebSocket连接成功')
    }

    // 接收消息回调
    ws.onmessage = (e) => {
      receivedCount.value++
      messages.value.push({ type: 'received', content: e.data, timestamp: Date.now() })
      scrollToBottom()
    }

    // 错误回调
    ws.onerror = (e) => {
      console.error(e)
      toast.error('WebSocket连接错误')
      isConnecting.value = false
      stopHeartbeat()
    }

    // 关闭回调
    ws.onclose = () => {
      isConnected.value = false
      isConnecting.value = false
      stopConnectionDurationTimer()
      stopHeartbeat()
      toast.info('WebSocket连接已关闭')
    }
  } catch (e) {
    console.error(e)
    toast.error('连接失败')
    isConnecting.value = false
  }
}

/**
 * 断开 WebSocket 连接
 */
const disconnect = () => {
  ws?.close()
  ws = null
}

/**
 * 发送消息
 */
const sendMessage = () => {
  if (!isConnected.value) return toast.error('请先连接WebSocket')
  if (!messageContent.value.trim()) return toast.error('请输入消息内容')

  const content = messageContent.value
  ws?.send(content)

  // 更新计数和消息列表
  sentCount.value++
  messages.value.push({ type: 'sent', content, timestamp: Date.now() })
  scrollToBottom()

  // 清空输入框
  messageContent.value = ''
  toast.success('消息发送成功')
}

/**
 * 切换心跳消息
 */
const toggleHeartbeatMessage = () => {
  selectedHeartbeatIndex.value = (selectedHeartbeatIndex.value + 1) % heartbeatMessages.value.length
}

/**
 * 切换心跳状态
 */
const toggleHeartbeat = () => {
  heartbeat.enabled = !heartbeat.enabled
  if (heartbeat.enabled && isConnected.value) {
    startHeartbeat()
  } else {
    stopHeartbeat()
  }
}

/**
 * 启动心跳
 */
const startHeartbeat = () => {
  // 先停止现有心跳
  stopHeartbeat()

  if (!heartbeat.enabled || !isConnected.value) return

  heartbeat.active = true

  heartbeatTimer.value = setInterval(() => {
    if (ws?.readyState === WebSocket.OPEN) {
      // 获取当前心跳消息，默认使用 'ping'
      const hbMsg = heartbeatMessages.value[selectedHeartbeatIndex.value] || 'ping'
      ws.send(hbMsg)

      // 更新计数和消息列表
      heartbeatCount.value++
      messages.value.push({ type: 'heartbeat', content: hbMsg, timestamp: Date.now() })
      scrollToBottom()
    }
  }, heartbeat.interval * 1000)
}

/**
 * 停止心跳
 */
const stopHeartbeat = () => {
  heartbeat.active = false
  if (heartbeatTimer.value) {
    clearInterval(heartbeatTimer.value)
    heartbeatTimer.value = null
  }
}

/**
 * 启动连接时长计时器
 */
const startConnectionDurationTimer = () => {
  stopConnectionDurationTimer()

  connectionDurationTimer.value = setInterval(() => {
    if (!connectionTime.value) return

    const diff = Date.now() - connectionTime.value
    const sec = Math.floor(diff / 1000)
    const min = Math.floor(sec / 60)
    const hour = Math.floor(min / 60)

    // 格式化连接时长
    connectionDuration.value =
      hour > 0
        ? `${hour}小时${min % 60}分钟${sec % 60}秒`
        : min > 0
          ? `${min}分钟${sec % 60}秒`
          : `${sec}秒`
  }, 1000)
}
/**
 * 停止连接时长计时器
 */
const stopConnectionDurationTimer = () => {
  if (connectionDurationTimer.value) {
    clearInterval(connectionDurationTimer.value)
    connectionDurationTimer.value = null
  }
}

/**
 * 清空消息
 */
const clearMessages = () => {
  messages.value = []
  sentCount.value = 0
  receivedCount.value = 0
  heartbeatCount.value = 0
}

/**
 * 清空所有
 */
const clearAll = () => {
  disconnect()
  connection.url = ''
  messageContent.value = ''
  clearMessages()
  connectionTime.value = null
  connectionDuration.value = '0秒'
  stopHeartbeat()
}

/**
 * 组件卸载时清理资源
 */
onUnmounted(() => {
  // 断开 WebSocket 连接
  disconnect()
  // 停止连接时长计时器
  stopConnectionDurationTimer()
  // 停止心跳
  stopHeartbeat()
})
</script>
