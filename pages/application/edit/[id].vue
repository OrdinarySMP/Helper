<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useForm } from "vee-validate";
import type { Application } from "@/types/application";
import type { PaginatedResponse } from "@/types/response";

if (!hasPermissionTo("application.update")) {
  await navigateTo("/application");
}

const route = useRoute();
const applicationId = ref<Application["id"]>();
const application = ref<Application>();
const loading = ref(true);
const errorMessage = ref("");
const textChannels = ref(await loadTextChannels());
const roles = ref(await loadRoles());

const formSchema = toTypedSchema(
  zod.object({
    name: zod.string().min(1),
    is_active: zod.boolean(),
    log_channel: zod.string().min(1),
    accept_message: zod.string().min(1),
    deny_message: zod.string().min(1),
    confirmation_message: zod.string().min(1),
    completion_message: zod.string().min(1),
    restricted_role_ids: zod.string().array().optional(),
    accepted_role_ids: zod.string().array().optional(),
    denied_role_ids: zod.string().array().optional(),
    ping_role_ids: zod.string().array().optional(),
    accept_removal_role_ids: zod.string().array().optional(),
    deny_removal_role_ids: zod.string().array().optional(),
    pending_role_ids: zod.string().array().optional(),
  }),
);

const { handleSubmit, setErrors, isSubmitting, setFieldValue } = useForm({
  validationSchema: formSchema,
});

const save = handleSubmit(async (values) => {
  errorMessage.value = "";

  const { error } = await useApi(`/application/${applicationId.value}`, {
    method: "patch",
    body: values,
  });

  if (error.value) {
    errorMessage.value = error.value.data.message;
    setErrors(error.value.data.errors ?? []);
  } else {
    navigateTo("/application");
  }
});

onMounted(async () => {
  loading.value = true;
  applicationId.value = parseRouteParameter(route.params.id);

  const { data } = await useApi<PaginatedResponse<Application[]>>(
    "/application",
    {
      method: "get",
      params: {
        "filter[id]": applicationId.value,
        "include[]": [
          "restrictedRoles",
          "acceptedRoles",
          "deniedRoles",
          "pingRoles",
          "acceptRemovalRoles",
          "denyRemovalRoles",
          "pendingRoles",
        ],
      },
    },
  );
  if (!data.value || !data.value?.data[0]) {
    navigateTo("/application");
    return;
  }

  application.value = data.value.data[0];

  setFieldValue("name", application.value.name);
  setFieldValue("is_active", application.value.is_active);
  setFieldValue("log_channel", application.value.log_channel);
  setFieldValue("accept_message", application.value.accept_message);
  setFieldValue("deny_message", application.value.deny_message);
  setFieldValue("confirmation_message", application.value.confirmation_message);
  setFieldValue("completion_message", application.value.completion_message);

  setFieldValue(
    "restricted_role_ids",
    application.value.restricted_roles.map((role) => role.role_id),
  );
  setFieldValue(
    "accepted_role_ids",
    application.value.accepted_roles.map((role) => role.role_id),
  );
  setFieldValue(
    "denied_role_ids",
    application.value.denied_roles.map((role) => role.role_id),
  );
  setFieldValue(
    "ping_role_ids",
    application.value.ping_roles.map((role) => role.role_id),
  );
  setFieldValue(
    "accept_removal_role_ids",
    application.value.accept_removal_roles.map((role) => role.role_id),
  );
  setFieldValue(
    "deny_removal_role_ids",
    application.value.deny_removal_roles.map((role) => role.role_id),
  );
  setFieldValue(
    "pending_role_ids",
    application.value.pending_roles.map((role) => role.role_id),
  );

  loading.value = false;
});

useHead({
  title: "Edit Application",
});
</script>

<template>
  <div class="flex grow">
    <div v-if="loading" class="flex grow items-center justify-center">
      <Spinner />
    </div>
    <div v-else class="w-full">
      <p class="mb-8 text-2xl">Edit Application</p>
      <form
        class="grid grid-cols-1 xl:grid-cols-2 gap-4"
        @submit.prevent="save"
      >
        <div class="grid grid-cols-1 gap-4">
          <FieldInput name="name" label="Name" />
          <FieldSwitch name="is_active" label="Active?" />
          <FieldSelect
            :items="textChannels"
            name="log_channel"
            label="Log channel"
          />

          <div class="grid grid-cols-2 gap-4">
            <FieldTextArea name="accept_message" label="Accept message" />

            <FieldTextArea name="deny_message" label="Deny message" />

            <FieldTextArea
              name="confirmation_message"
              label="Confirmation message"
            />

            <FieldTextArea
              name="completion_message"
              label="Completion message"
            />
          </div>
        </div>
        <div>
          <div class="grid grid-cols-2 gap-4">
            <FieldMultiSelect
              :items="roles"
              clearable
              name="accepted_role_ids"
              label="Accepted roles"
            />
            <FieldMultiSelect
              :items="roles"
              clearable
              name="denied_role_ids"
              label="Denied roles"
            />

            <FieldMultiSelect
              :items="roles"
              name="accept_removal_role_ids"
              clearable
              label="Accept removal roles"
            />
            <FieldMultiSelect
              :items="roles"
              clearable
              name="deny_removal_role_ids"
              label="Deny removal role"
            />
            <FieldMultiSelect
              :items="roles"
              clearable
              name="restricted_role_ids"
              label="Restricted role"
            />
            <FieldMultiSelect
              :items="roles"
              clearable
              name="ping_role_ids"
              label="Ping role"
            />
            <FieldMultiSelect
              :items="roles"
              clearable
              name="pending_role_ids"
              label="Pending role"
            />
          </div>
        </div>

        <div>
          <Button
            :disabled="isSubmitting"
            :loading="isSubmitting"
            class="mr-2 px-4"
            size="md"
            type="submit"
          >
            Save
          </Button>
          <span v-if="errorMessage" class="text-red-600">{{
            errorMessage
          }}</span>
        </div>
      </form>
    </div>
  </div>
</template>
