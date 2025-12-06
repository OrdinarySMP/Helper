<script lang="ts" setup>
import { ref } from "vue";

const rule = ref({});
const router = useRouter();
const toast = useSimpleToast();

const persited = () => {
  toast.success("Rule created.");
  router.back();
};

const persistError = () => {
  toast.error("An error occoured while creating the Rule.");
};

definePageMeta({
  permission: {
    permission: "rule.create",
    fallback: "/rule",
  },
});

useHead({
  title: "Create Rule",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Create Rule" />
    </template>

    <template #body>
      <RuleForm
        v-model="rule"
        @persited="persited"
        @persist-error="persistError"
      />
    </template>
  </UDashboardPanel>
</template>
