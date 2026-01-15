<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">
      在线工具列表
    </h2>
    <p class="text-gray-600 mb-6">选择一个工具开始使用</p>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <RouterLink
        to="/timestamp"
        class="group relative overflow-hidden rounded-xl p-6 bg-white border-2 border-gray-200 text-gray-800 shadow-lg hover:shadow-2xl hover:border-blue-500 transition-all duration-300 hover:-translate-y-1"
      >
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <svg class="w-4 h-4 text-blue-600 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
          <h3 class="font-bold text-xl mb-2">时间戳工具</h3>
          <p class="text-gray-600 text-sm">时间戳转换工具，支持秒级和毫秒级时间戳转换</p>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
      </RouterLink>
      
      <div class="group relative overflow-hidden rounded-xl p-6 bg-white border-2 border-gray-200 text-gray-800 shadow-lg opacity-60">
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </div>
            <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
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
</script>