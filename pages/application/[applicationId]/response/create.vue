<script lang="ts" setup>
import { ref } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useForm } from "vee-validate";
import { ApplicationResponseType, type ApplicationData } from "@ordinary/api-types";

const applicationId = ref<ApplicationData["id"]>();

const route = useRoute();
const errorMessage = ref("");

const formSchema = toTypedSchema(
  zod.object({
    name: zod.string().min(1),
    response: zod.string().min(1),
    type: zod.nativeEnum(ApplicationResponseType),
  }),
);

const { handleSubmit, setErrors, isSubmitting } = useForm({
  validationSchema: formSchema,
});

const save = handleSubmit(async (values) => {
  errorMessage.value = "";

  const { error } = await useApi("/application-response", {
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
    navigateTo(`/application/${applicationId.value}/response`);
  }
});

const types = computed(() =>
  Object.entries(ApplicationResponseType)
    .filter(([_, value]) => typeof value === "number")
    .map(([key, value]) => ({
      label: key,
      value: value as number,
    })),
);

definePageMeta({
  permission: {
    permission: "applicationResponse.create",
    fallback: `/application/${applicationId.value}/response`,
  },
});

useHead({
  title: "Create Application Response",
});

onMounted(() => {
  applicationId.value = parseRouteParameter(route.params.applicationId);
});
</script>

<template>
  <div class="flex grow">
    <div class="w-full">
      <p class="mb-8 text-2xl">Create Application Response</p>
      <form class="grid grid-cols-1 gap-4" @submit.prevent="save">
        <FieldInput name="name" label="Name" />

        <FieldTextArea name="response" label="Response" />

        <FieldSelect :items="types" name="type" label="Type" />

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
