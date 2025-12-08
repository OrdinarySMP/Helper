<script lang="ts" setup>
import type { TicketTeamData } from "@OrdinarySMP/api-types";
const model = defineModel<Partial<TicketTeamData>>({ required: true });
const roles = ref(await loadRoles());
</script>

<template>
  <UFormField label="Name" name="name" required>
    <UInput v-model="model.name" class="w-full" />
  </UFormField>
  <UFormField label="Role" name="role_id" required>
    <USelectMenu
      v-model="model.ticket_team_role_ids"
      :items="roles"
      class="w-full"
      value-key="value"
      label-key="label"
      multiple
    />
  </UFormField>
</template>
