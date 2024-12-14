<script lang="ts" setup>
import { ref } from "vue"
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useForm } from "vee-validate";

const errorMessage = ref("");

const { handleSubmit, setErrors, isSubmitting } =
  useForm({
    initialValues: {
      password: "",
      password_confirmation: "",
    },
    validationSchema: toTypedSchema(
      zod.object({
        password: zod.string().min(12),
        password_confirmation: zod.string().min(12),
      }),
    ),
  });

const save = handleSubmit(async (values) => {
  errorMessage.value = "";

  const { error } = await useApi(`/users/${useAuth().user().value?.id}`, {
    method: "patch",
    body: {
	  	password: values.password,
	  	password_confirmation: values.password_confirmation,
	  },
  });

  if (error.value) {
    errorMessage.value = error.value.data.message;
    setErrors(error.value.data.errors ?? []);
  } else {
    navigateTo("/");
  }
});
</script>

<template>
  <div class="flex grow">
    <div class="w-full">
      <p class="mb-8 text-2xl">Profile</p>
	    <form class="grid grid-cols-1 gap-4" @submit.prevent="save">
				<FieldInput name="password" label="New password" />

				<FieldInput name="password_confirmation" label="Confirm password" />

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
