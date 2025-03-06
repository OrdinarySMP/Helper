<script lang="ts" setup>
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
  </div>
</template>
