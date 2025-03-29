<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useForm } from "vee-validate";
import type { ApplicationResponse } from "@/types/application/response";
import type { Application } from "@/types/application";
import type { PaginatedResponse } from "@/types/response";
import { ApplicationResponseType } from "@/types/application/response";

const applicationId = ref<Application["id"]>();
if (!hasPermissionTo("applicationResponse.update")) {
  await navigateTo(`/application/${applicationId.value}/response`);
}

const route = useRoute();
const applicationResponseId = ref<ApplicationResponse["id"]>();
const applicationResponse = ref<ApplicationResponse>();
const loading = ref(true);
const errorMessage = ref("");

const formSchema = toTypedSchema(
  zod.object({
    name: zod.string().min(1),
    response: zod.string().min(1),
    type: zod.nativeEnum(ApplicationResponseType),
  }),
);

const { handleSubmit, setErrors, isSubmitting, setFieldValue } = useForm({
  validationSchema: formSchema,
});

const save = handleSubmit(async (values) => {
  errorMessage.value = "";

  const { error } = await useApi(
    `/application-response/${applicationResponseId.value}`,
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
    navigateTo(`/application/${applicationId.value}/response`);
  }
});

onMounted(async () => {
  loading.value = true;
  applicationId.value = parseRouteParameter(route.params.applicationId);
  applicationResponseId.value = parseRouteParameter(route.params.id);

  const { data } = await useApi<PaginatedResponse<ApplicationResponse[]>>(
    "/application-response",
    {
      method: "get",
      params: {
        "filter[id]": applicationResponseId.value,
      },
    },
  );
  if (!data.value || !data.value?.data[0]) {
    navigateTo(`/application/${applicationId.value}/response`);
    return;
  }

  applicationResponse.value = data.value.data[0];

  setFieldValue("name", applicationResponse.value.name);
  setFieldValue("response", applicationResponse.value.response);
  setFieldValue("type", applicationResponse.value.type);

  loading.value = false;
});

const types = computed(() =>
  Object.entries(ApplicationResponseType)
    .filter(([_, value]) => typeof value === "number")
    .map(([key, value]) => ({
      label: key,
      value: value as number,
    })),
);

useHead({
  title: "Edit Application Response",
});
</script>

<template>
  <div class="flex grow">
    <div v-if="loading" class="flex grow items-center justify-center">
      <Spinner />
    </div>
    <div v-else class="w-full">
      <p class="mb-8 text-2xl">Edit Application Response</p>
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
