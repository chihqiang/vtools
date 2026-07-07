<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-3 flex justify-between items-center">
        <div class="flex items-center space-x-4 sm:space-x-8">
          <RouterLink
            to="/"
            class="text-lg sm:text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
          >
            VTools
          </RouterLink>
          <!-- Navigation -->
          <nav class="hidden md:flex space-x-2">
            <RouterLink
              to="/"
              class="px-3 py-2 text-sm text-gray-700 rounded-md hover:text-blue-600 hover:bg-gray-100 transition-colors"
              >工具</RouterLink
            >
            <a
              href="https://www.zhiqiang.wang"
              target="_blank"
              rel="noopener noreferrer"
              class="px-3 py-2 text-sm text-gray-700 rounded-md hover:text-blue-600 hover:bg-gray-100 transition-colors"
              >博客</a
            >
          </nav>
        </div>

        <!-- GitHub Icon -->
        <div class="flex items-center">
          <a
            href="https://github.com/chihqiang/vtools"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-500 hover:text-gray-900 transition-colors"
            title="GitHub"
          >
            <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
              />
            </svg>
          </a>
        </div>
      </div>
    </header>

    <!-- 面包屑导航（仅非首页显示） -->
    <div v-if="pageTitle" class="bg-white border-b border-gray-100">
      <div class="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-2.5 flex items-center gap-2 text-sm">
        <RouterLink
          to="/"
          class="text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          工具
        </RouterLink>
        <span class="text-gray-300">/</span>
        <span class="text-gray-800 font-medium">{{ pageTitle }}</span>
      </div>
    </div>

    <!-- Main -->
    <main class="flex-1 w-full px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 flex flex-col min-h-0">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white shadow-sm border-t border-gray-200 mt-auto">
      <div class="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <!-- 左侧：版权 + 隐私说明 -->
          <div
            class="flex flex-col items-center md:items-start text-center md:text-left text-sm text-gray-500 space-y-1"
          >
            <!-- 版权 -->
            <p>
              © {{ new Date().getFullYear() }}
              <a
                href="https://github.com/chihqiang/vtools"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-blue-600 transition-colors"
              >
                VTools
              </a>
              — Open Source Toolkit
            </p>
            <!-- 隐私说明 + GA 链接 -->
            <p class="text-xs text-gray-400">
              所有工具均在本地运行，本站使用
              <a
                href="https://analytics.google.com/analytics/web/"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-blue-600 underline transition-colors"
              >
                Google Analytics
              </a>
              进行匿名访问统计。
            </p>
          </div>

          <!-- 右侧：附加链接 + 技术栈 + GitHub -->
          <div
            class="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 text-center md:text-left text-sm text-gray-500"
          >
            <!-- 开源协议 -->
            <a
              href="https://www.apache.org/licenses/LICENSE-2.0"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-blue-600 transition-colors"
            >
              Apache License
            </a>

            <!-- 分隔符（桌面端显示） -->
            <span class="hidden md:inline">|</span>

            <!-- 技术栈 -->
            <span>Made with ❤️ in Vue & Tailwind</span>

            <!-- GitHub 图标 -->
            <a
              href="https://github.com/chihqiang/vtools"
              target="_blank"
              rel="noopener noreferrer"
              class="ml-2 text-gray-500 hover:text-gray-900 transition-colors"
              title="GitHub"
            >
              <svg class="w-5 h-5 sm:w-6 sm:h-6 inline" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 面包屑标题：取路由 meta.title，首页不显示
const pageTitle = computed(() => {
  if (route.name === 'home' || route.name === 'not-found') return ''
  return (route.meta.title as string) || ''
})
</script>
