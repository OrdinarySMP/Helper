<script lang="ts" setup>
import { onMounted } from "vue";

const { logout } = useSanctumAuth()

useHead({
  title: "Logout",
});

onMounted(() => {
  logout()
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
