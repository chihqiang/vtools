import { type RouteRecordRaw } from 'vue-router'
import { HomeGroup, type HomeRouteMeta } from '@/types/route'

const encryptionRoutes: RouteRecordRaw[] = [
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
    path: '/key-pair',
    name: 'key-pair',
    component: () => import('@/views/encryption/KeyPairGenerator.vue'),
    meta: {
      showOnHome: true,
      title: '密钥对生成器',
      description: '生成 RSA 密钥对，支持公钥和私钥格式',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'indigo',
      group: HomeGroup.ENCRYPTION_TOOLS,
    } as HomeRouteMeta,
  },
]

export default encryptionRoutes
