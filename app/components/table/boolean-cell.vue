<script lang="ts" setup>
defineProps<{
  value: boolean;
}>();
</script>

<template>
  <UIcon
    v-if="value"
    name="mdi:check-circle-outline"
    class="text-green-500 size-5"
  />
  <UIcon v-else name="mdi:circle-off-outline" class="text-red-500 size-5" />
</template>
