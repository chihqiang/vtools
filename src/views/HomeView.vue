<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">在线工具列表</h2>
    <p class="text-gray-600 mb-6">选择一个工具开始使用</p>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <RouterLink v-for="tool in tools" :key="tool.name" :to="tool.path" :class="[
        'group relative overflow-hidden rounded-xl p-6 bg-white border-2 border-gray-200 text-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1',
        'hover:border-' + tool.color + '-500',
      ]">
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-4">
            <div :class="[
              'w-12 h-12 rounded-lg flex items-center justify-center',
              'bg-' + tool.color + '-100',
            ]">
              <SvgIcon :iconPath="tool.icon as string" :size="24"
                :className="['w-6 h-6', 'text-' + tool.color + '-600'].join(' ').trim()" />
            </div>
            <div :class="[
              'w-8 h-8 rounded-full flex items-center justify-center',
              'bg-' + tool.color + '-100',
            ]">
              <SvgIcon :iconPath="'M9 5l7 7-7 7'" :size="16" :className="[
                  'w-4 h-4',
                  'text-' + tool.color + '-600',
                  'transform',
                  'group-hover:translate-x-1',
                  'transition-transform',
                ]
                  .join(' ')
                  .trim()
                " />
            </div>
          </div>
          <h3 class="font-bold text-xl mb-2">{{ tool.title }}</h3>
          <p class="text-gray-600 text-sm">{{ tool.description }}</p>
        </div>
        <div :class="[
          'absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300',
          'bg-' + tool.color + '-500',
        ]"></div>
      </RouterLink>

      <div
        class="group relative overflow-hidden rounded-xl p-6 bg-white border-2 border-gray-200 text-gray-800 shadow-lg opacity-60">
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6">
                </path>
              </svg>
            </div>
            <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <h3 class="font-bold text-xl mb-2">更多工具</h3>
          <p class="text-gray-600 text-sm">敬请期待更多实用工具...</p>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-gray-400"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import router from '@/router'
import SvgIcon from '@/components/SvgIcon.vue'

// 获取需要在首页显示的工具
const tools = computed(() => {
  return router.getRoutes()
    .filter(route => route.meta?.showOnHome)
    .map(route => ({
      name: route.name as string,
      path: route.path,
      title: route.meta?.title || '',
      description: route.meta?.description || '',
      icon: route.meta?.icon || 'M12 6v6m0 0v6m0-6h6m-6 0H6',
      color: route.meta?.color || 'gray'
    }))
})
</script>
