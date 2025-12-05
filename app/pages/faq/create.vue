<script lang="ts" setup>
import { ref } from "vue";

const faq = ref({});
const router = useRouter();
const toast = useSimpleToast();

const persited = () => {
  toast.success("FAQ created.");
  router.back();
};

const persistError = () => {
  toast.error("An error occoured while creating the FAQ.");
};

definePageMeta({
  permission: {
    permission: "faq.create",
    fallback: "/faq",
  },
});

useHead({
  title: "Create FAQ",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Create FAQ" />
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
