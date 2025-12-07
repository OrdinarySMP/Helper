<script lang="ts" setup>
import { ref } from "vue";

const rule = ref({});
const router = useRouter();
const toast = useSimpleToast();

const persited = () => {
  toast.success("Team created.");
  router.back();
};

const persistError = () => {
  toast.error("An error occoured while creating the Team.");
};

definePageMeta({
  permission: {
    permission: "ticketTeam.create",
    fallback: "/ticket/team",
  },
});

useHead({
  title: "Create Ticket Team",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Create Ticket Team" />
    </template>

    <template #body>
      <TicketTeamForm
        v-model="rule"
        @persited="persited"
        @persist-error="persistError"
      />
    </template>
  </UDashboardPanel>
</template>
