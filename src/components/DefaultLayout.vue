<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-white shadow-md">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <RouterLink to="/" class="text-xl font-bold text-gray-800 hover:text-blue-500 transition-colors">
            在线工具
          </RouterLink>
        </div>
        <div class="flex items-center space-x-2">
          <button
            v-for="lang in languages"
            :key="lang.code"
            @click="changeLanguage(lang.code)"
            :class="[
              'px-3 py-1 rounded text-sm transition-colors',
              currentLang === lang.code
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]"
          >
            {{ lang.name }}
          </button>
        </div>
      </div>
    </header>

    <main class="flex-1 container mx-auto px-4 py-6">
      <slot />
    </main>

    <footer class="bg-gray-800 text-white">
      <div class="container mx-auto px-4 py-6">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-sm text-gray-400">© 2024 在线工具平台. All rights reserved.</p>
          <div class="flex space-x-4 mt-4 md:mt-0">
            <a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">关于我们</a>
            <a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">隐私政策</a>
            <a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">使用条款</a>
            <a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">联系我们</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const currentLang = ref('zh')
const languages = [
  { code: 'zh', name: '中文' },
  { code: 'en', name: 'English' }
]

const changeLanguage = (lang: string) => {
  currentLang.value = lang
}
</script>
<style scoped>
</style>
