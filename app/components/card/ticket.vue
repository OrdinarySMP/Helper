<script lang="ts" setup>
import { TicketState, type TicketData } from "@OrdinarySMP/api-types";
import type { FullResponse } from "@/types/response";

const { data } = await useApi<FullResponse<TicketData[]>>("/ticket", {
  params: {
    full: true,
    "filter[state]": TicketState.Open,
  },
});
</script>

<template>
  <UCard variant="subtle">
    <template #header>
      Open Tickets
      <UBadge variant="subtle">{{ data?.data?.length }}</UBadge>
    </template>

    <div class="grid grid-cols-3 gap-4">
      <p>Button</p>
      <p>Created by</p>
      <p>Transcript</p>
      <template v-for="(submission, key) in data?.data" :key="key">
        <p>{{ submission.ticket_button?.text }}</p>
        <p>
          {{
            submission.created_by_discord_user?.global_name ??
            submission.created_by_discord_user_id
          }}
        </p>
        <div>
          <UButton
            label="Transcript"
            size="md"
            icon="material-symbols:drive-file-rename-outline-outline"
            type="button"
            variant="subtle"
            :to="`/ticket/transcript/${submission.id}`"
          />
        </div>
      </template>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <UButton
          label="To the tickets"
          size="md"
          variant="subtle"
          to="/ticket"
        />
      </div>
    </template>
  </UCard>
</template>
