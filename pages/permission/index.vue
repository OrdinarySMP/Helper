<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useForm } from "vee-validate";
import type { Role } from "@/types/discord";
import type { PermissionTemplate, PermissionMap } from "@/types/permission";

const loading = ref(true);
const roles = ref<{ label: string; value: string }[]>([]);
const permissionMaps = ref<PermissionMap[]>([]);
const permissionTemplate = ref<PermissionTemplate>({});
const errorMessage = ref("");

const formSchema = toTypedSchema(
  zod.object({
    permissionMap: zod
      .object({
        role: zod.string(),
        permissions: zod.record(
          zod.string(),
          zod.record(zod.string(), zod.boolean()),
        ),
      })
      .array(),
  }),
);

const { values, setFieldValue, setErrors } = useForm({
  validationSchema: formSchema,
});

const loadRoles = async () => {
  const { data, error } = await useApi<Role[]>("/discord/roles", {
    method: "get",
  });

  if (error.value) {
    useNotification().error("Could not load roles:", error.value.message);
    return;
  }

  roles.value =
    data.value?.map((role) => ({
      label: role.name,
      value: role.id,
    })) ?? ([] as { label: string; value: string }[]);
};

const loadPermission = async () => {
  const { data, error } = await useApi<PermissionMap[]>("/permissions", {
    method: "get",
  });

  if (error.value) {
    useNotification().error("Could not load permissions:", error.value.message);
    return;
  }
  permissionMaps.value = data.value ?? [];
  permissionMaps.value.forEach((permissionMap: PermissionMap, key: number) => {
    setFieldValue(`permissionMap.${key}.role`, permissionMap.role);
    permissionMap.permissions.forEach((permission: string) => {
      // @ts-expect-error permission inlcudes ${model}.${operation}
      setFieldValue(`permissionMap.${key}.permissions.${permission}`, true);
    });
  });
};

const loadPermissionTemplate = async () => {
  const { data, error } = await useApi<PermissionTemplate>(
    "/permissions/template",
    {
      method: "get",
    },
  );

  if (error.value) {
    useNotification().error(
      "Could not load permissions template:",
      error.value.message,
    );
    return;
  }
  permissionTemplate.value = data.value ?? ({} as PermissionTemplate);
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

const addPermissionMap = () => {
  setFieldValue(`permissionMap.${values.permissionMap?.length ?? 0}.role`, "");
};

const remove = (key: number) => {
  const newPermissionMap = [...(values.permissionMap ?? [])];
  newPermissionMap?.splice(key, 1);

  setFieldValue("permissionMap", newPermissionMap);
};

const save = async () => {
  const { error } = await useApi("/permissions", {
    method: "post",
    body: values.permissionMap,
  });

  if (error.value) {
    errorMessage.value = error.value.data.message;
    setErrors(error.value.data.errors ?? []);
  } else {
    useNotification().success("Permissions", "Permissions saved successfully");
  }
};

onMounted(async () => {
  loading.value = true;
  await Promise.all([loadRoles(), loadPermission(), loadPermissionTemplate()]);
  loading.value = false;
});
</script>

<template>
  <div class="flex grow">
    <div v-if="loading" class="flex grow items-center justify-center">
      <Spinner />
    </div>
    <div v-else class="w-full">
      <div v-for="(_permissionMap, key) in values.permissionMap" :key="key">
        <Accordion
          :title="roleIdToName(values.permissionMap?.[key].role ?? '')"
        >
          <div class="flex items-center pb-2 gap-4">
            <FieldSelect
              class="flex-grow"
              :items="roles"
              :name="`permissionMap.${key}.role`"
            />
            <Button class="px-2" size="md" color="error" @click="remove(key)">
              Remove
            </Button>
          </div>
          <div
            v-for="(operations, model) in permissionTemplate"
            :key="model"
            class="pb-4"
          >
            <b>{{ toTitleCase(`${model}`) }}</b>
            <div class="grid grid-cols-5">
              <div
                v-for="(operation, operationKey) in operations"
                :key="operationKey"
              >
                <FieldCheckbox
                  :name="`permissionMap.${key}.permissions.${model}.${operation}`"
                  :label="operation"
                  size="sm"
                />
              </div>
            </div>
          </div>
        </Accordion>
      </div>
      <span v-if="errorMessage" class="text-red-600">{{ errorMessage }}</span>
      <div class="flex mt-4 gap-4">
        <Button class="px-2" size="md" @click="save"> Save </Button>
        <Button class="px-2" size="md" @click="addPermissionMap">
          Add Permission +
        </Button>
      </div>
    </div>
  </div>
</template>
