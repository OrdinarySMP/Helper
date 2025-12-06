<script lang="ts" setup>
import { ref } from "vue";

const route = useRoute();
const client = useApiClient();
const router = useRouter();
const toast = useSimpleToast();

const data = await client("/reaction-role", {
  method: "get",
  params: {
    "filter[id]": route.params.id,
  },
});
const serverContent = ref(data.data[0]);

const persited = () => {
  toast.success("Reaction role updated.");
  router.back();
};

const persistError = () => {
  toast.error("An error occoured while updating the Reaction role.");
};

definePageMeta({
  permission: {
    permission: "reactionRole.update",
  },
});

useHead({
  title: "Edit Reaction role",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Edit Reaction role" />
    </template>

    <template #body>
      <ReactionRoleForm
        v-model="serverContent"
        @persited="persited"
        @persist-error="persistError"
      />
    </template>
  </UDashboardPanel>
</template>
