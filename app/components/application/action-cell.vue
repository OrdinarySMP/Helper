<script lang="ts" setup>
import type { ApplicationData } from "@ordinary/api-types";

const client = useApiClient();
const openDeleteModal = ref(false);
const toast = useSimpleToast();

const props = defineProps<{
  data: ApplicationData;
}>();

const emit = defineEmits<{
  (e: "deleted"): void;
}>();

const deleteApplication = async () => {
  try {
    await client(`/application/${props.data.id}`, {
      method: "delete",
    });
    toast.success("The Application was deleted.");
    emit("deleted");
  } catch {
    toast.error("An error occurred while deleting the Application.");
  } finally {
    openDeleteModal.value = false;
  }
};
</script>

<template>
  <div class="space-x-2">
    <UButton
      v-if="hasPermissionTo('application.update')"
      label="Edit"
      size="md"
      icon="material-symbols:edit-outline"
      type="button"
      variant="subtle"
      :to="`/application/edit/${data.id}`"
    />
    <UModal
      v-model:open="openDeleteModal"
      :title="`Delete the Application: ${data?.name}?`"
      :description="`Are you sure, this action cannot be undone.`"
    >
      <UButton
        v-if="hasPermissionTo('application.delete')"
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
            @click="deleteApplication"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
