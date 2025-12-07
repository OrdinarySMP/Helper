<script lang="ts" setup>
import { ref } from "vue";

const button = ref({
  disabled: false,
});
const router = useRouter();
const toast = useSimpleToast();

const persited = () => {
  toast.success("Button created.");
  router.back();
};

const persistError = () => {
  toast.error("An error occoured while creating the Button.");
};

definePageMeta({
  permission: {
    permission: "ticketButton.create",
    fallback: "/ticket/button",
  },
});

useHead({
  title: "Create Ticket Button",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Create Ticket Button" />
    </template>

    <template #body>
      <TicketButtonForm
        v-model="button"
        @persited="persited"
        @persist-error="persistError"
      />
    </template>
  </UDashboardPanel>
</template>
