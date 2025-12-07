<script lang="ts" setup>
import type { TicketConfigData } from "@ordinary/api-types";
const model = defineModel<Partial<TicketConfigData>>({ required: true });

const categories = ref(await loadCategories());
const textChannels = ref(await loadTextChannels());
</script>

<template>
  <UFormField label="Category" name="category_id" required>
    <USelectMenu
      v-model="model.category_id"
      :items="categories"
      class="w-full"
      value-key="value"
      label-key="label"
    />
  </UFormField>

  <UFormField label="Transcript Channel" name="transcript_channel_id" required>
    <USelectMenu
      v-model="model.transcript_channel_id"
      :items="textChannels"
      class="w-full"
      value-key="value"
      label-key="label"
    />
  </UFormField>
</template>
