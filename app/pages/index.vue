<script lang="ts" setup>
const user = useCurrentUser();
useHead({
  title: "Dashboard",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Dashboard" />
    </template>

    <template #body>
      <p class="text-2xl">Hello {{ user?.nickname }}</p>
      <div class="columns-1 md:columns-2 gap-4 space-y-4">
        <CardApplication />
        <CardTicket />
        <CardBotToken />
      </div>
    </template>
  </UDashboardPanel>
</template>
