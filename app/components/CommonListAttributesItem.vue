<script setup>
defineProps({
  label: {
    type: String,
    default: '',
  },
  value: {
    type: [String, Number],
    default: null,
  },
  icon: {
    type: String,
    default: null,
  },
  to: {
    type: [String, Object],
    default: null,
  },
})
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-1 text-[var(--ui-text-muted)]">
      <UIcon
        v-if="icon"
        :name="icon"
        class="size-4"
      />

      <p
        v-if="label"
        class="text-sm"
      >
        {{ label }}
      </p>
    </div>

    <template v-if="$slots.value">
      <slot name="value" />
    </template>

    <template v-else>
      <ULink
        v-if="to"
        :to="to"
        class="text-sm font-medium text-[var(--ui-text-highlighted)] line-clamp-1"
      >
        {{ value }}
      </ULink>
      <div
        v-else
        class="text-sm font-medium text-[var(--ui-text-highlighted)] line-clamp-1"
      >
        {{ value }}
      </div>
    </template>
  </div>
</template>
