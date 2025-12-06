<script lang="ts" setup>
import { ref } from "vue";

const serverContent = ref({
  is_recommended: false,
  is_active: true,
});
const router = useRouter();
const toast = useSimpleToast();

const persited = () => {
  toast.success("Mod/Datapack created.");
  router.back();
};

const persistError = () => {
  toast.error("An error occoured while creating the Mod/Datapack.");
};

definePageMeta({
  permission: {
    permission: "serverContent.create",
    fallback: "/server-content",
  },
});

useHead({
  title: "Create Mod/Datapack",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Create Mod/Datapack" />
    </template>

    <template #body>
      <ServerContentForm
        v-model="serverContent"
        @persited="persited"
        @persist-error="persistError"
      />
    </template>
  </UDashboardPanel>
</template>
