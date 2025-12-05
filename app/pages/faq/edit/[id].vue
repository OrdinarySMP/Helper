<script lang="ts" setup>
import { ref } from "vue";

const route = useRoute();
const client = useApiClient();
const router = useRouter();
const toast = useSimpleToast();

const data = await client("/faq", {
  method: "get",
  params: {
    "filter[id]": route.params.id,
  },
});
const faq = ref(data.data[0]);

const persited = () => {
  toast.success("FAQ updated.");
  router.back();
};

const persistError = () => {
  toast.error("An error occoured while updating the FAQ.");
};

definePageMeta({
  permission: {
    permission: "faq.update",
    fallback: "/faq",
  },
});

useHead({
  title: "Edit FAQ",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Edit FAQ" />
    </template>

    <template #body>
      <FaqForm
        v-model="faq"
        @persited="persited"
        @persist-error="persistError"
      />
    </template>
  </UDashboardPanel>
</template>
