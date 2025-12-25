<script lang="ts" setup>
import type { ServerContentData } from "@OrdinarySMP/api-types";
const model = defineModel<Partial<ServerContentData>>({ required: true });
</script>

<template>
  <UFormField label="Name" name="name" required>
    <UInput v-model="model.name" class="w-full" />
  </UFormField>
  <UFormField label="URL" name="url" required>
    <UInput v-model="model.url" class="w-full" />
  </UFormField>
  <UFormField label="Description" name="description" required>
    <UInput v-model="model.description" class="w-full" />
  </UFormField>
  <UFormField label="Recommended" name="is_recommended">
    <USwitch v-model="model.is_recommended" />
  </UFormField>
  <UFormField label="Active" name="is_active">
    <USwitch v-model="model.is_active" />
  </UFormField>
</template>
