<script lang="ts" setup>
import type { ServerContentMessageData } from "@OrdinarySMP/api-types";
import * as zod from "zod";
import type { Form } from "#ui/types";

const model = defineModel<Partial<ServerContentMessageData>>({
  required: true,
});
defineProps<{
  canCreate: boolean;
}>();

const emit = defineEmits<{
  (e: "persited" | "loading" | "done"): void;
  (e: "persist-error", err: unknown): void;
}>();

const client = useApiClient();

const schema = zod.object({
  heading: zod.string().min(1).max(2000),
  not_recommended: zod.string().min(1).max(2000),
  recommended: zod.string().min(1).max(2000),
});
type Schema = zod.output<typeof schema>;
const form = ref<Form<Schema>>();

const { submitting, onSubmit } = useApiForm(form, async (event) => {
  try {
    emit("loading");
    await client("/server-content-message", {
      method: "POST",
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
    :state="model"
    @submit="onSubmit"
  >
    <ServerContentMessageFields v-model="model" :can-create="canCreate" />

    <UButton
      v-if="canCreate"
      type="submit"
      variant="subtle"
      :loading="submitting"
    >
      Save
    </UButton>
  </UForm>
</template>
