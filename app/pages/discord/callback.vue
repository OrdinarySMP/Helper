<script lang="ts" setup>
import { onMounted } from "vue";

const route = useRoute();
const { refreshIdentity } = useSanctumAuth();
const value = ref(null);

onMounted(async () => {
  const { error } = await useApi("/discord/callback", {
    method: "post",
    body: route.query,
  });

  if (!error.value) {
    const returnUrl = localStorage.getItem("return");
    localStorage.removeItem("return");
    await refreshIdentity();
    return navigateTo(returnUrl ?? "/");
  } else {
    return navigateTo("/login?noPermission");
  }
});

definePageMeta({
  layout: "guest",
  sanctum: {
    guestOnly: true,
  },
});
</script>

<template>
  <div
    class="mt-12 flex flex-col items-center justify-center gap-4 p-4 text-2xl"
  >
    <p>Signing you in with Discord.</p>
    <p>This may take a few seconds...</p>
    <UProgress v-model="value" size="sm" />
  </div>
</template>
