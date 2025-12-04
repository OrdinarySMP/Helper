<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useForm } from "vee-validate";
import type { TicketPanelData, TicketTeamData, TicketButtonData } from "@ordinary/api-types"
import type { PaginatedResponse, FullResponse } from "@/types/response";
import { FaceSmileIcon } from "@heroicons/vue/24/outline";
import EmojiPicker from "vue3-emoji-picker";
import "vue3-emoji-picker/css";

const route = useRoute();
const ticketButtonId = ref<TicketButtonData["id"]>();
const ticketButton = ref<TicketButtonData>();
const showEmojiPicker = ref(false);
const loading = ref(true);
const errorMessage = ref("");
const roles = ref(await loadRoles());
const teams = ref<{ label: string; value: number }[]>([]);
const panels = ref<{ label: string; value: number }[]>([]);

const formSchema = toTypedSchema(
  zod.object({
    ticket_team_id: zod.number(),
    ticket_panel_id: zod.number(),
    text: zod.string().min(1).max(50),
    color: zod.number(),
    initial_message: zod.string().min(1).max(1000),
    emoji: zod.string().min(1),
    naming_scheme: zod.string().min(1).max(128),
    disabled: zod.boolean(),
    ticket_button_ping_role_ids: zod.string().array(),
  }),
);

const { handleSubmit, setErrors, isSubmitting, setFieldValue } = useForm({
  validationSchema: formSchema,
});

const save = handleSubmit(async (values) => {
  errorMessage.value = "";

  const { error } = await useApi(`/ticket/button/${ticketButtonId.value}`, {
    method: "patch",
    body: values,
  });

  if (error.value) {
    errorMessage.value = error.value.data.message;
    setErrors(error.value.data.errors ?? []);
  } else {
    navigateTo("/ticket/button");
  }
});

const loadTeam = async () => {
  const { data } = await useApi<FullResponse<TicketTeamData[]>>("/ticket/team", {
    method: "get",
    query: {
      full: true,
    },
  });
  teams.value =
    data.value?.data?.map((team) => ({
      label: team.name,
      value: team.id,
    })) ?? ([] as { label: string; value: number }[]);
};

const loadPanel = async () => {
  const { data } = await useApi<FullResponse<TicketPanelData[]>>("/ticket/panel", {
    method: "get",
    query: {
      full: true,
    },
  });
  panels.value =
    data.value?.data?.map((panel) => ({
      label: panel.title,
      value: panel.id,
    })) ?? ([] as { label: string; value: number }[]);
};

const onSelectEmoji = (data: { i: string }) => {
  setFieldValue("emoji", data.i);
  showEmojiPicker.value = false;
};

definePageMeta({
  permission: {
    permission: "ticketButton.update",
    fallback: "/ticket/button",
  },
});

onMounted(async () => {
  loading.value = true;
  ticketButtonId.value = parseRouteParameter(route.params.id);

  const { data } = await useApi<PaginatedResponse<TicketButtonData[]>>("/ticket/button", {
    method: "get",
    params: {
      include: "ticketButtonPingRoles",
      "filter[id]": ticketButtonId.value,
    },
  });
  if (!data.value || !data.value?.data[0]) {
    navigateTo("/ticket/button");
    return;
  }
  await loadTeam();
  await loadPanel();

  ticketButton.value = data.value.data[0];

  setFieldValue("ticket_team_id", ticketButton.value.ticket_team_id);
  setFieldValue("ticket_panel_id", ticketButton.value.ticket_panel_id);
  setFieldValue("text", ticketButton.value.text);
  setFieldValue("color", ticketButton.value.color);
  setFieldValue("initial_message", ticketButton.value.initial_message);
  setFieldValue("emoji", ticketButton.value.emoji);
  setFieldValue("naming_scheme", ticketButton.value.naming_scheme);
  setFieldValue("disabled", ticketButton.value.disabled);
  console.log(ticketButton.value);
  setFieldValue(
    "ticket_button_ping_role_ids",
    ticketButton.value.ticket_button_ping_roles?.map(
      (ticketButtonPingRole) => ticketButtonPingRole.role_id,
    ) ?? [],
  );

  loading.value = false;
});

useHead({
  title: "Edit Ticket Button",
});
</script>

<template>
  <div class="flex grow">
    <div v-if="loading" class="flex grow items-center justify-center">
      <Spinner />
    </div>
    <div v-else class="w-full">
      <p class="mb-8 text-2xl">Edit Ticket Button</p>
      <form class="grid grid-cols-1 gap-4" @submit.prevent="save">
        <FieldSelect :items="teams" name="ticket_team_id" label="Team" />
        <FieldSelect :items="panels" name="ticket_panel_id" label="Panel" />
        <FieldMultiSelect
          :items="roles"
          name="ticket_button_ping_role_ids"
          label="Ping Roles"
        />
        <FieldInput name="text" label="Text" />
        <FieldSelect
          :items="discordButtonItems"
          name="color"
          label="Button Color"
        />
        <FieldTextArea name="initial_message" label="Initial message" />
        <FieldInput name="emoji" label="Emoji">
          <template #icon>
            <div class="relative">
              <span @click="showEmojiPicker = !showEmojiPicker">
                <FaceSmileIcon class="size-6" />
              </span>
              <EmojiPicker
                v-if="showEmojiPicker"
                class="absolute z-10 right-0"
                :native="true"
                @select="onSelectEmoji"
              />
            </div>
          </template>
        </FieldInput>
        <FieldInput name="naming_scheme" label="Naming scheme" />
        <FieldCheckbox name="disabled" label="Disabled?" />
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
