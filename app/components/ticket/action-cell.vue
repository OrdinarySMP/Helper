<script lang="ts" setup>
import { TicketState, type TicketData } from "@OrdinarySMP/api-types";

const client = useApiClient();
const toast = useSimpleToast();
const user = useCurrentUser();

const props = defineProps<{
  data: TicketData;
}>();

const emit = defineEmits<{
  (e: "closed"): void;
}>();

const closeTicket = async () => {
  const response = await client(`/ticket/${props.data.id}/close`, {
    method: "post",
    body: {
      closed_by_discord_user_id: user.value?.discord_id,
    },
  });
  if (response) {
    toast.success("Ticket closed.");
    emit("closed");
  } else {
    toast.error("An error occurred while closing the Ticket.");
  }
};
</script>

<template>
  <div class="space-x-2">
    <UButton
      v-if="
        hasPermissionTo(['ticketTranscript.read', 'ticketTranscript.read-own'])
      "
      label="Transcript"
      size="md"
      icon="material-symbols:drive-file-rename-outline-outline"
      type="button"
      variant="subtle"
      :to="`/ticket/transcript/${data.id}`"
    />

    <UButton
      v-if="hasPermissionTo('ticket.update') && data.state === TicketState.Open"
      label="Close"
      size="md"
      icon="material-symbols:cancel-outline"
      color="error"
      type="button"
      variant="subtle"
      @click="closeTicket"
    />
  </div>
</template>
