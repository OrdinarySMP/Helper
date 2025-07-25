<script lang="ts" setup>
import { ref } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useForm } from "vee-validate";

if (!hasPermissionTo("application.create")) {
  await navigateTo("/application");
}

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
    required_role_ids: zod.string().array().optional(),
  }),
);

const { handleSubmit, setErrors, isSubmitting, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: {
    is_active: true,
  },
});

const save = handleSubmit(async (values) => {
  errorMessage.value = "";

  const { error } = await useApi("/application", {
    method: "post",
    body: values,
  });

  if (error.value) {
    errorMessage.value = error.value.data.message;
    setErrors(error.value.data.errors ?? []);
  } else {
    navigateTo("/application");
  }
});

onMounted(() => {
  setFieldValue("confirmation_message", "Are you sure you want to apply?\n\nOnce you start the application I will send you a series of questions. You will have 10 minutes to complete each question. If you do not complete a question in time, you will have to restart.");
  setFieldValue("completion_message", "Thank you for submitting your application.\n\nPlease be patient while our staff team reviews your application.");
})

useHead({
  title: "Create Application",
});
</script>

<template>
  <div class="flex grow">
    <div class="w-full">
      <p class="mb-8 text-2xl">Create Application</p>
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
              name="required_role_ids"
              label="Required role (requires all)"
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
