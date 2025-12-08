<script lang="ts" setup>
import type { TicketPanelData } from "@OrdinarySMP/api-types";
import * as zod from "zod";
import type { Form } from "#ui/types";

const model = defineModel<Partial<TicketPanelData>>({ required: true });

const emit = defineEmits<{
  (e: "persited" | "loading" | "done"): void;
  (e: "persist-error", err: unknown): void;
}>();

const client = useApiClient();

const schema = zod.object({
  title: zod.string().min(1).max(100),
  message: zod.string().min(1).max(1000),
  embed_color: zod.string().min(7).max(7),
  channel_id: zod.string(),
});
type Schema = zod.output<typeof schema>;
const form = ref<Form<Schema>>();

const { submitting, onSubmit } = useApiForm(form, async (event) => {
  try {
    emit("loading");
    const route = model.value?.id
      ? `/ticket/panel/${model.value.id}`
      : "/ticket/panel";
    const method = model.value?.id ? "PATCH" : "POST";
    await client(route, {
      method,
      body: {
        ...event.data,
      },
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
    <TicketPanelFields v-model="model" />

    <UButton type="submit" variant="subtle" :loading="submitting">
      Save
    </UButton>
  </UForm>
</template>
