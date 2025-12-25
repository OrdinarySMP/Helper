<script lang="ts" setup>
import { ref } from "vue";

const application = ref({
  is_active: true,
  confirmation_message:
    "Are you sure you want to apply?\n\nOnce you start the application I will send you a series of questions. You will have 10 minutes to complete each question. If you do not complete a question in time, you will have to restart.",
  completion_message:
    "Thank you for submitting your application.\n\nPlease be patient while our staff team reviews your application.",
  embed_color: "#f0833a",
  embed_button_color: 1,
  embed_button_text: "Apply now",
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
