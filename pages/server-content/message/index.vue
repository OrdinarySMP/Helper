<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useForm } from "vee-validate";
import type { ServerContentMessage } from "@/types/serverContent";

const loading = ref(true);
const errorMessage = ref("");

const formSchema = toTypedSchema(
  zod.object({
    heading: zod.string().min(1).max(2000),
    not_recommended: zod.string().min(1).max(2000),
    recommended: zod.string().min(1).max(2000),
  }),
);

const { handleSubmit, setErrors, isSubmitting, setFieldValue } = useForm({
  validationSchema: formSchema,
});

const save = handleSubmit(async (values) => {
  errorMessage.value = "";

  const { error } = await useApi("/server-content-message", {
    method: "post",
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

  const { data } = await useApi<ServerContentMessage>(
    "/server-content-message",
    {
      method: "get",
    },
  );

  if (data.value) {
    setFieldValue("heading", data.value.heading);
    setFieldValue("not_recommended", data.value.not_recommended);
    setFieldValue("recommended", data.value.recommended);
  }

  loading.value = false;
});

useHead({
  title: "Mod/Datapack Messages",
});
</script>

<template>
  <div class="flex grow">
    <div v-if="loading" class="flex grow items-center justify-center">
      <Spinner />
    </div>
    <div v-else class="w-full">
      <p class="mb-8 text-2xl">Mods and Datapacks Messages</p>
      <form class="grid grid-cols-1 gap-4" @submit.prevent="save">
        <FieldTextArea name="heading" label="Heading" />
        <FieldTextArea name="not_recommended" label="Not recommended" />
        <FieldTextArea name="recommended" label="Recommended" />

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
