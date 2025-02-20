<script lang="ts" setup>
import type { Embed } from "@/types/discord";

export interface Props {
  embed: Embed;
}

defineProps<Props>();
</script>

<template>
  <div class="flex">
    <div
      class="w-2 rounded-r"
      :style="`background-color: #${embed.color.toString(16)}`"
    />
    <div class="flex-grow p-2">
      <p class="font-bold text-xl">{{ embed.title }}</p>
      <p>{{ embed.description }}</p>
      <div class="grid grid-cols-3 gap-4">
        <div
          v-for="(field, key) in embed.fields"
          :key="key"
          :class="{ 'col-span-3': !field.inline }"
        >
          <p class="font-bold">{{ field.name }}</p>
          <p>{{ field.value }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
