<script lang="ts" setup>
import type { TicketPanelData } from "@ordinary/api-types";
const model = defineModel<Partial<TicketPanelData>>({ required: true });
const textChannels = ref(await loadTextChannels());
const chip = computed(() => ({ backgroundColor: model.value.embed_color }));
</script>

<template>
  <UFormField label="Title" name="title" required>
    <UInput v-model="model.title" class="w-full" />
  </UFormField>
  <UFormField label="Message" name="message" required>
    <UTextarea v-model="model.message" class="w-full" />
  </UFormField>

  <UFormField label="Color" name="color" required>
    <UPopover>
      <UButton label="Choose color" color="neutral" variant="outline">
        <template #leading>
          <span :style="chip" class="size-3 rounded-full" />
        </template>
      </UButton>

      <template #content>
        <UColorPicker v-model="model.embed_color" class="p-2" />
      </template>
    </UPopover>
  </UFormField>

  <UFormField label="Channel" name="channel" required>
    <USelectMenu
      v-model="model.channel_id"
      :items="textChannels"
      class="w-full"
      value-key="value"
      label-key="label"
    />
  </UFormField>
</template>
