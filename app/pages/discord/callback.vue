<script lang="ts" setup>
import { onMounted } from "vue";

const route = useRoute();
const { refreshIdentity } = useSanctumAuth();

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
  <div class="flex h-full">
    Logging in
    <div class="flex grow items-center justify-center">
      <Spinner />
    </div>
  </div>
</template>
