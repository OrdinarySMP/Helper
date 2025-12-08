<script lang="ts" setup>
import type { ReactionRoleData } from "@OrdinarySMP/api-types";

const client = useApiClient();
const openDeleteModal = ref(false);
const toast = useSimpleToast();

const props = defineProps<{
  data: ReactionRoleData;
}>();

const emit = defineEmits<{
  (e: "deleted"): void;
}>();

const deleteReactionRole = async () => {
  try {
    await client(`/reaction-role/${props.data.id}`, {
      method: "delete",
    });
    toast.success("The Reaction role was deleted.");
    emit("deleted");
  } catch {
    toast.error("An error occurred while deleting the Reaction role.");
  } finally {
    openDeleteModal.value = false;
  }
};
</script>

<template>
  <div class="space-x-2">
    <UButton
      v-if="hasPermissionTo('reactionRole.update')"
      label="Edit"
      size="md"
      icon="material-symbols:edit-outline"
      type="button"
      variant="subtle"
      :to="`/reaction-role/edit/${data.id}`"
    />
    <UModal
      v-model:open="openDeleteModal"
      :title="`Delete the Reaction role: ${data.emoji}?`"
      :description="`Are you sure, this action cannot be undone.`"
    >
      <UButton
        v-if="hasPermissionTo('reactionRole.delete')"
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
            @click="deleteReactionRole"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
