<script lang="ts" setup>
import type { ApplicationData } from "@OrdinarySMP/api-types";
const model = defineModel<Partial<ApplicationData>>({ required: true });
const textChannels = ref(await loadTextChannels());
const chip = computed(() => ({
  backgroundColor: model.value.embed_color ?? undefined,
}));
</script>

<template>
  <UFormField label="Channel" name="embed_channel_id">
    <USelectMenu
      v-model="model.embed_channel_id as string | undefined"
      :items="textChannels"
      class="w-full"
      value-key="value"
      label-key="label"
    />
  </UFormField>
  <UFormField label="Title" name="embed_title">
    <UInput v-model="model.embed_title" class="w-full" />
  </UFormField>
  <UFormField label="Color" name="color">
    <UPopover>
      <UButton label="Choose color" color="neutral" variant="outline">
        <template #leading>
          <span :style="chip" class="size-3 rounded-full" />
        </template>
      </UButton>

      <template #content>
        <UColorPicker
          v-model="model.embed_color as string | undefined"
          class="p-2"
        />
      </template>
    </UPopover>
  </UFormField>
  <UFormField label="Description" name="embed_description">
    <UTextarea v-model="model.embed_description" class="w-full" />
  </UFormField>
  <UFormField label="Button color" name="embed_button_color">
    <USelectMenu
      v-model="model.embed_button_color"
      :items="buttonOptions()"
      class="w-full"
      value-key="value"
      label-key="label"
    />
  </UFormField>
  <UFormField label="Button Text" name="embed_button_text">
    <UInput v-model="model.embed_button_text" class="w-full" />
  </UFormField>
</template>
