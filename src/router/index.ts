import { createRouter, createWebHashHistory } from 'vue-router'
import { type HomeRouteMeta } from '@/types/route'

// 导入路由模块
import jsonRoutes from '@/router/modules/json'
import textRoutes from '@/router/modules/text'
import imageRoutes from '@/router/modules/image'
import devRoutes from '@/router/modules/dev'
import cryptoRoutes from '@/router/modules/crypto'
import netRoutes from '@/router/modules/net'
import mediaRoutes from '@/router/modules/media'

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
    // 合并所有路由模块
    ...jsonRoutes,
    ...textRoutes,
    ...imageRoutes,
    ...devRoutes,
    ...cryptoRoutes,
    ...netRoutes,
    ...mediaRoutes,
    // 404 页面
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: {
        title: '404 - 页面未找到',
        description: '您访问的页面不存在',
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
