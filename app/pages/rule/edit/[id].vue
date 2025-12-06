<script lang="ts" setup>
import { ref } from "vue";

const route = useRoute();
const client = useApiClient();
const router = useRouter();
const toast = useSimpleToast();

const data = await client("/rule", {
  method: "get",
  params: {
    "filter[id]": route.params.id,
  },
});
const rule = ref(data.data[0]);

const persited = () => {
  toast.success("Rule updated.");
  router.back();
};

const persistError = () => {
  toast.error("An error occoured while updating the Rule.");
};

definePageMeta({
  permission: {
    permission: "rule.update",
    fallback: "/rule",
  },
});

useHead({
  title: "Edit Rule",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Edit Rule" />
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
