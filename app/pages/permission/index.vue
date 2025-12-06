<script lang="ts" setup>
const toast = useSimpleToast();

const persited = () => {
  toast.success("Permissions saved.");
};

const persistError = () => {
  toast.error("An error occoured while saving the Permissions.");
};

definePageMeta({
  permission: {
    permission: "owner",
  },
});

useHead({
  title: "Permissions",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Permissions" />
    </template>

    <template #body>
      <PermissionForm @persited="persited" @persist-error="persistError" />
    </template>
  </UDashboardPanel>
</template>
