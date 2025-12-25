<script lang="ts" setup>
import type { ApplicationQuestionData } from "@OrdinarySMP/api-types";
import * as zod from "zod";
import type { Form } from "#ui/types";

const model = defineModel<Partial<ApplicationQuestionData>>({ required: true });

const emit = defineEmits<{
  (e: "persited" | "loading" | "done"): void;
  (e: "persist-error", err: unknown): void;
}>();

const client = useApiClient();

const schema = zod.object({
  order: zod.number().min(1),
  question: zod.string().min(1).max(255),
  is_active: zod.boolean(),
  application_id: zod.number().min(1),
});
type Schema = zod.output<typeof schema>;
const form = ref<Form<Schema>>();

const { submitting, onSubmit } = useApiForm(form, async (event) => {
  try {
    emit("loading");
    const route = model.value?.id
      ? `/application-question/${model.value.id}`
      : "/application-question";
    const method = model.value?.id ? "PATCH" : "POST";
    await client(route, {
      method,
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
    <ApplicationQuestionFields v-model="model" />

    <UButton type="submit" variant="subtle" :loading="submitting">
      Save
    </UButton>
  </UForm>
</template>
