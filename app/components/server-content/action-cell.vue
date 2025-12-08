<script lang="ts" setup>
import type { ServerContentData } from "@OrdinarySMP/api-types";

const client = useApiClient();
const openDeleteModal = ref(false);
const toast = useSimpleToast();

const props = defineProps<{
  data: ServerContentData;
}>();

const emit = defineEmits<{
  (e: "deleted"): void;
}>();

const deleteServerContent = async () => {
  try {
    await client(`/server-content/${props.data.id}`, {
      method: "delete",
    });
    toast.success("The Mod/Datapack was deleted.");
    emit("deleted");
  } catch {
    toast.error("An error occurred while deleting the Mod/Datapack.");
  } finally {
    openDeleteModal.value = false;
  }
};
</script>

<template>
  <div class="space-x-2">
    <UButton
      v-if="hasPermissionTo('serverContent.update')"
      label="Edit"
      size="md"
      icon="material-symbols:edit-outline"
      type="button"
      variant="subtle"
      :to="`/server-content/edit/${data.id}`"
    />
    <UModal
      v-model:open="openDeleteModal"
      :title="`Delete the Mod/Datapack: ${data.name}?`"
      :description="`Are you sure, this action cannot be undone.`"
    >
      <UButton
        v-if="hasPermissionTo('serverContent.delete')"
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
            @click="deleteServerContent"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
