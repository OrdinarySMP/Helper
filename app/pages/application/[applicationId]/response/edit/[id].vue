<script lang="ts" setup>
import { ref } from "vue";

const route = useRoute();
const client = useApiClient();
const router = useRouter();
const toast = useSimpleToast();

const data = await client("/application-response", {
  method: "get",
  params: {
    "filter[id]": route.params.id,
  },
});
const response = ref(data.data[0]);

const persited = () => {
  toast.success("Response updated.");
  router.back();
};

const persistError = () => {
  toast.error("An error occoured while updating the Response.");
};

definePageMeta({
  permission: {
    permission: "applicationResponse.update",
    fallback: `/application`,
  },
});

useHead({
  title: "Edit Application Response",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Edit Application Response" />
    </template>

    <template #body>
      <ApplicationResponseForm
        v-model="response"
        @persited="persited"
        @persist-error="persistError"
      />
    </template>
  </UDashboardPanel>
</template>
