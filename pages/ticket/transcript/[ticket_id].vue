<script lang="ts" setup>
import { ref, onMounted } from "vue";
import type { Ticket } from "@/types/ticket";
import { TicketState } from "@/types/ticket";
import dayjs from "dayjs";
import type { PaginatedResponse } from "@/types/response";

if (!hasPermissionTo("ticketTranscript.read")) {
  await navigateTo("/");
}

const route = useRoute();
const loading = ref(true);
const ticket = ref<Ticket>();
const ticketId = ref<Ticket["id"]>();

const loadTicket = async (page = 1) => {
  loading.value = true;
  const { data } = await useApi<PaginatedResponse<Ticket[]>>("/ticket", {
    method: "get",
    query: {
      "filter[id]": ticketId.value,
      page_size: 10,
      page,
      include: "ticketTranscripts,ticketButton",
    },
  });

  if (!data.value || !data.value?.data[0]) {
    navigateTo("/ticket");
    return;
  }
  ticket.value = data.value.data[0];

  loading.value = false;
};

useHead({
  title: "Ticket Transcript",
});

onMounted(() => {
  ticketId.value = parseRouteParameter(route.params.ticket_id);
  loadTicket();
});
</script>

<template>
  <div class="flex grow">
    <div v-if="loading" class="flex grow items-center justify-center">
      <Spinner />
    </div>
    <div v-else class="w-full">
      <p class="mb-8 text-2xl">Ticket {{ ticket?.id }}</p>
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

      <p class="mb-8 text-xl">Transcript</p>
      <div
        v-for="(transcript, key) in ticket?.ticket_transcripts"
        :key="key"
        class="mb-4"
      >
        <div class="flex">
          <img
            :src="`https://cdn.discordapp.com/avatars/${transcript.discord_user_id}/${transcript.user?.avatar}.png`"
            class="rounded-full size-10 mr-2"
            alt=""
          />
          <div>
            <span class="mr-2">
              {{
                transcript.user?.global_name ??
                transcript.user?.username ??
                transcript.discord_user_id
              }}
            </span>
            <span class="text-sm text-gray-800">
              {{ dayjs(transcript.updated_at).format("DD.MM.YYYY HH:mm:ss") }}
            </span>
            <br />
            <p>{{ transcript?.message }}</p>
            <p v-if="transcript?.attachments !== '[]'">
              <TicketTranscriptAttachement
                v-for="(attachment, attachmentKey) in JSON.parse(
                  transcript?.attachments ?? '[]',
                )"
                :key="attachmentKey"
                :attachment="attachment"
              />
            </p>
            <p v-if="transcript?.embeds !== '[]'">{{ transcript?.embeds }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
