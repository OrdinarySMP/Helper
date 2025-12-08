<script lang="ts" setup>
import type { ApplicationQuestionData } from "@ordinary/api-types";

const client = useApiClient();
const openDeleteModal = ref(false);
const toast = useSimpleToast();

const props = defineProps<{
  data: ApplicationQuestionData;
}>();

const emit = defineEmits<{
  (e: "deleted"): void;
}>();

const deleteQuestion = async () => {
  try {
    await client(`/application-question/${props.data.id}`, {
      method: "delete",
    });
    toast.success("The Question was deleted.");
    emit("deleted");
  } catch {
    toast.error("An error occurred while deleting the Question.");
  } finally {
    openDeleteModal.value = false;
  }
};
</script>

<template>
  <div class="space-x-2">
    <UButton
      v-if="hasPermissionTo('applicationQuestion.update')"
      label="Edit"
      size="md"
      icon="material-symbols:edit-outline"
      type="button"
      variant="subtle"
      :to="`/application/${data.application_id}/question/edit/${data.id}`"
    />
    <UModal
      v-model:open="openDeleteModal"
      :title="`Delete the Question: ${data?.question}?`"
      :description="`Are you sure, this action cannot be undone.`"
    >
      <UButton
        v-if="hasPermissionTo('applicationQuestion.delete')"
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
            @click="deleteQuestion"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
