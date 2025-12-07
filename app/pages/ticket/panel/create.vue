<script lang="ts" setup>
import { ref } from "vue";

const rule = ref({});
const router = useRouter();
const toast = useSimpleToast();

const persited = () => {
  toast.success("Panel created.");
  router.back();
};

const persistError = () => {
  toast.error("An error occoured while creating the Panel.");
};

definePageMeta({
  permission: {
    permission: "ticketPanel.create",
    fallback: "/ticket/panel",
  },
});

useHead({
  title: "Create Ticket Panel",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Create Ticket Panel" />
    </template>

    <template #body>
      <TicketPanelForm
        v-model="rule"
        @persited="persited"
        @persist-error="persistError"
      />
    </template>
  </UDashboardPanel>
</template>
