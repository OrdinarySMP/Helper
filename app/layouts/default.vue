<script lang="ts" setup>
const showSidebar = ref(false);

const navigations = [
  { name: "FAQ", href: "/faq", permission: "faq.read" },
  { name: "Rules", href: "/rule", permission: "rule.read" },
  { name: "Tickets", href: "/ticket", permission: "ticket.read" },
  {
    name: "Mods+Datapacks",
    href: "/server-content",
    permission: "serverContent.read",
  },
  {
    name: "Reaction roles",
    href: "/reaction-role",
    permission: "reactionRole.read",
  },
  {
    name: "Applications",
    href: "/application",
    permission: "application.read",
  },
  { name: "Permissions", href: "/permission", permission: "owner" },
];

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | Ordinary SMP` : "Ordinary SMP";
  },
});
</script>
<template>
  <div class="flex min-h-screen">
    <div class="md:flex hidden w-48">
      <LayoutSidebar :show="showSidebar" :navigation="navigations" />
    </div>
    <div class="flex flex-col flex-1">
      <LayoutHeader class="md:hidden" />
      <div class="p-4">
        <slot />
      </div>
    </div>
    <Notification />
  </div>
</template>
