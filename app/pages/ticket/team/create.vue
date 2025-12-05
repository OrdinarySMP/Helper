<script lang="ts" setup>
import { ref } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useForm } from "vee-validate";

const errorMessage = ref("");
const roles = ref(await loadRoles());

const formSchema = toTypedSchema(
  zod.object({
    name: zod.string().min(1).max(100),
    ticket_team_role_ids: zod.string().array(),
  }),
);

const { handleSubmit, setErrors, isSubmitting } = useForm({
  validationSchema: formSchema,
});

const save = handleSubmit(async (values) => {
  errorMessage.value = "";

  const { error } = await useApi("/ticket/team", {
    method: "post",
    body: values,
  });

  if (error.value) {
    errorMessage.value = error.value.data.message;
    setErrors(error.value.data.errors ?? []);
  } else {
    navigateTo("/ticket/team");
  }
});

definePageMeta({
  permission: {
    permission: "ticketTeam.create",
    fallback: "/ticket/team",
  },
});

useHead({
  title: "Create Ticket Team",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Create Ticket Team" />
    </template>

    <template #body>
      <div class="flex grow">
        <div class="w-full">
          <form class="grid grid-cols-1 gap-4" @submit.prevent="save">
            <FieldInput name="name" label="Name" />

            <FieldMultiSelect
              :items="roles"
              name="ticket_team_role_ids"
              label="Role"
            />

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
  </UDashboardPanel>
</template>
