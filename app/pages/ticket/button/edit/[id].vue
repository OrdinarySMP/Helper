<script lang="ts" setup>
import { ref } from "vue";

const route = useRoute();
const client = useApiClient();
const router = useRouter();
const toast = useSimpleToast();

const data = await client("/ticket/button", {
  method: "get",
  params: {
    "filter[id]": route.params.id,
    include: "ticketButtonPingRoles",
  },
});
const rule = ref(data.data[0]);

const persited = () => {
  toast.success("Button updated.");
  router.back();
};

const persistError = () => {
  toast.error("An error occoured while updating the Button.");
};

definePageMeta({
  permission: {
    permission: "ticketButton.update",
    fallback: "/ticket/button",
  },
});

useHead({
  title: "Edit Ticket Button",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Edit Ticket Button" />
    </template>

    <template #body>
      <TicketButtonForm
        v-model="rule"
        @persited="persited"
        @persist-error="persistError"
      />
    </template>
  </UDashboardPanel>
</template>
