<script lang="ts" setup>
const toast = useSimpleToast();

const persited = async () => {
  toast.success("Profile updated.");
};

const persistError = () => {
  toast.error("An error occoured while updating the Profile.");
};

useHead({
  title: "Profile",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Profile" />
    </template>

    <template #body>
      <ProfileForm @persited="persited" @persited-error="persistError" />
    </template>
  </UDashboardPanel>
</template>
