<script lang="ts" setup>
import { ref } from "vue";

const route = useRoute();
const client = useApiClient();
const router = useRouter();
const toast = useSimpleToast();

const data = await client("/application", {
  method: "get",
  params: {
    "filter[id]": route.params.id,
  },
});
const application = ref(data.data[0]);

const persited = () => {
  toast.success("FAQ updated.");
  router.back();
};

const persistError = () => {
  toast.error("An error occoured while updating the FAQ.");
};

definePageMeta({
  permission: {
    permission: "application.update",
    fallback: "/application",
  },
});

useHead({
  title: "Edit Application",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Edit Application" />
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
