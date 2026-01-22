import { type RouteRecordRaw } from 'vue-router'
import { HomeGroup, type HomeRouteMeta } from '@/types/route'

const imageRoutes: RouteRecordRaw[] = [
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
    path: '/image-converter',
    name: 'image-converter',
    component: () => import('@/views/image/ImageConverter.vue'),
    meta: {
      showOnHome: true,
      title: '图片格式转换',
      description: '图片格式转换工具,支持 JPG、PNG、WebP、GIF 格式互相转换',
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
      color: 'green',
      group: HomeGroup.IMAGE_TOOLS,
    } as HomeRouteMeta,
  },
]

export default imageRoutes
