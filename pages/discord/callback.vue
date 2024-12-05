<script lang="ts" setup>
import { ref, onMounted, computed } from "vue"

const route = useRoute();

onMounted(async () => {
  console.log(route.query)
  const { error } = await useApi("/discord/callback", {
    method: "post",
    body: route.query,
  });
  console.log(error)

  // if (!error.value) {
  //   navigateTo("/");
  // } else {
  //   navigateTo("/login");
  // }
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
