<script lang="ts" setup>
import { ref } from "vue";

const route = useRoute();
const client = useApiClient();
const router = useRouter();
const toast = useSimpleToast();

const data = await client("/application-question", {
  method: "get",
  params: {
    "filter[id]": route.params.id,
  },
});
const question = ref(data.data[0]);

const persited = () => {
  toast.success("Question updated.");
  router.back();
};

const persistError = () => {
  toast.error("An error occoured while updating the Question.");
};

definePageMeta({
  permission: {
    permission: "applicationQuestion.update",
    fallback: `/application`,
  },
});

useHead({
  title: "Edit Application Question",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Edit Application Question" />
    </template>

    <template #body>
      <ApplicationQuestionForm
        v-model="question"
        @persited="persited"
        @persist-error="persistError"
      />
    </template>
  </UDashboardPanel>
</template>
