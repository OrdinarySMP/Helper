<script lang="ts" setup>
import { ref } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useForm } from "vee-validate";

if (!hasPermissionTo("serverContent.create")) {
  await navigateTo("/server-content");
}

const errorMessage = ref("");

const formSchema = toTypedSchema(
  zod.object({
    name: zod.string().min(1).max(128),
    url: zod.string().url().max(256),
    description: zod.string().min(1).max(512),
    is_recommended: zod.boolean(),
    is_active: zod.boolean(),
  }),
);

const { handleSubmit, setErrors, isSubmitting } = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: "",
    url: "",
    description: "",
    is_recommended: false,
    is_active: false,
  },
});

const save = handleSubmit(async (values) => {
  errorMessage.value = "";

  const { error } = await useApi("/server-content", {
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

useHead({
  title: "Create Mod/Datapack",
});
</script>

<template>
  <div class="flex grow">
    <div class="w-full">
      <p class="mb-8 text-2xl">Create Mod/Datapack</p>
      <form class="grid grid-cols-1 gap-4" @submit.prevent="save">
        <FieldInput name="name" label="Name" />

        <FieldInput name="url" label="URL" />

        <FieldTextArea name="description" label="Description" />

        <FieldSwitch name="is_recommended" label="Is recommended?" />

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
