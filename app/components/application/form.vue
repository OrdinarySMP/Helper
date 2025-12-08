<script lang="ts" setup>
import type { ApplicationData } from "@OrdinarySMP/api-types";
import * as zod from "zod";
import type { Form } from "#ui/types";
import type { TabsItem } from "@nuxt/ui";

const model = defineModel<Partial<ApplicationData>>({ required: true });

const emit = defineEmits<{
  (e: "persited" | "loading" | "done"): void;
  (e: "persist-error", err: unknown): void;
}>();

const client = useApiClient();

const schema = zod.object({
  name: zod.string().min(1),
  is_active: zod.boolean(),
  log_channel: zod.string().min(1),
  accept_message: zod.string().min(1),
  deny_message: zod.string().min(1),
  confirmation_message: zod.string().min(1),
  completion_message: zod.string().min(1),
  activity_channel: zod.string().min(1).nullable(),
  restricted_role_ids: zod.string().array().optional(),
  accepted_role_ids: zod.string().array().optional(),
  denied_role_ids: zod.string().array().optional(),
  ping_role_ids: zod.string().array().optional(),
  accept_removal_role_ids: zod.string().array().optional(),
  deny_removal_role_ids: zod.string().array().optional(),
  pending_role_ids: zod.string().array().optional(),
  required_role_ids: zod.string().array().optional(),
  embed_title: zod.string().max(100).nullable().optional(),
  embed_description: zod.string().max(1000).nullable().optional(),
  embed_color: zod.string().max(7).nullable().optional(),
  embed_channel_id: zod.string().nullable().optional(),
  embed_button_text: zod.string().max(50).nullable().optional(),
  embed_button_color: zod.number().nullable().optional(),
});
type Schema = zod.output<typeof schema>;
const form = ref<Form<Schema>>();

const items = ref<TabsItem[]>([
  {
    label: "General",
    icon: "line-md:file-document",
    slot: "general" as const,
  },
  {
    label: "Roles",
    icon: "gridicons:multiple-users",
    slot: "roles" as const,
  },
  {
    label: "Button",
    icon: "mingcute:cursor-2-line",
    slot: "button" as const,
  },
]);

const { submitting, onSubmit } = useApiForm(form, async (event) => {
  try {
    emit("loading");
    const route = model.value?.id
      ? `/application/${model.value.id}`
      : "/application";
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
    <UTabs :items="items" size="sm" class="w-full">
      <template #general>
        <div class="space-y-4">
          <ApplicationGeneralFields v-model="model" />
        </div>
      </template>
      <template #roles>
        <div class="space-y-4">
          <ApplicationRolesFields v-model="model" />
        </div>
      </template>
      <template #button>
        <div class="space-y-4">
          <ApplicationButtonFields v-model="model" />
        </div>
      </template>
    </UTabs>

    <UButton type="submit" variant="subtle" :loading="submitting">
      Save
    </UButton>
  </UForm>
</template>
