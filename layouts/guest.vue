<script lang="ts" setup>
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | Ordinary SMP` : "Ordinary SMP";
  },
});
</script>

<template>
  <div>
    <slot />
  </div>
</template>
