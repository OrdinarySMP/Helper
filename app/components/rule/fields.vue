<script lang="ts" setup>
import type { RuleData } from "@OrdinarySMP/api-types";
const model = defineModel<Partial<RuleData>>({ required: true });
</script>

<template>
  <UFormField label="Number" name="number" required>
    <UInput v-model="model.number" type="number" min="0" class="w-full" />
  </UFormField>
  <UFormField label="Name" name="name" required>
    <UInput v-model="model.name" class="w-full" />
  </UFormField>
  <UFormField label="Rule" name="rule" required>
    <FieldsEditor v-model="model.rule" class="w-full" />
  </UFormField>
</template>
