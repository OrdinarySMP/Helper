<script lang="ts" setup>
import { ref } from "vue";
import type { ServerContent } from "@/types/serverContent";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useForm } from "vee-validate";
import type { PaginatedResponse } from "@/types/response";

const route = useRoute();
const serverContentId = ref<ServerContent["id"]>();
const serverContent = ref<ServerContent>();
const loading = ref(true);
const errorMessage = ref("");

const formSchema = toTypedSchema(
  zod.object({
    name: zod.string().min(1).max(128),
    url: zod.string().url().max(256),
    description: zod.string().min(1).max(512),
    is_recommended: zod.boolean(),
  }),
);

const { handleSubmit, setErrors, isSubmitting, setFieldValue } = useForm({
  validationSchema: formSchema,
});

const save = handleSubmit(async (values) => {
  errorMessage.value = "";

  const { error } = await useApi(`/server-content/${serverContentId.value}`, {
    method: "patch",
    body: values,
  });

  if (error.value) {
    errorMessage.value = error.value.data.message;
    setErrors(error.value.data.errors ?? []);
  } else {
    navigateTo("/server-content");
  }
});

onMounted(async () => {
  loading.value = true;
  serverContentId.value = parseRouteParameter(route.params.id);

  const { data } = await useApi<PaginatedResponse<ServerContent[]>>(
    "/server-content",
    {
      method: "get",
      params: {
        "filter[id]": serverContentId.value,
      },
    },
  );
  if (!data.value || !data.value?.data[0]) {
    navigateTo("/server-content");
    return;
  }

  serverContent.value = data.value.data[0];

  setFieldValue("name", serverContent.value.name);
  setFieldValue("url", serverContent.value.url);
  setFieldValue("description", serverContent.value.description);
  setFieldValue("is_recommended", serverContent.value.is_recommended);

  loading.value = false;
});

useHead({
  title: "Edit Mod/Datapack",
});
</script>

<template>
  <div class="flex grow">
    <div class="w-full">
      <p class="mb-8 text-2xl">Edit Mod/Datapack</p>
      <form class="grid grid-cols-1 gap-4" @submit.prevent="save">
        <FieldInput name="name" label="Name" />

        <FieldInput name="url" label="URL" />

        <FieldTextArea name="description" label="Description" />

        <FieldSwitch name="is_recommended" label="Is recommended?" />

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
