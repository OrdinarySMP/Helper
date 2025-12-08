<script lang="ts" setup>
import { ref } from "vue";

const route = useRoute();

const applicationId = computed(() => {
  const id = route.params.applicationId;
  if (!id) {
    return "";
  } else if (typeof id === "string") {
    return id;
  } else if (id[0]) {
    return id[0];
  } else {
    return "";
  }
});

const question = ref({
  application_id: parseInt(applicationId.value),
  is_active: true,
});
const router = useRouter();
const toast = useSimpleToast();

const persited = () => {
  toast.success("Question created.");
  router.back();
};

const persistError = () => {
  toast.error("An error occoured while creating the Question.");
};

definePageMeta({
  permission: {
    permission: "applicationQuestion.create",
    fallback: `/application`,
  },
});

useHead({
  title: "Create Application Question",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Create Application Question" />
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
