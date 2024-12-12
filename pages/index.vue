<script lang="ts" setup>
const config = useRuntimeConfig()
useHead({
  title: "Dashboard",
});
</script>

<template>
  <div>
    <p>Hello {{ useAuth().user().value?.nickname }}</p>
    {{ config.public.apiBase ?? "---" }}
  </div>
</template>
