<script lang="ts" setup>
import { TicketState, type TicketData } from "@ordinary/api-types";
import dayjs from "dayjs";
import type { PaginatedResponse } from "@/types/response";

const route = useRoute();
const ticket = ref<TicketData>();

const { data } = await useApi<PaginatedResponse<TicketData[]>>("/ticket", {
  method: "get",
  query: {
    "filter[id]": route.params.ticket_id,
    include: "ticketTranscripts,ticketButton",
  },
});

ticket.value = data.value?.data[0];

definePageMeta({
  permission: {
    permission: "ticketTranscript.read",
  },
});

useHead({
  title: "Ticket Transcript",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar :title="`Ticket ${ticket?.id} Transcript`" />
    </template>

    <template #body>
      <div class="flex grow">
        <div class="w-full">
          <div class="grid grid-cols-3 mb-4">
            <p>State: {{ ticket ? TicketState[ticket.state] : "---" }}</p>
            <p>Button: {{ ticket?.ticket_button?.text }}</p>
            <p>
              Closed by:
              {{
                ticket?.closed_by_discord_user?.global_name ??
                ticket?.closed_by_discord_user_id
              }}
            </p>
            <p>
              Created by:
              {{
                ticket?.created_by_discord_user?.global_name ??
                ticket?.created_by_discord_user_id
              }}
            </p>
            <p>Channel Name: {{ ticket?.channel_name }}</p>
            <p>Closed reason: {{ ticket?.closed_reason }}</p>
          </div>

          <UChatMessage
            v-for="(transcript, key) in ticket?.ticket_transcripts"
            :id="`${transcript.id}`"
            :key="key"
            :avatar="{
              src: `https://cdn.discordapp.com/avatars/${transcript.discord_user_id}/${transcript.user?.avatar}.png`,
            }"
            :parts="[
              {
                id: transcript.id,
                type: 'text',
              },
            ]"
            variant="subtle"
            role="user"
            class="mb-4"
          >
            <template #content>
              <span class="mr-2">
                {{
                  transcript.user?.global_name ??
                  transcript.user?.username ??
                  transcript.discord_user_id
                }}
              </span>
              <span
                class="text-sm text-gray-800 dark:text-gray-600 mr-2"
                :class="{ 'line-through': transcript.deleted_at }"
              >
                {{ dayjs(transcript.updated_at).format("DD.MM.YYYY HH:mm:ss") }}
              </span>
              <span v-if="transcript.deleted_at" class="text-sm text-red-600">
                {{ dayjs(transcript.deleted_at).format("DD.MM.YYYY HH:mm:ss") }}
              </span>
              <p :class="{ 'line-through': transcript.deleted_at }">
                {{ transcript.message }}
              </p>
              <p v-if="transcript?.attachments !== '[]'">
                <TicketTranscriptAttachement
                  v-for="(attachment, attachmentKey) in JSON.parse(
                    transcript?.attachments ?? '[]',
                  )"
                  :key="attachmentKey"
                  :attachment="attachment"
                />
              </p>
              <p v-if="transcript.embeds !== '[]'">
                <TicketTranscriptEmbed
                  v-for="(embed, embedKey) in JSON.parse(
                    transcript.embeds ?? '[]',
                  )"
                  :key="embedKey"
                  :embed="embed"
                />
              </p>
            </template>
          </UChatMessage>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
