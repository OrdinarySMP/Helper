<script lang="ts" setup>
import type { TicketButtonData } from "@OrdinarySMP/api-types";

const client = useApiClient();
const openDeleteModal = ref(false);
const toast = useSimpleToast();

const props = defineProps<{
  data: TicketButtonData;
}>();

const emit = defineEmits<{
  (e: "deleted"): void;
}>();

const deleteTicketButton = async () => {
  try {
    await client(`/ticket/button/${props.data.id}`, {
      method: "delete",
    });
    toast.success("The Button was deleted.");
    emit("deleted");
  } catch {
    toast.error("An error occurred while deleting the Button.");
  } finally {
    openDeleteModal.value = false;
  }
};
</script>

<template>
  <div class="space-x-2">
    <UButton
      v-if="hasPermissionTo('ticketButton.update')"
      label="Edit"
      size="md"
      icon="material-symbols:edit-outline"
      type="button"
      variant="subtle"
      :to="`/ticket/button/edit/${data.id}`"
    />
    <UModal
      v-model:open="openDeleteModal"
      :title="`Delete the Button: ${data.text}?`"
      :description="`Are you sure, this action cannot be undone.`"
    >
      <UButton
        v-if="hasPermissionTo('ticketButton.delete')"
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
            @click="deleteTicketButton"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
