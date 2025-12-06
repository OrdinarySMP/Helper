<script lang="ts" setup>
import type { RuleData } from "@ordinary/api-types";
import * as zod from "zod";
import type { Form } from "#ui/types";

const model = defineModel<Partial<RuleData>>({ required: true });

const emit = defineEmits<{
  (e: "persited" | "loading" | "done"): void;
  (e: "persist-error", err: unknown): void;
}>();

const client = useApiClient();

const schema = zod.object({
  number: zod.number().min(1),
  name: zod.string().min(1),
  rule: zod.string().min(1),
});
type Schema = zod.output<typeof schema>;
const form = ref<Form<Schema>>();

const { submitting, onSubmit } = useApiForm(form, async (event) => {
  try {
    emit("loading");
    const route = model.value?.id ? `/rule/${model.value.id}` : "/rule";
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
    <RuleFields v-model="model" />

    <UButton type="submit" variant="subtle" :loading="submitting">
      Save
    </UButton>
  </UForm>
</template>
