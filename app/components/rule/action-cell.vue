<script lang="ts" setup>
import type { RuleData } from "@OrdinarySMP/api-types";

const client = useApiClient();
const openDeleteModal = ref(false);
const toast = useSimpleToast();

const props = defineProps<{
  data: RuleData;
}>();

const emit = defineEmits<{
  (e: "deleted"): void;
}>();

const deleteRule = async () => {
  try {
    await client(`/rule/${props.data.id}`, {
      method: "delete",
    });
    toast.success("The Rule was deleted.");
    emit("deleted");
  } catch {
    toast.error("An error occurred while deleting the Rule.");
  } finally {
    openDeleteModal.value = false;
  }
};
</script>

<template>
  <div class="space-x-2">
    <UButton
      v-if="hasPermissionTo('rule.update')"
      label="Edit"
      size="md"
      icon="material-symbols:edit-outline"
      type="button"
      variant="subtle"
      :to="`/rule/edit/${data.id}`"
    />
    <UModal
      v-model:open="openDeleteModal"
      :title="`Delete the Rule: ${data?.name}?`"
      :description="`Are you sure, this action cannot be undone.`"
    >
      <UButton
        v-if="hasPermissionTo('rule.delete')"
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
          <UButton label="Delete" color="error" size="md" @click="deleteRule" />
        </div>
      </template>
    </UModal>
  </div>
</template>
