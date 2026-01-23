<template>
  <div v-if="loading" :class="[
    'flex items-center justify-center',
    overlay ? 'fixed inset-0 bg-white/80 z-50 backdrop-blur-sm' : ''
  ]">
    <div class="flex flex-col items-center gap-3">
      <div class="w-10 h-10 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
      <div v-if="message" class="text-sm font-medium text-gray-700">{{ message }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  /** 是否显示加载状态 */
  loading: boolean
  /** 是否显示遮罩层 */
  overlay?: boolean
  /** 加载提示消息 */
  message?: string
}>()
</script>