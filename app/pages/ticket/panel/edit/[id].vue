<script lang="ts" setup>
import { ref } from "vue";

const route = useRoute();
const client = useApiClient();
const router = useRouter();
const toast = useSimpleToast();

const data = await client("/ticket/panel", {
  method: "get",
  params: {
    "filter[id]": route.params.id,
  },
});
const rule = ref(data.data[0]);

const persited = () => {
  toast.success("Panel updated.");
  router.back();
};

const persistError = () => {
  toast.error("An error occoured while updating the Panel.");
};

definePageMeta({
  permission: {
    permission: "ticketPanel.update",
    fallback: "/ticket/panel",
  },
});

useHead({
  title: "Edit Ticket Panel",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Edit Ticket Panel" />
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
