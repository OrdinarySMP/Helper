<script lang="ts" setup>
import { onMounted } from "vue";

const route = useRoute();

onMounted(async () => {
  const { error } = await useApi("/discord/callback", {
    method: "post",
    body: route.query,
  });

  if (!error.value) {
    return navigateTo("/");
  } else {
    return navigateTo("/login?noPermission");
  }
});

definePageMeta({
  layout: "guest",
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
