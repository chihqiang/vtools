<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <!-- 网站描述 -->
    <div class="mb-8 text-center">
      <p class="text-2xl font-medium text-gray-700">
        为开发者和创作者提供的简单、快速、免费的在线工具。
      </p>
    </div>

    <!-- 搜索框 -->
    <div class="mb-10 max-w-2xl mx-auto">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索工具..."
          class="w-full px-5 py-4 pl-14 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
        />
        <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- 按分组显示工具 -->
    <div class="space-y-8">
      <!-- 遍历每个分组 -->
      <div v-for="(groupTools, groupName) in toolsByGroup" :key="groupName">
        <!-- 分组标题 -->
        <div class="flex items-center gap-3 mb-4">
          <div class="w-1 h-6 bg-blue-500 rounded"></div>
          <h2 class="text-2xl font-bold text-gray-800">{{ groupName }}</h2>
        </div>

        <!-- 分组内工具网格 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- 工具卡片 -->
          <RouterLink
            v-for="tool in groupTools"
            :key="tool.name"
            :to="tool.path"
            class="group relative overflow-hidden rounded-xl p-6 bg-white border-2 border-gray-200 text-gray-800 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            :class="'hover:border-' + tool.color + '-500'"
          >
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <!-- Icon -->
                <div
                  :class="
                    'w-12 h-12 rounded-lg flex items-center justify-center bg-' +
                    tool.color +
                    '-100'
                  "
                >
                  <SvgIcon
                    :iconPath="tool.icon"
                    :size="24"
                    :class="'w-6 h-6 text-' + tool.color + '-600'"
                  />
                </div>
                <div
                  :class="
                    'w-8 h-8 rounded-full flex items-center justify-center bg-' +
                    tool.color +
                    '-100'
                  "
                >
                  <SvgIcon
                    iconPath="M9 5l7 7-7 7"
                    size="16"
                    class="w-4 h-4 text-current text-' + tool.color + '-600 transform group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </div>
              <h3 class="font-bold text-xl mb-2">{{ tool.title }}</h3>
              <p class="text-gray-600 text-sm">{{ tool.description }}</p>
            </div>
            <!-- hover 下的底部进度条 -->
            <div
              class="absolute bottom-0 left-0 right-0 h-1 bg-current transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
              :class="'bg-' + tool.color + '-500'"
            ></div>
          </RouterLink>
        </div>
      </div>

      <!-- 更多工具卡片 -->
      <div class="mt-12">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-1 h-6 bg-gray-500 rounded"></div>
          <h2 class="text-2xl font-bold text-gray-800">更多</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            class="group relative overflow-hidden rounded-xl p-6 bg-white border-2 border-gray-200 text-gray-800 shadow-lg opacity-60"
          >
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                  <svg
                    class="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg
                    class="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import router from '@/router'
import SvgIcon from '@/components/SvgIcon.vue'
import { GroupOrder } from '@/types/route'

// 定义工具类型
interface orderRouteMeta {
  name: string
  path: string
  title: string
  description: string
  icon: string
  color: string
  group: string
}

// 搜索查询
const searchQuery = ref('')

// 获取需要在首页显示的工具并按分组排序
const tools = computed<orderRouteMeta[]>(() => {
  // 保持路由配置的原始顺序
  const routes = router.getRoutes().filter((route) => route.meta?.showOnHome)
  let mappedTools: orderRouteMeta[] = routes.map((route) => {
    const meta = route.meta || {}
    return {
      name: route.name as string,
      path: route.path,
      title: typeof meta.title === 'string' ? meta.title : '',
      description: typeof meta.description === 'string' ? meta.description : '',
      icon: typeof meta.icon === 'string' ? meta.icon : 'M12 6v6m0 0v6m0-6h6m-6 0H6',
      color: typeof meta.color === 'string' ? meta.color : 'gray',
      // group可以是HomeGroup枚举或字符串，转换为字符串类型
      group: String(meta.group || '未分组'),
    }
  })

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    mappedTools = mappedTools.filter(
      (tool) =>
        tool.title.toLowerCase().includes(query) || tool.description.toLowerCase().includes(query),
    )
  }

  // 排序 - 分组顺序从大到小，分组内保持原始顺序
  mappedTools.sort((a, b) => {
    // 先按分组顺序排序（从大到小）
    if (a.group !== b.group) {
      const orderA = GroupOrder[a.group as keyof typeof GroupOrder] || 999
      const orderB = GroupOrder[b.group as keyof typeof GroupOrder] || 999
      return orderB - orderA // 从大到小排序
    }
    // 同一分组内保持原始顺序（按路由配置顺序）
    return 0
  })

  return mappedTools
})

// 将工具按分组分组，并确保分组顺序
const toolsByGroup = computed<Record<string, orderRouteMeta[]>>(() => {
  // 1. 先按GroupOrder对工具进行分组
  const grouped = tools.value.reduce(
    (acc, tool) => {
      const groupName = tool.group
      if (!acc[groupName]) {
        acc[groupName] = []
      }
      acc[groupName].push(tool)
      return acc
    },
    {} as Record<string, orderRouteMeta[]>,
  )

  // 2. 获取所有分组名称并按GroupOrder排序（从大到小）
  const sortedGroupNames = Object.keys(grouped).sort((a, b) => {
    const orderA = GroupOrder[a as keyof typeof GroupOrder] || -1
    const orderB = GroupOrder[b as keyof typeof GroupOrder] || -1
    return orderB - orderA // 从大到小排序
  })

  // 3. 按照排序后的分组名称创建有序的分组对象
  const orderedGroups: Record<string, orderRouteMeta[]> = {}
  for (const groupName of sortedGroupNames) {
    // 由于sortedGroupNames是从grouped的键中获取的，所以grouped[groupName]一定存在
    orderedGroups[groupName] = grouped[groupName] as orderRouteMeta[]
  }

  return orderedGroups
})
</script>
