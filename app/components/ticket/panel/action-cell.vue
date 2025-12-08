<script lang="ts" setup>
import type { TicketPanelData } from "@OrdinarySMP/api-types";

const client = useApiClient();
const openDeleteModal = ref(false);
const toast = useSimpleToast();

const props = defineProps<{
  data: TicketPanelData;
}>();

const emit = defineEmits<{
  (e: "deleted"): void;
}>();

const deleteTicketPanel = async () => {
  try {
    await client(`/ticket/panel/${props.data.id}`, {
      method: "delete",
    });
    toast.success("The Panel was deleted.");
    emit("deleted");
  } catch {
    toast.error("An error occurred while deleting the Panel.");
  } finally {
    openDeleteModal.value = false;
  }
};

const sendPanel = async () => {
  const response = await client(`/ticket/panel/${props.data.id}/send`, {
    method: "post",
  });

  if (response) {
    toast.success("The Panel has been send successfully.");
  } else {
    toast.success("An error occurred while sending the Panel.");
  }
};
</script>

<template>
  <div class="space-x-2">
    <UButton
      v-if="hasPermissionTo('ticketPanel.update')"
      label="Edit"
      size="md"
      icon="material-symbols:edit-outline"
      type="button"
      variant="subtle"
      :to="`/ticket/panel/edit/${data.id}`"
    />
    <UButton
      v-if="hasPermissionTo('ticketPanel.update')"
      label="Send"
      size="md"
      icon="material-symbols:edit-outline"
      type="button"
      color="secondary"
      variant="subtle"
      @click="sendPanel"
    />
    <UModal
      v-model:open="openDeleteModal"
      :title="`Delete the Panel: ${data.title}?`"
      :description="`Are you sure, this action cannot be undone.`"
    >
      <UButton
        v-if="hasPermissionTo('ticketPanel.delete')"
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
            @click="deleteTicketPanel"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
