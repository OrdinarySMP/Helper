<script lang="ts" setup>
import { ref } from "vue";

const user = useCurrentUser();

const botToken = ref<string>();
const createTokenDialog = ref(false);

const getBotToken = async () => {
  const { data, error } = await useApi<{ token: string }>("/botToken", {
    method: "get",
  });

  if (error.value) {
    useNotification().error(
      "Failed to retrive bot token",
      error.value.data.message,
    );
  } else {
    botToken.value = data.value?.token;
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
      <Button
        v-if="user?.is_owner"
        class="px-2"
        size="md"
        @click="createTokenDialog = true"
      >
        Get bot token
      </Button>
      <p v-if="botToken">
        {{ botToken }}
      </p>

      <Dialog v-if="createTokenDialog" @close="createTokenDialog = false">
        <template #title>
          <p>Create new bot token</p>
        </template>
        <template #body>
          <p
            class="rounded border border-red-400 bg-red-200 px-4 py-2 text-red-600"
          >
            Creating a new token will invalidate all prevoius tokens!
          </p>
        </template>
        <template #footer>
          <Button class="ml-4 px-4" size="sm" @click="getBotToken">
            Generate
          </Button>
          <Button
            class="px-4"
            color="gray"
            size="sm"
            @click="createTokenDialog = false"
          >
            Cancel
          </Button>
        </template>
      </Dialog>
    </template>
  </UDashboardPanel>
</template>
