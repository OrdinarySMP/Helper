<script lang="ts" setup>
import { ref } from "vue";

const user = useCurrentUser();
const client = useApiClient();
const toast = useSimpleToast();

const botToken = ref<string>();
const createTokenDialog = ref(false);

const getBotToken = async () => {
  const response = await client<{ token: string }>("/botToken");

  if (response) {
    botToken.value = response?.token;
  } else {
    toast.error("Failed to retrive bot token");
  }

  createTokenDialog.value = false;
};

useHead({
  title: "Dashboard",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Dashboard" />
    </template>

    <template #body>
      <p>Hello {{ user?.nickname }}</p>
      <UModal
        v-model:open="createTokenDialog"
        title="Create new bot token"
        description="Creating a new token will invalidate all prevoius tokens!"
      >
        <UButton
          v-if="hasPermissionTo('owner')"
          label="Get bot token"
          variant="subtle"
          size="md"
        />
        <template #body>
          <div class="flex justify-end gap-2">
            <UButton
              label="Cancel"
              color="neutral"
              variant="subtle"
              size="md"
              @click="createTokenDialog = false"
            />
            <UButton
              label="Generate"
              color="warning"
              size="md"
              @click="getBotToken"
            />
          </div>
        </template>
      </UModal>

      <p v-if="botToken">
        {{ botToken }}
      </p>
    </template>
  </UDashboardPanel>
</template>
