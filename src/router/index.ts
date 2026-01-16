import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import TimestampTool from '@/views/tools/TimestampTool.vue'
import JsonFormatter from '@/views/tools/JsonFormatter.vue'
import JsonToTable from '@/views/tools/JsonToTable.vue'
import CaseConverter from '@/views/tools/StringConverter.vue'
import EncryptionTool from '@/views/tools/EncryptionTool.vue'
import StringDiff from '@/views/tools/StringDiff.vue'
import NetworkTools from '@/views/tools/NetworkTools.vue'
import BrowserInfo from '@/views/tools/BrowserInfo.vue'
import StringRandom from '@/views/tools/StringRandom.vue'

// 定义路由元数据类型
type RouteMeta = {
  showOnHome?: boolean
  title?: string
  description?: string
  icon?: string
  color?: string
}

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: '在线工具集',
        description: '提供多种在线工具，包括时间戳转换、JSON格式化、加密解密等实用工具',
      } as RouteMeta,
    },
    {
      path: '/timestamp',
      name: 'timestamp',
      component: TimestampTool,
      meta: {
        showOnHome: true,
        title: '时间戳工具',
        description: '时间戳转换工具，支持秒级和毫秒级时间戳转换',
        icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
        color: 'blue',
      } as RouteMeta,
    },
    {
      path: '/json',
      name: 'json',
      component: JsonFormatter,
      meta: {
        showOnHome: true,
        title: 'JSON 格式化',
        description: 'JSON 格式化工具，支持格式化、压缩、高亮显示等功能',
        icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.964-5.964a1 1 0 00-.707-.293l-5.964 5.964A1 1 0 003 16V7a2 2 0 012-2z',
        color: 'green',
      } as RouteMeta,
    },
    {
      path: '/json-to-table',
      name: 'json-to-table',
      component: JsonToTable,
      meta: {
        showOnHome: true,
        title: 'JSON 转表格',
        description: '将 JSON 数据转换为表格格式，并支持下载 CSV 文件',
        icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z',
        color: 'purple',
      } as RouteMeta,
    },
    {
      path: '/string-converter',
      name: 'string-converter',
      component: CaseConverter,
      meta: {
        showOnHome: true,
        title: '字符串转换',
        description: '字符串转换工具，支持多种转换方式',
        icon: 'M13 10V3L4 14h7v7l9-11h-7z',
        color: 'orange',
      } as RouteMeta,
    },
    {
      path: '/string-random',
      name: 'string-random',
      component: StringRandom,
      meta: {
        showOnHome: true,
        title: '随机字符串生成器',
        description: '生成安全的随机字符串，支持自定义长度和字符类型',
        icon: 'M15 7a2 2 0 012 2m2 0a2 2 0 01-2-2m2 0a2 2 0 01-2-2m2 0a2 2 0 01-2-2m2 0a2 2 0 01-2-2M9 7a2 2 0 012 2m2 0a2 2 0 01-2-2m2 0a2 2 0 01-2-2m2 0a2 2 0 01-2-2',
        color: 'blue',
      } as RouteMeta,
    },
    {
      path: '/string-diff',
      name: 'string-diff',
      component: StringDiff,
      meta: {
        showOnHome: true,
        title: '字符串对比',
        description: '比较两个字符串的差异，高亮显示不同的部分',
        icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2-2v-2a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 012 2h2a2 2 0 012 2v2a2 2 0 012-2h-2a2 2 0 00-2-2V7a2 2 0 00-2 2zm0 5a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H9a1 1 0 01-1-1v-2a1 1 0 00-1-1H6a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 00-1-1H6a1 1 0 00-1 1v2a1 1 0 001 1z',
        color: 'cyan',
      } as RouteMeta,
    },
    {
      path: '/encryption',
      name: 'encryption',
      component: EncryptionTool,
      meta: {
        showOnHome: true,
        title: '加密解密工具',
        description: '支持Base64、URL编码解码和MD5加密',
        icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
        color: 'red',
      } as RouteMeta,
    },
    {
      path: '/network',
      name: 'network',
      component: NetworkTools,
      meta: {
        showOnHome: true,
        title: '网络工具',
        description: 'HTTP Ping、端口检测、DNS解析、网速测试',
        icon: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0',
        color: 'indigo',
      } as RouteMeta,
    },
    {
      path: '/browser-info',
      name: 'browser-info',
      component: BrowserInfo,
      meta: {
        showOnHome: true,
        title: '浏览器信息',
        description: '检测浏览器详细信息，包括系统、硬件、网络等',
        icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
        color: 'gray',
      } as RouteMeta,
    },
  ],
})

router.beforeEach((to, from, next) => {
  const meta = to.meta as RouteMeta

  if (meta.title) {
    document.title = `${meta.title} - 在线工具集`
  } else {
    document.title = '在线工具集'
  }

  let description = meta.description
  if (!description) {
    description = '提供多种在线工具，包括时间戳转换、JSON格式化、加密解密等实用工具'
  }

  let metaDescription = document.querySelector('meta[name="description"]')
  if (!metaDescription) {
    metaDescription = document.createElement('meta')
    metaDescription.setAttribute('name', 'description')
    document.head.appendChild(metaDescription)
  }
  metaDescription.setAttribute('content', description)

  next()
})

export default router
