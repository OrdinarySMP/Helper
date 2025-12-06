<script lang="ts" setup>
import * as zod from "zod";
import type { Form } from "#ui/types";
import type {
  PermissionTemplate,
  PermissionMap,
  Permission,
} from "@/types/permission";

const client = useApiClient();
const permissionMaps = ref<PermissionMap[]>([]);

const permissionTemplate = await client<PermissionTemplate>(
  "/permissions/template",
  {
    method: "get",
  },
);

const permissions = await client<Permission[]>("/permissions", {
  method: "get",
});

const emit = defineEmits<{
  (e: "persited" | "loading" | "done"): void;
  (e: "persist-error", err: unknown): void;
}>();

const schema = zod
  .object({
    role: zod.string(),
    permissions: zod.record(
      zod.string(),
      zod.record(zod.string(), zod.boolean()),
    ),
  })
  .array();
type Schema = zod.output<typeof schema>;
const form = ref<Form<Schema>>();

const addPermissionMap = () => {
  permissionMaps.value.push({
    role: "",
    permissions: buildPermissionMatrix([]),
  });
};

const buildPermissionMatrix = (
  permissions: Permission["permissions"],
): PermissionMap["permissions"] => {
  const userSet = new Set(permissions);

  const result: PermissionMap["permissions"] = {};

  for (const [resource, actions] of Object.entries(permissionTemplate)) {
    result[resource] = {};

    for (const action of actions) {
      const key = `${resource}.${action}`;
      result[resource][action] = userSet.has(key);
    }
  }

  return result;
};

permissionMaps.value = permissions.map((item) => {
  return {
    ...item,
    permissions: buildPermissionMatrix(item.permissions),
  };
});

const { submitting, onSubmit } = useApiForm(form, async (event) => {
  try {
    emit("loading");
    await client("/permissions", {
      method: "post",
      body: event.data,
    });
    emit("persited");
  } catch (err) {
    emit("persist-error", err);
    throw err;
  } finally {
    emit("done");
  }
});
</script>

<template>
  <UForm
    ref="form"
    class="space-y-4"
    :schema="schema"
    :state="permissionMaps"
    @submit="onSubmit"
  >
    <PermissionFields
      v-model="permissionMaps"
      :permission-template="permissionTemplate"
    />
    <div class="flex mt-4 gap-4">
      <UButton
        type="submit"
        label="Save"
        variant="subtle"
        :loading="submitting"
      />
      <UButton
        label="Add Permission +"
        color="neutral"
        variant="subtle"
        type="button"
        :loading="submitting"
        @click="addPermissionMap"
      />
    </div>
  </UForm>
</template>
