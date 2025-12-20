<script lang="ts" setup>
import type { ServerContentMessageData } from "@OrdinarySMP/api-types";
const model = defineModel<Partial<ServerContentMessageData>>({
  required: true,
});
defineProps<{
  canCreate: boolean;
}>();
</script>

<template>
  <UFormField label="Heading" name="heading" required>
    <FieldsEditor v-model="model.heading" class="w-full" :disabled="!canCreate" />
  </UFormField>
  <UFormField label="Not recommended" name="not_recommended" required>
    <FieldsEditor
      v-model="model.not_recommended"
      class="w-full"
      :disabled="!canCreate"
    />
  </UFormField>
  <UFormField label="Recommended" name="recommended" required>
    <FieldsEditor
      v-model="model.recommended"
      class="w-full"
      :disabled="!canCreate"
    />
  </UFormField>
</template>
