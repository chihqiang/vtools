<template>
  <Teleport to="body">
    <div
      v-if="imageUrl"
      class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      @click="closePreview"
    >
      <div class="max-w-5xl max-h-[90vh]">
        <img
          :src="imageUrl"
          :alt="alt || '预览图片'"
          class="max-w-full max-h-[90vh] object-contain"
        />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps({
  imageUrl: {
    type: String,
    default: '',
  },
  alt: {
    type: String,
    default: '',
  },
})

const emit = defineEmits<{
  close: []
}>()

const closePreview = () => {
  emit('close')
}
</script>
