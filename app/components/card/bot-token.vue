<script lang="ts" setup>
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

const copyBotToken = () => {
  if (botToken.value) {
    navigator.clipboard.writeText(botToken.value);
    toast.success("Copied bot token.");
  }
};
</script>

<template>
  <UCard variant="subtle">
    <template #header>
      <p>Bot token</p>
    </template>

    <p>Generate a new bot token.</p>

    <UAlert
      v-if="botToken"
      class="mt-2"
      variant="subtle"
      title="You bot token."
    >
      <template #description>
        <UTooltip :delay-duration="0" text="Click to copy">
          <p @click="copyBotToken">{{ botToken }}</p>
        </UTooltip>
      </template>
    </UAlert>

    <template #footer>
      <div class="flex justify-end">
        <UModal
          v-model:open="createTokenDialog"
          title="Create new bot token"
          description="Creating a new token will invalidate all prevoius tokens!"
        >
          <UButton label="Get bot token" variant="subtle" size="md" />
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
      </div>
    </template>
  </UCard>
</template>
