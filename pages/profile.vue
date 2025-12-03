<script lang="ts" setup>
import { ref, watchEffect } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useForm } from "vee-validate";
import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/solid";

const user = useCurrentUser();
const errorMessage = ref("");
const showPassword = ref(true);
const showPasswordConfirm = ref(true);
const passwordType = ref<"password" | "text">("password");
const passwordConfirmType = ref<"password" | "text">("password");

const { handleSubmit, setErrors, isSubmitting } = useForm({
  initialValues: {
    password: "",
    password_confirmation: "",
  },
  validationSchema: toTypedSchema(
    zod
      .object({
        password: zod.string().min(12),
        password_confirmation: zod.string().min(12),
      })
      .superRefine(({ password_confirmation, password }, ctx) => {
        if (password_confirmation !== password) {
          ctx.addIssue({
            code: "custom",
            message: "The passwords did not match",
            path: ["password_confirmation"],
          });
        }
      }),
  ),
});

const save = handleSubmit(async (values) => {
  errorMessage.value = "";

  const { error } = await useApi(`/user/${user.value?.id}`, {
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

useHead({
  title: "Profile",
});

watchEffect(() => {
  passwordType.value = showPassword.value ? "password" : "text";
  passwordConfirmType.value = showPasswordConfirm.value ? "password" : "text";
});
</script>

<template>
  <div class="flex grow">
    <div class="w-full">
      <p class="mb-8 text-2xl">Profile</p>
      <form class="grid grid-cols-1 gap-4" @submit.prevent="save">
        <FieldInput :type="passwordType" name="password" label="New password">
          <template #icon>
            <EyeIcon
              v-if="showPassword"
              class="size-4 cursor-pointer"
              @click="showPassword = !showPassword"
            />
            <EyeSlashIcon
              v-else
              class="size-4 cursor-pointer"
              @click="showPassword = !showPassword"
            />
          </template>
        </FieldInput>

        <FieldInput
          :type="passwordConfirmType"
          name="password_confirmation"
          label="Confirm password"
        >
          <template #icon>
            <EyeIcon
              v-if="showPasswordConfirm"
              class="size-4 cursor-pointer"
              @click="showPasswordConfirm = !showPasswordConfirm"
            />
            <EyeSlashIcon
              v-else
              class="size-4 cursor-pointer"
              @click="showPasswordConfirm = !showPasswordConfirm"
            />
          </template>
        </FieldInput>

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
