<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useForm } from "vee-validate";
import type { TicketTeamData } from "@ordinary/api-types";
import type { PaginatedResponse } from "@/types/response";

const route = useRoute();
const ticketTeamId = ref<TicketTeamData["id"]>();
const ticketTeam = ref<TicketTeamData>();
const loading = ref(true);
const errorMessage = ref("");
const roles = ref(await loadRoles());

const formSchema = toTypedSchema(
  zod.object({
    name: zod.string().min(1).max(100),
    ticket_team_role_ids: zod.string().array(),
  }),
);

const { handleSubmit, setErrors, isSubmitting, setFieldValue } = useForm({
  validationSchema: formSchema,
});

const save = handleSubmit(async (values) => {
  errorMessage.value = "";

  const { error } = await useApi(`/ticket/team/${ticketTeamId.value}`, {
    method: "patch",
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
    permission: "ticketTeam.update",
    fallback: "/ticket/team",
  },
});

onMounted(async () => {
  loading.value = true;
  ticketTeamId.value = parseRouteParameter(route.params.id);

  const { data } = await useApi<PaginatedResponse<TicketTeamData[]>>("/ticket/team", {
    method: "get",
    params: {
      "filter[id]": ticketTeamId.value,
      include: "ticketTeamRoles",
    },
  });
  if (!data.value || !data.value?.data[0]) {
    navigateTo("/ticket/team");
    return;
  }

  ticketTeam.value = data.value.data[0];

  setFieldValue("name", ticketTeam.value.name);
  setFieldValue(
    "ticket_team_role_ids",
    ticketTeam.value.ticket_team_roles.map(
      (ticketTeamRole) => ticketTeamRole.role_id,
    ),
  );

  loading.value = false;
});

useHead({
  title: "Edit Ticket Team",
});
</script>

<template>
  <div class="flex grow">
    <div v-if="loading" class="flex grow items-center justify-center">
      <Spinner />
    </div>
    <div v-else class="w-full">
      <p class="mb-8 text-2xl">Edit Ticket Team</p>
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
