<script lang="ts" setup>
import * as zod from "zod";
import type { TicketConfigData } from "@OrdinarySMP/api-types";
import type { Form } from "#ui/types";

const emit = defineEmits<{
  (e: "persited" | "loading" | "done"): void;
  (e: "persist-error", err: unknown): void;
}>();

const client = useApiClient();
const config = ref<Partial<TicketConfigData>>({});
const schema = zod.object({
  category_id: zod.string().min(1).max(20),
  transcript_channel_id: zod.string().min(1).max(20),
});
type Schema = zod.output<typeof schema>;
const form = ref<Form<Schema>>();

const data = await client<{ data: TicketConfigData }>("/ticket/config", {
  method: "get",
});
config.value = data.data;

const canCreate = computed(() => hasPermissionTo("ticketConfig.create"));

const { submitting, onSubmit } = useApiForm(form, async (event) => {
  try {
    emit("loading");
    await client("/ticket/config", {
      method: "post",
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
    :state="config"
    @submit="onSubmit"
  >
    <TicketConfigFields v-model="config" />

    <UButton
      type="submit"
      variant="subtle"
      :disabled="!canCreate"
      :loading="submitting"
    >
      Save
    </UButton>
  </UForm>
</template>
