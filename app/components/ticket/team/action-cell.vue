<script lang="ts" setup>
import type { TicketTeamData } from "@ordinary/api-types";

const client = useApiClient();
const openDeleteModal = ref(false);
const toast = useSimpleToast();

const props = defineProps<{
  data: TicketTeamData;
}>();

const emit = defineEmits<{
  (e: "deleted"): void;
}>();

const deleteTicketTeam = async () => {
  try {
    await client(`/ticket/team/${props.data.id}`, {
      method: "delete",
    });
    toast.success("The Team was deleted.");
    emit("deleted");
  } catch {
    toast.error("An error occurred while deleting the Team.");
  } finally {
    openDeleteModal.value = false;
  }
};
</script>

<template>
  <div class="space-x-2">
    <UButton
      v-if="hasPermissionTo('ticketTeam.update')"
      label="Edit"
      size="md"
      icon="material-symbols:edit-outline"
      type="button"
      variant="subtle"
      :to="`/ticket/team/edit/${data.id}`"
    />
    <UModal
      v-model:open="openDeleteModal"
      :title="`Delete the Team: ${data.name}?`"
      :description="`Are you sure, this action cannot be undone.`"
    >
      <UButton
        v-if="hasPermissionTo('ticketTeam.delete')"
        size="md"
        label="Delete"
        color="error"
        icon="material-symbols:delete-outline"
        type="button"
        variant="subtle"
      />

      <template #body>
        <div class="flex justify-end gap-2">
          <UButton
            label="Cancel"
            color="neutral"
            variant="subtle"
            size="md"
            @click="openDeleteModal = false"
          />
          <UButton
            label="Delete"
            color="error"
            size="md"
            @click="deleteTicketTeam"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
