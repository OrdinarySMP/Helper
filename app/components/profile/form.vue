<script lang="ts" setup>
import * as zod from "zod";
import type { Form } from "#ui/types";
import type { Profile } from "@/types/profile";

const emit = defineEmits<{
  (e: "persited" | "loading" | "done"): void;
  (e: "persist-error", err: unknown): void;
}>();

const client = useApiClient();
const user = useCurrentUser();

const schema = zod
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
  });
type Schema = zod.output<typeof schema>;
const form = ref<Form<Schema>>();

const profile = ref<Profile>({
  password: "",
  password_confirmation: "",
});

const { submitting, onSubmit } = useApiForm(form, async (event) => {
  try {
    emit("loading");
    await client(`/user/${user.value?.id}`, {
      method: "patch",
      body: event.data,
    });
    emit("persited");
  } catch (err) {
    emit("persist-error", err);
    throw err;
  } finally {
    emit("done");
  }
});
</script>

<template>
  <UForm
    ref="form"
    class="space-y-4"
    :schema="schema"
    :state="profile"
    @submit="onSubmit"
  >
    <ProfileFields v-model="profile" />

    <UButton type="submit" variant="subtle" :loading="submitting">
      Save
    </UButton>
  </UForm>
</template>
