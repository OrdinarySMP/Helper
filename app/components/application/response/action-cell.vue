<script lang="ts" setup>
import type { ApplicationResponseData } from "@ordinary/api-types";

const client = useApiClient();
const openDeleteModal = ref(false);
const toast = useSimpleToast();

const props = defineProps<{
  data: ApplicationResponseData;
}>();

const emit = defineEmits<{
  (e: "deleted"): void;
}>();

const deleteResponse = async () => {
  try {
    await client(`/application-response/${props.data.id}`, {
      method: "delete",
    });
    toast.success("The Response was deleted.");
    emit("deleted");
  } catch {
    toast.error("An error occurred while deleting the Response.");
  } finally {
    openDeleteModal.value = false;
  }
};
</script>

<template>
  <div class="space-x-2">
    <UButton
      v-if="hasPermissionTo('applicationResponse.update')"
      label="Edit"
      size="md"
      icon="material-symbols:edit-outline"
      type="button"
      variant="subtle"
      :to="`/application/${data.application_id}/response/edit/${data.id}`"
    />
    <UModal
      v-model:open="openDeleteModal"
      :title="`Delete the Response: ${data?.name}?`"
      :description="`Are you sure, this action cannot be undone.`"
    >
      <UButton
        v-if="hasPermissionTo('applicationResponse.delete')"
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
            @click="deleteResponse"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
