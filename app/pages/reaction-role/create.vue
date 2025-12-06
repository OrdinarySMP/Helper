<script lang="ts" setup>
import { ref } from "vue";

const reactionRole = ref({});
const router = useRouter();
const toast = useSimpleToast();

const persited = () => {
  toast.success("Reaction role created.");
  router.back();
};

const persistError = () => {
  toast.error("An error occoured while creating the Reaction role.");
};

definePageMeta({
  permission: {
    permission: "reactionRole.create",
  },
});

useHead({
  title: "Create Reaction role",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Create Reaction role" />
    </template>

    <template #body>
      <ReactionRoleForm
        v-model="reactionRole"
        @persited="persited"
        @persist-error="persistError"
      />
    </template>
  </UDashboardPanel>
</template>
