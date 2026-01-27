import { type RouteRecordRaw } from 'vue-router'
import { HomeGroup, type HomeRouteMeta } from '@/types/route'

const mediaRoutes: RouteRecordRaw[] = [
  {
    path: '/media-txt-reader',
    name: 'media-txt-reader',
    component: () => import('@/views/media/TxtReader.vue'),
    meta: {
      showOnHome: true,
      title: 'TXT在线阅读器',
      description: '智能编码检测，解决中文乱码问题 | 文字转语音与自动滚动阅读',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      color: 'blue',
      group: HomeGroup.MEDIA_TOOLS,
    } as HomeRouteMeta,
  },
]

export default mediaRoutes
