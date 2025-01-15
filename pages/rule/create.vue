<script lang="ts" setup>
import { ref } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useForm } from "vee-validate";

if (!hasPermissionTo("rule.create")) {
  await navigateTo("/rule");
}

const errorMessage = ref("");

const formSchema = toTypedSchema(
  zod.object({
    number: zod.number().min(1),
    name: zod.string().min(1),
    rule: zod.string().min(1),
  }),
);

const { handleSubmit, setErrors, isSubmitting } = useForm({
  validationSchema: formSchema,
});

const save = handleSubmit(async (values) => {
  errorMessage.value = "";

  const { error } = await useApi("/rule", {
    method: "post",
    body: values,
  });

  if (error.value) {
    errorMessage.value = error.value.data.message;
    setErrors(error.value.data.errors ?? []);
  } else {
    navigateTo("/rule");
  }
});

useHead({
  title: "Create Rule",
});
</script>

<template>
  <div class="flex grow">
    <div class="w-full">
      <p class="mb-8 text-2xl">Create Rule</p>
      <form class="grid grid-cols-1 gap-4" @submit.prevent="save">
        <FieldInput name="number" label="Number" type="number" />

        <FieldInput name="name" label="Name" />

        <FieldTextArea name="rule" label="Rule" />

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
