<script lang="ts" setup>
import { onMounted } from "vue";

useHead({
  title: "Logout",
});

onMounted(async () => {
  await useApi("/logout", { method: "post" });
  useAuth().logout();
  navigateTo("/login");
});
</script>

<template>
  <div class="flex h-full">
    Logging you out!
    <div class="flex grow items-center justify-center">
      <Spinner />
    </div>
  </div>
</template>
