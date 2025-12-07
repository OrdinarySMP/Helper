<script lang="ts" setup>
import type {
  TicketTeamData,
  TicketButtonData,
  TicketPanelData,
} from "@ordinary/api-types";
import type { FullResponse } from "@/types/response";
import EmojiPicker from "vue3-emoji-picker";
import "vue3-emoji-picker/css";

const model = defineModel<Partial<TicketButtonData>>({ required: true });
const showEmojiPicker = ref(false);

const roles = ref(await loadRoles());
const { data: teamData } = await useApi<FullResponse<TicketTeamData[]>>(
  "/ticket/team?full=true",
);
const { data: panelData } = await useApi<FullResponse<TicketPanelData[]>>(
  "/ticket/panel?full=true",
);

const onSelectEmoji = (data: { i: string }) => {
  model.value.emoji = data.i;
  showEmojiPicker.value = false;
};

const teams = computed(() =>
  teamData.value?.data?.map((team) => ({
    label: team.name,
    value: team.id,
  })),
);
const panels = computed(() =>
  panelData.value?.data?.map((panel) => ({
    label: panel.title,
    value: panel.id,
  })),
);
</script>

<template>
  <UFormField label="Team" name="ticket_team_id" required>
    <USelectMenu
      v-model="model.ticket_team_id"
      :items="teams"
      class="w-full"
      value-key="value"
      label-key="label"
    />
  </UFormField>
  <UFormField label="Panel" name="ticket_panel_id" required>
    <USelectMenu
      v-model="model.ticket_panel_id"
      :items="panels"
      class="w-full"
      value-key="value"
      label-key="label"
    />
  </UFormField>
  <UFormField label="Ping roles" name="ticket_button_ping_role_ids" required>
    <USelectMenu
      v-model="model.ticket_button_ping_role_ids"
      :items="roles"
      class="w-full"
      value-key="value"
      label-key="label"
      multiple
    />
  </UFormField>
  <UFormField label="Text" name="text" required>
    <UInput v-model="model.text" class="w-full" />
  </UFormField>
  <UFormField label="Button color" name="color" required>
    <USelectMenu
      v-model="model.color"
      :items="buttonOptions()"
      class="w-full"
      value-key="value"
      label-key="label"
    />
  </UFormField>
  <UFormField label="Initial message" name="initial_message" required>
    <UTextarea v-model="model.initial_message" class="w-full" />
  </UFormField>
  <UFormField label="Emoji" name="emoji" required>
    <UInput v-model="model.emoji" class="w-full">
      <template #trailing>
        <UIcon
          name="ic:outline-emoji-emotions"
          @click="showEmojiPicker = !showEmojiPicker"
        />
        <div class="relative">
          <EmojiPicker
            v-if="showEmojiPicker"
            class="absolute z-10 right-0"
            :native="true"
            @select="onSelectEmoji"
          />
        </div>
      </template>
    </UInput>
  </UFormField>
  <UFormField label="Naming scheme" name="naming_scheme" required>
    <UInput v-model="model.naming_scheme" class="w-full" />
  </UFormField>
  <UFormField label="Disabled" name="disabled">
    <USwitch v-model="model.disabled" />
  </UFormField>
</template>
