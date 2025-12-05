<script lang="ts" setup>
import type { FaqData } from "@ordinary/api-types";

const client = useApiClient();
const openDeleteModal = ref(false);
const toast = useSimpleToast();

const props = defineProps<{
  data: FaqData;
}>();

const emit = defineEmits<{
  (e: "deleted"): void;
}>();

const deleteFaq = async () => {
  try {
    await client(`/faq/${props.data.id}`, {
      method: "delete",
    });
    toast.success("The FAQ was deleted.");
    emit("deleted");
  } catch {
    toast.error("An error occurred while deleting the FAQ.");
  } finally {
    openDeleteModal.value = false;
  }
};
</script>

<template>
  <div class="space-x-2">
    <UButton
      v-if="hasPermissionTo('faq.update')"
      label="Edit"
      size="md"
      icon="material-symbols:edit-outline"
      type="button"
      variant="subtle"
      :to="`/faq/edit/${data.id}`"
    />
    <UModal
      v-model:open="openDeleteModal"
      :title="`Delete the FAQ: ${data?.question}?`"
      :description="`Are you sure, this action cannot be undone.`"
    >
      <UButton
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
          <UButton label="Delete" color="error" size="md" @click="deleteFaq" />
        </div>
      </template>
    </UModal>
  </div>
</template>
