<script lang="ts" setup>
import type { ApplicationSubmissionData } from "@ordinary/api-types";

const client = useApiClient();
const openDeleteModal = ref(false);
const toast = useSimpleToast();

const props = defineProps<{
  data: ApplicationSubmissionData;
}>();

const emit = defineEmits<{
  (e: "deleted"): void;
}>();

const deleteSubmission = async () => {
  try {
    await client(`/application-submission/${props.data.id}`, {
      method: "delete",
    });
    toast.success("The Submission was deleted.");
    emit("deleted");
  } catch {
    toast.error("An error occurred while deleting the Submission.");
  } finally {
    openDeleteModal.value = false;
  }
};
</script>

<template>
  <div class="space-x-2">
    <UButton
      v-if="hasPermissionTo('applicationSubmission.read')"
      label="View"
      size="md"
      icon="material-symbols:search-rounded"
      type="button"
      variant="subtle"
      :to="`/application/submission/view/${data.id}`"
    />
    <UModal
      v-model:open="openDeleteModal"
      :title="`Delete the Submission: ${data?.id}?`"
      :description="`Are you sure, this action cannot be undone. The Submission will be deleted the user will NOT receive a response.`"
    >
      <UButton
        v-if="hasPermissionTo('faq.delete')"
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
            @click="deleteSubmission"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
