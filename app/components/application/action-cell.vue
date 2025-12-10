<script lang="ts" setup>
import type { ApplicationData } from "@OrdinarySMP/api-types";

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

const sendButton = async () => {
  if (
    !props.data?.embed_channel_id ||
    !props.data?.embed_title ||
    !props.data?.embed_color ||
    !props.data?.embed_description
  ) {
    toast.error("Please fill all embed fields before sending the button.");
    return;
  }
  const response = await client(`/application/${props.data.id}/send-button`);

  if (response) {
    toast.success("The button was send.");
  } else {
    toast.error("An error occoured while sending the button.");
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
    <UButton
      v-if="hasPermissionTo('applicationQuestion.read')"
      label="Questions"
      size="md"
      icon="material-symbols:contact-support-outline"
      type="button"
      variant="subtle"
      :to="`/application/${data.id}/question`"
    />
    <UButton
      v-if="hasPermissionTo('applicationResponse.read')"
      label="Responses"
      size="md"
      icon="material-symbols:send-outline"
      type="button"
      variant="subtle"
      :to="`/application/${data.id}/response`"
    />
    <UButton
      v-if="hasPermissionTo('application.update')"
      label="Send button"
      size="md"
      icon="material-symbols:send-outline"
      type="button"
      variant="subtle"
      color="neutral"
      @click="sendButton"
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
