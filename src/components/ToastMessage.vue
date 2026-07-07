<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="transform translate-y-4 opacity-0 scale-95"
    enter-to-class="transform translate-y-0 opacity-100 scale-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100 scale-100"
    leave-to-class="transform -translate-y-4 opacity-0 scale-95"
  >
    <div v-if="visible" class="w-full pointer-events-auto">
      <div
        :class="[
          'rounded-lg shadow-xl p-4 flex items-center space-x-3 backdrop-blur-sm',
          'transition-all duration-300 hover:shadow-2xl',
          type === 'success' ? 'bg-green-500 text-white shadow-green-200/50' : '',
          type === 'error' ? 'bg-red-500 text-white shadow-red-200/50' : '',
          type === 'warning' ? 'bg-yellow-500 text-white shadow-yellow-200/50' : '',
          type === 'info' ? 'bg-blue-500 text-white shadow-blue-200/50' : '',
          customClass || '',
        ]"
        :style="customStyle"
      >
        <!-- 图标 -->
        <div
          class="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/20"
        >
          <svg
            v-if="type === 'success'"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          <svg
            v-if="type === 'error'"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
          <svg
            v-if="type === 'warning'"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>
          <svg
            v-if="type === 'info'"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>

        <!-- 消息内容 -->
        <span class="flex-1 font-medium text-sm leading-relaxed">{{ message }}</span>

        <!-- 关闭按钮 -->
        <button
          @click="close"
          class="flex-shrink-0 hover:bg-white/20 rounded-full p-1 transition-all duration-200 hover:scale-110"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  customClass?: string
  customStyle?: Record<string, string | number>
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 3000,
  customClass: '',
  customStyle: () => ({}),
})

const emit = defineEmits<{
  close: []
}>()

const visible = ref(true)

const close = () => {
  visible.value = false
  setTimeout(() => {
    emit('close')
  }, 300)
}

if (props.duration > 0) {
  setTimeout(close, props.duration)
}
</script>

<style scoped></style>
