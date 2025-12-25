<script lang="ts" setup>
import type { ApplicationQuestionData } from "@OrdinarySMP/api-types";
const model = defineModel<Partial<ApplicationQuestionData>>({ required: true });
</script>

<template>
  <UFormField label="Order" name="order" required>
    <UInput v-model="model.order" type="number" min="0" class="w-full" />
  </UFormField>
  <UFormField label="Question" name="question" required>
    <UInput v-model="model.question" class="w-full" />
  </UFormField>
  <UFormField label="Active" name="is_active">
    <USwitch v-model="model.is_active" />
  </UFormField>
</template>
