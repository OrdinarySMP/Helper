<script lang="ts" setup>
import { ref } from "vue";

const application = ref({
  is_active: false,
});
const router = useRouter();
const toast = useSimpleToast();

const persited = () => {
  toast.success("Application created.");
  router.back();
};

const persistError = () => {
  toast.error("An error occoured while creating the Application.");
};

definePageMeta({
  permission: {
    permission: "application.create",
    fallback: "/application",
  },
});

useHead({
  title: "Create Application",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Create Application" />
    </template>

    <template #body>
      <ApplicationForm
        v-model="application"
        @persited="persited"
        @persist-error="persistError"
      />
    </template>
  </UDashboardPanel>
</template>
