<script lang="ts" setup>
import { ref } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useForm } from "vee-validate";
import type { Button } from "@/types/ticket/button";
import type { Panel } from "@/types/ticket/panel";
import type { Team } from "@/types/ticket/team";
import type { FullResponse } from "@/types/response";
import { FaceSmileIcon } from "@heroicons/vue/24/outline";
import EmojiPicker from "vue3-emoji-picker";
import "vue3-emoji-picker/css";

if (!hasPermissionTo("ticketButton.create")) {
  await navigateTo("/ticket/button");
}

const errorMessage = ref("");
const teams = ref<{ label: string; value: number }[]>([]);
const panels = ref<{ label: string; value: number }[]>([]);
const showEmojiPicker = ref(false);
const loading = ref(true);

const formSchema = toTypedSchema(
  zod.object({
    ticket_team_id: zod.number(),
    ticket_panel_id: zod.number(),
    text: zod.string().min(1).max(50),
    color: zod.number(),
    initial_message: zod.string().min(1).max(1000),
    emoji: zod.string().min(1),
    naming_scheme: zod.string().min(1).max(128),
  }),
);

const { handleSubmit, setErrors, isSubmitting, setFieldValue } = useForm({
  validationSchema: formSchema,
});

const save = handleSubmit(async (values) => {
  errorMessage.value = "";

  const { error } = await useApi("/ticket/button", {
    method: "post",
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
  const { data } = await useApi<FullResponse<Team[]>>("/ticket/team", {
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
  const { data } = await useApi<FullResponse<Panel[]>>("/ticket/panel", {
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

onMounted(async () => {
  loading.value = true;
  await loadTeam();
  await loadPanel();
  loading.value = false;
});

useHead({
  title: "Create Ticket Button",
});
</script>

<template>
  <div class="flex grow">
    <div class="w-full">
      <p class="mb-8 text-2xl">Create Button</p>

      <form class="grid grid-cols-1 gap-4" @submit.prevent="save">
        <FieldSelect :items="teams" name="ticket_team_id" label="Team" />
        <FieldSelect :items="panels" name="ticket_panel_id" label="Panel" />
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
