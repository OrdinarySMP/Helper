<script lang="ts" setup>
import {
  ApplicationResponseType,
  type ApplicationResponseData,
} from "@OrdinarySMP/api-types";
const model = defineModel<Partial<ApplicationResponseData>>({ required: true });

const types = computed(() =>
  Object.entries(ApplicationResponseType)
    .filter(([_, value]) => typeof value === "number")
    .map(([key, value]) => ({
      label: key,
      value: value as number,
    })),
);
</script>

<template>
  <UFormField label="Name" name="name" required>
    <UInput v-model="model.name" class="w-full" />
  </UFormField>
  <UFormField label="Response" name="response" required>
    <FieldsEditor v-model="model.response" class="w-full" />
  </UFormField>
  <UFormField label="Type" name="type" required>
    <USelectMenu
      v-model="model.type"
      :items="types"
      class="w-full"
      value-key="value"
      label-key="label"
    />
  </UFormField>
</template>
