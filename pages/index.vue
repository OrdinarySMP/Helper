<script lang="ts" setup>
useHead({
  title: "Dashboard",
});
</script>

<template>
  <div>
    <p>Hello {{ useAuth().user().value?.nickname }}</p>
  </div>
</template>
