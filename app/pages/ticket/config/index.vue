<script lang="ts" setup>
const router = useRouter();
const toast = useSimpleToast();

const persited = () => {
  toast.success("Ticket config saved.");
  router.back();
};

const persistError = () => {
  toast.error("An error occoured while saving the Ticket config.");
};

definePageMeta({
  title: "Ticket Config",
  permission: {
    permission: "ticketConfig.read",
    fallback: "/ticket",
  },
});

useHead({
  title: "Ticket Config",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Ticket Config" />
    </template>

    <template #body>
      <TicketConfigForm @persited="persited" @persist-error="persistError" />
    </template>
  </UDashboardPanel>
</template>
