<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const user = useCurrentUser();

const items: NavigationMenuItem[] = [
  {
    label: "Home",
    icon: "i-lucide-house",
    to: "/",
  },
  {
    label: "FAQ",
    icon: "qlementine-icons:faq-16",
    to: "/faq",
    permission: "faq.read",
  },
  {
    label: "Rules",
    icon: "material-symbols:rule",
    to: "/rule",
    permission: "rule.read",
  },
  {
    label: "Tickets",
    icon: "famicons:ticket-outline",
    to: "/ticket",
    permission: "ticket.read",
    children: [
      {
        label: "Current tickets",
        to: "/ticket",
        permission: "ticket.read",
      },
      {
        label: "Config",
        to: "/ticket/config",
        permission: "ticketConfig.read",
      },
      {
        label: "Team",
        to: "/ticket/team",
        permission: "ticketTeam.read",
      },
      {
        label: "Panel",
        to: "/ticket/panel",
        permission: "ticketPanel.read",
      },
      {
        label: "Button",
        to: "/ticket/button",
        permission: "ticketButton.read",
      },
    ],
  },
  {
    label: "Mods + Datapacks",
    icon: "i-lucide-settings",
    to: "/server-content",
    permission: "serverContent.read",
  },
  {
    label: "Reaction roles",
    icon: "material-symbols:add-reaction-outline",
    to: "/reaction-role",
    permission: "reactionRole.read",
  },
  {
    label: "Applications",
    icon: "material-symbols:edit-square-outline",
    to: "/application",
    permission: "application.read",
    children: [
      {
        label: "Applications",
        to: "/application",
        permission: "application.read",
      },
      {
        label: "Submissions",
        to: "/application/submission",
        permission: "applicationSubmission.read",
      },
    ],
  },
  {
    label: "Permissions",
    icon: "icon-park-outline:permissions",
    to: "/permission",
    permission: "owner",
  },
];

const filteredItems = items
  .map((navigation) => {
    if (!navigation.children?.length) {
      return navigation;
    }
    navigation.children = navigation.children.filter((child) =>
      hasPermissionTo(child.permission),
    );
    return navigation;
  })
  .filter(
    (navigation) =>
      hasPermissionTo(navigation.permission) || navigation.children?.length,
  );

const footerItems: NavigationMenuItem[] = [];

useHead({
  titleTemplate: (title) => {
    return title ? `${title} | Ordinary SMP` : "Ordinary SMP";
  },
});
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar
      collapsible
      resizable
      :ui="{ footer: 'border-t border-default' }"
      :toggle="{
        color: 'primary',
        variant: 'subtle',
        class: 'rounded-full',
      }"
    >
      <template #header="{ collapsed }">
        <Logo v-if="!collapsed" class="shrink-0 mt-2" />
        <Logo v-else size="sm" class="size-8 shrink-0" />
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="filteredItems"
          orientation="vertical"
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="footerItems"
          orientation="vertical"
          class="mt-auto"
        />
      </template>

      <template #footer="{ collapsed }">
        <UButton
          :avatar="{
            src: user?.avatar,
          }"
          :label="collapsed ? undefined : (user?.nickname ?? undefined)"
          color="neutral"
          variant="ghost"
          class="w-full"
          :block="collapsed"
          to="/logout"
        />
      </template>
    </UDashboardSidebar>
    <UDashboardPanel>
      <template #header>
        <slot />
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
