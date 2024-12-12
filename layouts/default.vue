<script lang="ts" setup>
const route = useRoute();

console.log(route.meta.title);
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | Ordinary SMP` : "Ordinary SMP";
  },
});
</script>
<template>
  <div class="flex min-h-screen flex-col">
    <LayoutHeader />
    <div class="flex grow px-12 py-6">
      <slot />
    </div>
    <Notification />
    <LayoutFooter />
  </div>
</template>
