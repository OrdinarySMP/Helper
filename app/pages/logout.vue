<script lang="ts" setup>
const { logout } = useSanctumAuth();
await logout();

useHead({
  title: "Logout",
});
</script>

<template>
  <div class="flex h-full">Logging you out!</div>
</template>
