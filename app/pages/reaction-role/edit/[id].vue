<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useForm } from "vee-validate";
import type { ReactionRoleData } from "@ordinary/api-types";
import type { PaginatedResponse } from "@/types/response";

const route = useRoute();
const reactionRoleId = ref<ReactionRoleData["id"]>();
const reactionRole = ref<ReactionRoleData>();
const loading = ref(true);
const errorMessage = ref("");
const roles = ref(await loadRoles());

const formSchema = toTypedSchema(
  zod.object({
    message_link: zod.string().min(1),
    emoji: zod.string().min(1),
    role_id: zod.string().min(1),
  }),
);

const { handleSubmit, setErrors, isSubmitting, setFieldValue } = useForm({
  validationSchema: formSchema,
});

const save = handleSubmit(async (values) => {
  errorMessage.value = "";

  const { error } = await useApi(`/reaction-role/${reactionRoleId.value}`, {
    method: "patch",
    body: {
      ...values,
      message_link: reactionRole.value?.message_link,
      emoji: reactionRole.value?.emoji,
    },
  });

  if (error.value) {
    errorMessage.value = error.value.data.message;
    setErrors(error.value.data.errors ?? []);
  } else {
    navigateTo("/reaction-role");
  }
});

onMounted(async () => {
  loading.value = true;
  reactionRoleId.value = parseRouteParameter(route.params.id);

  const { data } = await useApi<PaginatedResponse<ReactionRoleData[]>>(
    "/reaction-role",
    {
      method: "get",
      params: {
        "filter[id]": reactionRoleId.value,
      },
    },
  );
  if (!data.value || !data.value?.data[0]) {
    navigateTo("/reaction-role");
    return;
  }

  reactionRole.value = data.value.data[0];

  setFieldValue("message_link", reactionRole.value.message_link);
  setFieldValue("emoji", reactionRole.value.emoji);
  setFieldValue("role_id", reactionRole.value.role_id);

  loading.value = false;
});

definePageMeta({
  permission: {
    permission: "reactionRole.update",
  },
});

useHead({
  title: "Edit Reaction role",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Edit Reaction role" />
    </template>

    <template #body>
      <div class="flex grow">
        <div v-if="loading" class="flex grow items-center justify-center">
          <Spinner />
        </div>
        <div v-else class="w-full">
          <form class="grid grid-cols-1 gap-4" @submit.prevent="save">
            <FieldInput name="message_link" label="Message link" disabled />

            <FieldInput name="emoji" label="Emoji" disabled />

            <FieldSelect :items="roles" name="role_id" label="Role" />

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
