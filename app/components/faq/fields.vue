<script lang="ts" setup>
import type { FaqData } from "@OrdinarySMP/api-types";
const model = defineModel<Partial<FaqData>>({ required: true });
</script>

<template>
  <UFormField label="Question" name="question" required>
    <UInput v-model="model.question" class="w-full" />
  </UFormField>
  <UFormField label="Answer" name="answer" required>
    <FieldsEditor v-model="model.answer" class="w-full" />
  </UFormField>
</template>
