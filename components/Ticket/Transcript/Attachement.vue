<script lang="ts" setup>
import type { GifAttachment, FileAttachment } from "@/types/discord";

export interface Props {
  attachment: GifAttachment | FileAttachment;
}

defineProps<Props>();
</script>

<template>
  <div v-if="'video' in attachment">
    <NuxtLink
      :to="`${attachment.video.url}`"
      class="text-blue-600 underline"
      target="_blank"
    >
      Gif
    </NuxtLink>
  </div>
  <div v-else-if="'attachment' in attachment">
    <NuxtLink
      :to="`${attachment.url}`"
      class="text-blue-600 underline"
      target="_blank"
    >
      {{ attachment.title }} {{ attachment.name }}
    </NuxtLink>
  </div>
  <div v-else>
    {{ attachment }}
  </div>
</template>
