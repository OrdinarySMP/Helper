<script lang="ts" setup>
import { ref } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useForm } from "vee-validate";
import type { ApplicationData } from "@ordinary/api-types";

const applicationId = ref<ApplicationData["id"]>();

const route = useRoute();
const errorMessage = ref("");

const formSchema = toTypedSchema(
  zod.object({
    order: zod.number().min(1),
    question: zod.string().min(1),
    is_active: zod.boolean(),
  }),
);

const { handleSubmit, setErrors, isSubmitting } = useForm({
  validationSchema: formSchema,
  initialValues: {
    is_active: true,
  },
});

const save = handleSubmit(async (values) => {
  errorMessage.value = "";

  const { error } = await useApi("/application-question", {
    method: "post",
    body: {
      ...values,
      application_id: applicationId.value,
    },
  });

  if (error.value) {
    errorMessage.value = error.value.data.message;
    setErrors(error.value.data.errors ?? []);
  } else {
    navigateTo(`/application/${applicationId.value}/question`);
  }
});

definePageMeta({
  permission: {
    permission: "applicationQuestion.create",
    fallback: `/application/${applicationId.value}/question`,
  },
});

useHead({
  title: "Create Application Question",
});

onMounted(() => {
  applicationId.value = parseRouteParameter(route.params.applicationId);
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Create Application Question" />
    </template>

    <template #body>
      <div class="flex grow">
        <div class="w-full">
          <form class="grid grid-cols-1 gap-4" @submit.prevent="save">
            <FieldInput name="order" label="Order" type="number" />

            <FieldTextArea name="question" label="Question" />

            <FieldSwitch name="is_active" label="Active?" />

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
