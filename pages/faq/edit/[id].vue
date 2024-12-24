<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useForm } from "vee-validate";
import type { FAQ } from "@/types/faq";
import type { PaginatedResponse } from "@/types/response";

const route = useRoute();
const faqId = ref<FAQ["id"]>();
const faq = ref<FAQ>();
const loading = ref(true);
const errorMessage = ref("");

const formSchema = toTypedSchema(
  zod.object({
    question: zod.string().min(1),
    answer: zod.string().min(1),
  }),
);

const { handleSubmit, setErrors, isSubmitting, setFieldValue } = useForm({
  validationSchema: formSchema,
});

const save = handleSubmit(async (values) => {
  errorMessage.value = "";

  const { error } = await useApi(`/faq/${faqId.value}`, {
    method: "patch",
    body: values,
  });

  if (error.value) {
    errorMessage.value = error.value.data.message;
    setErrors(error.value.data.errors ?? []);
  } else {
    navigateTo("/faq");
  }
});

onMounted(async () => {
  loading.value = true;
  faqId.value = parseRouteParameter(route.params.id);

  const { data } = await useApi<PaginatedResponse<FAQ[]>>(`/faq`, {
    method: "get",
    params: {
      "filter[id]": faqId.value,
    },
  });
  if (!data.value || !data.value?.data[0]) {
    navigateTo("/faq");
    return;
  }

  faq.value = data.value.data[0];

  setFieldValue("question", faq.value.question);
  setFieldValue("answer", faq.value.answer);

  loading.value = false;
});

useHead({
  title: "Edit FAQ",
});
</script>

<template>
  <div class="flex grow">
    <div v-if="loading" class="flex grow items-center justify-center">
      <Spinner />
    </div>
    <div v-else class="w-full">
      <p class="mb-8 text-2xl">Edit FAQ</p>
      <form class="grid grid-cols-1 gap-4" @submit.prevent="save">
        <FieldInput name="question" label="Question" />

        <FieldInput name="answer" label="Answer" />

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
