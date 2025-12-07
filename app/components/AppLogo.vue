<script lang="ts" setup>
import sm from "~/assets/logo-small.png";
import md from "~/assets/logo.png";
withDefaults(defineProps<{ size?: "md" | "sm"; route?: string }>(), {
  route: "/",
  size: "sm",
});

const image = {
  sm,
  md,
};
</script>

<template>
  <NuxtLink :to="route">
    <span class="sr-only">Ordinary SMP</span>
    <img :src="image[size]" alt="Ordinary SMP" >
  </NuxtLink>
</template>
