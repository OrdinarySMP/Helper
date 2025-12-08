<script lang="ts" setup>
import type { ApplicationData } from "@ordinary/api-types";
const model = defineModel<Partial<ApplicationData>>({ required: true });
const roles = ref(await loadRoles());
</script>

<template>
  <UFormField label="Accepted roles" name="accepted_role_ids" required>
    <USelectMenu
      v-model="model.accepted_role_ids"
      :items="roles"
      class="w-full"
      value-key="value"
      label-key="label"
      multiple
    />
  </UFormField>
  <UFormField label="Denied roles" name="denied_role_ids" required>
    <USelectMenu
      v-model="model.denied_role_ids"
      :items="roles"
      class="w-full"
      value-key="value"
      label-key="label"
      multiple
    />
  </UFormField>
  <UFormField
    label="Accept removal roles"
    name="accept_removal_role_ids"
    required
  >
    <USelectMenu
      v-model="model.accept_removal_role_ids"
      :items="roles"
      class="w-full"
      value-key="value"
      label-key="label"
      multiple
    />
  </UFormField>
  <UFormField label="Deny removal role" name="deny_removal_role_ids" required>
    <USelectMenu
      v-model="model.deny_removal_role_ids"
      :items="roles"
      class="w-full"
      value-key="value"
      label-key="label"
      multiple
    />
  </UFormField>
  <UFormField label="Restricted roles" name="restricted_role_ids" required>
    <USelectMenu
      v-model="model.restricted_role_ids"
      :items="roles"
      class="w-full"
      value-key="value"
      label-key="label"
      multiple
    />
  </UFormField>
  <UFormField
    label="Required roles (requires all)"
    name="required_role_ids"
    required
  >
    <USelectMenu
      v-model="model.required_role_ids"
      :items="roles"
      class="w-full"
      value-key="value"
      label-key="label"
      multiple
    />
  </UFormField>
  <UFormField label="Ping roles" name="ping_role_ids" required>
    <USelectMenu
      v-model="model.ping_role_ids"
      :items="roles"
      class="w-full"
      value-key="value"
      label-key="label"
      multiple
    />
  </UFormField>
  <UFormField label="Pending roles" name="pending_role_ids" required>
    <USelectMenu
      v-model="model.pending_role_ids"
      :items="roles"
      class="w-full"
      value-key="value"
      label-key="label"
      multiple
    />
  </UFormField>
</template>
