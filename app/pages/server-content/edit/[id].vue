<script lang="ts" setup>
import { ref } from "vue";

const route = useRoute();
const client = useApiClient();
const router = useRouter();
const toast = useSimpleToast();

const data = await client("/server-content", {
  method: "get",
  params: {
    "filter[id]": route.params.id,
  },
});
const serverContent = ref(data.data[0]);

const persited = () => {
  toast.success("Mod/Datapack updated.");
  router.back();
};

const persistError = () => {
  toast.error("An error occoured while updating the Mod/Datapack.");
};

definePageMeta({
  permission: {
    permission: "serverContent.update",
    fallback: "/server-content",
  },
});

useHead({
  title: "Edit Mod/Datapack",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Edit Mod/Datapack" />
    </template>

    <template #body>
      <ServerContentForm
        v-model="serverContent"
        @persited="persited"
        @persist-error="persistError"
      />
    </template>
  </UDashboardPanel>
</template>
