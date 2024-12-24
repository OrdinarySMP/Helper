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
  <div class="cursor-pointer" @click="navigateTo(route)">
    <span class="sr-only">Ordinary SMP</span>
    <img :src="image[size]" alt="Ordinary SMP" />
  </div>
</template>
