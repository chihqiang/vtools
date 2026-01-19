import { createRouter, createWebHashHistory } from 'vue-router'
import { HomeGroup, type HomeRouteMeta } from '@/types/route'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: {
        title: '在线工具集',
        description: '提供多种在线工具，包括时间戳转换、JSON格式化、加密解密等实用工具',
      } as HomeRouteMeta,
    },
    {
      path: '/json-formatter',
      name: 'json-formatter',
      component: () => import('@/views/json/FormatterView.vue'),
      meta: {
        showOnHome: true,
        title: 'JSON 格式化',
        description: 'JSON 格式化工具，支持格式化、压缩、高亮显示等功能',
        icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.964-5.964a1 1 0 00-.707-.293l-5.964 5.964A1 1 0 003 16V7a2 2 0 012-2z',
        color: 'green',
        group: HomeGroup.JSON_TOOLS,
      } as HomeRouteMeta,
    },
    {
      path: '/json-table',
      name: 'json-table',
      component: () => import('@/views/json/TableView.vue'),
      meta: {
        showOnHome: true,
        title: 'JSON 转表格',
        description: '将 JSON 数据转换为表格格式，并支持下载 CSV 文件',
        icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z',
        color: 'purple',
        group: HomeGroup.JSON_TOOLS,
      } as HomeRouteMeta,
    },
    {
      path: '/json-yml',
      name: 'json-yml',
      component: () => import('@/views/json/YmlView.vue'),
      meta: {
        showOnHome: true,
        title: 'JSON YAML 转换',
        description: 'JSON 和 YAML 格式之间的转换工具，支持双向转换',
        icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
        color: 'yellow',
        group: HomeGroup.JSON_TOOLS,
      } as HomeRouteMeta,
    },
    {
      path: '/faker',
      name: 'faker',
      component: () => import('@/views/json/FakerView.vue'),
      meta: {
        showOnHome: true,
        title: 'Mock数据生成器',
        description: '使用faker-js/faker生成mock数据，支持自定义JSON结构',
        icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        color: 'green',
        group: HomeGroup.JSON_TOOLS,
      } as HomeRouteMeta,
    },
    {
      path: '/string-converter',
      name: 'string-converter',
      component: () => import('@/views/strings/ConverterView.vue'),
      meta: {
        showOnHome: true,
        title: '字符串转换',
        description: '字符串转换工具，支持多种转换方式',
        icon: 'M13 10V3L4 14h7v7l9-11h-7z',
        color: 'orange',
        group: HomeGroup.STRING_TOOLS,
      } as HomeRouteMeta,
    },
    {
      path: '/string-random',
      name: 'string-random',
      component: () => import('@/views/strings/RandomGenView.vue'),
      meta: {
        showOnHome: true,
        title: '随机字符串生成器',
        description: '生成安全的随机字符串，支持自定义长度和字符类型',
        icon: 'M15 7a2 2 0 012 2m2 0a2 2 0 01-2-2m2 0a2 2 0 01-2-2m2 0a2 2 0 01-2-2m2 0a2 2 0 01-2-2m2 0a2 2 0 01-2-2M9 7a2 2 0 012 2m2 0a2 2 0 01-2-2m2 0a2 2 0 01-2-2m2 0a2 2 0 01-2-2',
        color: 'blue',
        group: HomeGroup.STRING_TOOLS,
      } as HomeRouteMeta,
    },
    {
      path: '/string-diff',
      name: 'string-diff',
      component: () => import('@/views/strings/DiffView.vue'),
      meta: {
        showOnHome: true,
        title: '字符串对比',
        description: '比较两个字符串的差异，高亮显示不同的部分',
        icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2-2v-2a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 012 2h2a2 2 0 012 2v2a2 2 0 012-2h-2a2 2 0 00-2-2V7a2 2 0 00-2 2zm0 5a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H9a1 1 0 01-1-1v-2a1 1 0 00-1-1H6a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 00-1-1H6a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 00-1-1H6a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 00-1-1H6a1 1 0 00-1 1v2a1 1 0 001 1z',
        color: 'cyan',
        group: HomeGroup.STRING_TOOLS,
      } as HomeRouteMeta,
    },
    {
      path: '/image-favicon',
      name: 'image-favicon',
      component: () => import('@/views/image/FaviconGenerator.vue'),
      meta: {
        showOnHome: true,
        title: 'Favicon 生成器',
        description: '生成各种尺寸和格式的 Favicon 图标，支持上传图片和自定义配置',
        icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7',
        color: 'teal',
        group: HomeGroup.IMAGE_TOOLS,
      } as HomeRouteMeta,
    },
    {
      path: '/qrcode-generator',
      name: 'qrcode-generator',
      component: () => import('@/views/image/QrcodeGenerator.vue'),
      meta: {
        showOnHome: true,
        title: '二维码生成',
        description: '生成自定义二维码',
        icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        color: 'green',
        group: HomeGroup.IMAGE_TOOLS,
      } as HomeRouteMeta,
    },
    {
      path: '/qrcode-scanner',
      name: 'qrcode-scanner',
      component: () => import('@/views/image/QrcodeScanner.vue'),
      meta: {
        showOnHome: true,
        title: '二维码识别',
        description: '识别图片或摄像头中的二维码',
        icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
        color: 'blue',
        group: HomeGroup.IMAGE_TOOLS,
      } as HomeRouteMeta,
    },
    {
      path: '/crontab',
      name: 'crontab',
      component: () => import('@/views/development/CrontabView.vue'),
      meta: {
        showOnHome: true,
        title: 'Crontab 工具',
        description: 'Crontab 表达式解析、验证和执行时间生成工具',
        icon: 'M12 22c1.105 0 2-.895 2-2h-4c0 1.105.895 2 2 2zm6-6v-5c0-3.072-1.639-5.647-4.5-6.32V4c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5v.68C9.639 5.353 8 7.928 8 11v5l-2 2v1h16v-1l-2-2z',
        color: 'purple',
        group: HomeGroup.DEVELOPMENT_TOOLS,
      } as HomeRouteMeta,
    },
    {
      path: '/timestamp',
      name: 'timestamp',
      component: () => import('@/views/development/TimestampView.vue'),
      meta: {
        showOnHome: true,
        title: '时间戳工具',
        description: '时间戳转换工具，支持秒级和毫秒级时间戳转换',
        icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
        color: 'blue',
        group: HomeGroup.DEVELOPMENT_TOOLS,
      } as HomeRouteMeta,
    },
    {
      path: '/encryption',
      name: 'encryption',
      component: () => import('@/views/encryption/EncryptionView.vue'),
      meta: {
        showOnHome: true,
        title: '加密解密工具',
        description: '支持Base64、URL编码解码和MD5加密',
        icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
        color: 'red',
        group: HomeGroup.ENCRYPTION_TOOLS,
      } as HomeRouteMeta,
    },
    {
      path: '/jwt',
      name: 'jwt',
      component: () => import('@/views/encryption/JwtView.vue'),
      meta: {
        showOnHome: true,
        title: 'JWT 解析工具',
        description: 'JWT Token 解析工具，支持解码 Header、Payload 和验证签名',
        icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        color: 'indigo',
        group: HomeGroup.ENCRYPTION_TOOLS,
      } as HomeRouteMeta,
    },
    {
      path: '/network',
      name: 'network',
      component: () => import('@/views/detect/NetworkView.vue'),
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
      path: '/browser-info',
      name: 'browser-info',
      component: () => import('@/views/detect/BrowserInfoView.vue'),
      meta: {
        showOnHome: true,
        title: '浏览器信息',
        description: '检测浏览器详细信息，包括系统、硬件、网络等',
        icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
        color: 'gray',
        group: HomeGroup.NETWORK_TOOLS,
      } as HomeRouteMeta,
    },
  ],
})

router.beforeEach((to, from, next) => {
  const meta = to.meta as HomeRouteMeta

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
