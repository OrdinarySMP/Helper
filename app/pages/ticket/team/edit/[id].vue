<script lang="ts" setup>
import { ref } from "vue";

const route = useRoute();
const client = useApiClient();
const router = useRouter();
const toast = useSimpleToast();

const data = await client("/ticket/team", {
  method: "get",
  params: {
    "filter[id]": route.params.id,
    include: "ticketTeamRoles",
  },
});
const rule = ref(data.data[0]);

const persited = () => {
  toast.success("Team updated.");
  router.back();
};

const persistError = () => {
  toast.error("An error occoured while updating the Team.");
};

definePageMeta({
  permission: {
    permission: "ticketTeam.update",
    fallback: "/ticket/team",
  },
});

useHead({
  title: "Edit Ticket Team",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Edit Ticket Team" />
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
