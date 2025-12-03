<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useForm } from "vee-validate";
import type { ApplicationQuestion } from "@/types/application/question";
import type { Application } from "@/types/application";
import type { PaginatedResponse } from "@/types/response";

const applicationId = ref<Application["id"]>();

const route = useRoute();
const applicationQuestionId = ref<ApplicationQuestion["id"]>();
const applicationQuestion = ref<ApplicationQuestion>();
const loading = ref(true);
const errorMessage = ref("");

const formSchema = toTypedSchema(
  zod.object({
    order: zod.number().min(1),
    question: zod.string().min(1),
    is_active: zod.boolean(),
  }),
);

const { handleSubmit, setErrors, isSubmitting, setFieldValue } = useForm({
  validationSchema: formSchema,
});

const save = handleSubmit(async (values) => {
  errorMessage.value = "";

  const { error } = await useApi(
    `/application-question/${applicationQuestionId.value}`,
    {
      method: "patch",
      body: {
        ...values,
        application_id: applicationId.value,
      },
    },
  );

  if (error.value) {
    errorMessage.value = error.value.data.message;
    setErrors(error.value.data.errors ?? []);
  } else {
    navigateTo(`/application/${applicationId.value}/question`);
  }
});

onMounted(async () => {
  loading.value = true;
  applicationId.value = parseRouteParameter(route.params.applicationId);
  applicationQuestionId.value = parseRouteParameter(route.params.id);

  const { data } = await useApi<PaginatedResponse<ApplicationQuestion[]>>(
    "/application-question",
    {
      method: "get",
      params: {
        "filter[id]": applicationQuestionId.value,
      },
    },
  );
  if (!data.value || !data.value?.data[0]) {
    navigateTo(`/application/${applicationId.value}/question`);
    return;
  }

  applicationQuestion.value = data.value.data[0];

  setFieldValue("order", applicationQuestion.value.order);
  setFieldValue("question", applicationQuestion.value.question);
  setFieldValue("is_active", applicationQuestion.value.is_active);

  loading.value = false;
});

definePageMeta({
  permission: {
    permission: "applicationQuestion.update",
    fallback: `/application/${applicationId.value}/question`,
  },
});

useHead({
  title: "Edit Application Question",
});
</script>

<template>
  <div class="flex grow">
    <div v-if="loading" class="flex grow items-center justify-center">
      <Spinner />
    </div>
    <div v-else class="w-full">
      <p class="mb-8 text-2xl">Edit Application Question</p>
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
