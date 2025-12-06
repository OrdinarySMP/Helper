<script lang="ts" setup>
import { ref } from "vue";
import type { PermissionTemplate, PermissionMap } from "@/types/permission";

const model = defineModel<PermissionMap[]>({ required: true });
defineProps<{
  permissionTemplate: PermissionTemplate;
}>();

const roles = ref(await loadRoles());

const remove = (key: number) => {
  model.value?.splice(key, 1);
};

const toTitleCase = (input: string): string => {
  return input
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Split camelCase into separate words
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
};

const roleIdToName = (roleId: string) => {
  return (
    roles.value.find((role) => role.value === roleId)?.label ??
    "No role selected"
  );
};
</script>

<template>
  <UAccordion :items="model">
    <template #default="{ item }">
      {{ roleIdToName(item.role ?? "No role selected") }}
    </template>
    <template #content="{ index }">
      <div class="flex space-x-4 mb-4">
        <USelectMenu
          v-if="model[index]"
          v-model="model[index].role"
          :items="roles"
          class="w-full"
          value-key="value"
          label-key="label"
        />
        <UButton
          label="Remove"
          variant="subtle"
          color="error"
          @click="remove(index)"
        />
      </div>
      <div
        v-for="(operations, modelName) in permissionTemplate"
        :key="modelName"
        class="pb-4"
      >
        <b>{{ toTitleCase(`${modelName}`) }}</b>
        <div class="grid grid-cols-5">
          <div
            v-for="(operation, operationKey) in operations"
            :key="operationKey"
          >
            <UCheckbox
              v-if="model[index]?.permissions[modelName]"
              v-model="model[index].permissions[modelName][operation]"
              :label="operation"
            />
          </div>
        </div>
      </div>
    </template>
  </UAccordion>
</template>
