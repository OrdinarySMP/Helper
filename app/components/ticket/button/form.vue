<script lang="ts" setup>
import type { TicketButtonData } from "@ordinary/api-types";
import * as zod from "zod";
import type { Form } from "#ui/types";

const model = defineModel<Partial<TicketButtonData>>({ required: true });

const emit = defineEmits<{
  (e: "persited" | "loading" | "done"): void;
  (e: "persist-error", err: unknown): void;
}>();

const client = useApiClient();

const schema = zod.object({
  ticket_team_id: zod.number(),
  ticket_panel_id: zod.number(),
  text: zod.string().min(1).max(50),
  color: zod.number(),
  initial_message: zod.string().min(1).max(1000),
  emoji: zod.string().min(1),
  naming_scheme: zod.string().min(1).max(128),
  disabled: zod.boolean(),
  ticket_button_ping_role_ids: zod.string().array(),
});
type Schema = zod.output<typeof schema>;
const form = ref<Form<Schema>>();

const { submitting, onSubmit } = useApiForm(form, async (event) => {
  try {
    emit("loading");
    const route = model.value?.id
      ? `/ticket/button/${model.value.id}`
      : "/ticket/button";
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
    <TicketButtonFields v-model="model" />

    <UButton type="submit" variant="subtle" :loading="submitting">
      Save
    </UButton>
  </UForm>
</template>
