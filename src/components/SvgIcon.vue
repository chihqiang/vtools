<template>
  <svg
    :class="iconClass"
    :width="size"
    :height="size"
    :stroke="color"
    :stroke-width="strokeWidth"
    :fill="fill"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path :d="iconPath" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  // SVG路径
  iconPath: string
  // 图标大小
  size?: string | number
  // 图标颜色
  color?: string
  // 描边宽度
  strokeWidth?: number
  // 填充颜色
  fill?: string
  // 自定义类名
  className?: string
}>(), {
  size: '24',
  color: 'currentColor',
  strokeWidth: 2,
  fill: 'none'
})

// 合并类名
const iconClass = computed(() => {
  const baseClass = 'inline-block'
  return props.className ? `${baseClass} ${props.className}` : baseClass
})
</script>
