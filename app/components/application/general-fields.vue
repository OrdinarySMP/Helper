<script lang="ts" setup>
import type { ApplicationData } from "@OrdinarySMP/api-types";
const model = defineModel<Partial<ApplicationData>>({ required: true });
const textChannels = ref(await loadTextChannels());
</script>

<template>
  <UFormField label="Name" name="name" required>
    <UInput v-model="model.name" class="w-full" />
  </UFormField>
  <UFormField label="Log Channel" name="log_channel" required>
    <USelectMenu
      v-model="model.log_channel"
      :items="textChannels"
      class="w-full"
      value-key="value"
      label-key="label"
    />
  </UFormField>
  <UFormField label="Activity channel" name="activity_channel">
    <USelectMenu
      v-model="model.activity_channel as string | undefined"
      :items="textChannels"
      class="w-full"
      value-key="value"
      label-key="label"
    />
  </UFormField>
  <UFormField label="Accept message" name="accept_message" required>
    <FieldsEditor v-model="model.accept_message" class="w-full" />
  </UFormField>
  <UFormField label="Deny message" name="deny_message" required>
    <FieldsEditor v-model="model.deny_message" class="w-full" />
  </UFormField>
  <UFormField label="Confirmation message" name="confirmation_message" required>
    <FieldsEditor v-model="model.confirmation_message" class="w-full" />
  </UFormField>
  <UFormField label="Completion message" name="completion_message" required>
    <FieldsEditor v-model="model.completion_message" class="w-full" />
  </UFormField>
  <UFormField label="Active" name="is_active">
    <USwitch v-model="model.is_active" />
  </UFormField>
</template>
