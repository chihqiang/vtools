import { type RouteRecordRaw } from 'vue-router'
import { HomeGroup, type HomeRouteMeta } from '@/types/route'

const netRoutes: RouteRecordRaw[] = [
  {
    path: '/net-tools',
    name: 'net-tools',
    component: () => import('@/views/net/Tools.vue'),
    meta: {
      showOnHome: true,
      title: '网络工具',
      description: 'HTTP Ping、端口检测、DNS解析、网速测试',
      icon: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0',
      color: 'indigo',
      group: HomeGroup.NETWORK_TOOLS,
    } as HomeRouteMeta,
  },
  {
    path: '/net-browser',
    name: 'net-browser',
    component: () => import('@/views/net/Browser.vue'),
    meta: {
      showOnHome: true,
      title: '浏览器信息',
      description: '检测浏览器详细信息，包括系统、硬件、网络等',
      icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      color: 'gray',
      group: HomeGroup.NETWORK_TOOLS,
    } as HomeRouteMeta,
  },
  {
    path: '/net-http',
    name: 'net-http',
    component: () => import('@/views/net/Http.vue'),
    meta: {
      showOnHome: true,
      title: 'API 接口调试工具',
      description: '构建并发送 HTTP 请求，支持多种请求方法与参数格式，便于接口调试与测试',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      color: 'blue',
      group: HomeGroup.NETWORK_TOOLS,
    } as HomeRouteMeta,
  },
  {
    path: '/net-websocket',
    name: 'net-websocket',
    component: () => import('@/views/net/Websocket.vue'),
    meta: {
      showOnHome: true,
      title: 'WebSocket 测试工具',
      description: '连接并测试 WebSocket 服务，支持发送和接收消息，查看连接状态和历史记录',
      icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      color: 'purple',
      group: HomeGroup.NETWORK_TOOLS,
    } as HomeRouteMeta,
  },
]

export default netRoutes
