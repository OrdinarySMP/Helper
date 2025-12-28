<script lang="ts" setup>
import { ref } from "vue";

const router = useRouter();
const client = useApiClient();
const toast = useSimpleToast();

const data = await client("/server-content-message");
const serverContentMessage = ref(data !== "" ? data : {});

const persited = () => {
  toast.success("Mods + Datapacks Messages updated.");
  router.back();
};

const persistError = () => {
  toast.error(
    "An error occoured while updating the Mods + Datapacks Messages.",
  );
};
const canCreate = computed(() =>
  hasPermissionTo("serverContentMessage.create"),
);

definePageMeta({
  permission: {
    permission: "serverContentMessage.read",
    fallback: "/server-content",
  },
});

useHead({
  title: "Mods + Datapacks Messages",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Mods + Datapacks Messages" />
    </template>

    <template #body>
      <ServerContentMessageForm
        v-model="serverContentMessage"
        :can-create="canCreate"
        @persited="persited"
        @persist-error="persistError"
      />
    </template>
  </UDashboardPanel>
</template>
