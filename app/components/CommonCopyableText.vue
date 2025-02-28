<script setup>
const props = defineProps({
  value: {
    type: String,
    default: '',
  },
})

const copied = ref(false)

const isCopyable = computed(() => !!props.value)

const copyToClipboard = () => {
  if (!isCopyable.value) return
  navigator.clipboard.writeText(props.value)
  copied.value = true

  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<template>
  <div class="group flex items-center gap-1 cursor-pointer">
    <slot />

    <UButton
      v-if="isCopyable"
      variant="link"
      :color="copied ? 'success' : 'neutral'"
      :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
      size="xs"
      class="opacity-0 group-hover:opacity-100 transition-opacity"
      @click="copyToClipboard"
    />
  </div>
</template>
