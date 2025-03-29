<script lang="ts" setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronRightIcon } from "@heroicons/vue/20/solid";
import type { Navigation, NavigationChild } from "@/types/navigation";

const route = useRoute();
const navigations = [
  { name: "FAQ", href: "/faq", permission: "faq.read" },
  {
    name: "Rules",
    href: "/rule",
    permission: "rule.read",
  },
  {
    name: "Tickets",
    href: "/ticket",
    permission: "ticket.read",
    children: [
      {
        name: "Current tickets",
        href: "/ticket",
        permission: "ticket.read",
      },
      {
        name: "Config",
        href: "/ticket/config",
        permission: "ticketConfig.read",
      },
      {
        name: "Button",
        href: "/ticket/button",
        permission: "ticketButton.read",
      },
      {
        name: "Panel",
        href: "/ticket/panel",
        permission: "ticketPanel.read",
      },
      {
        name: "Team",
        href: "/ticket/team",
        permission: "ticketTeam.read",
      },
    ],
  },
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
    children: [
      {
        name: "Applications",
        href: "/application",
        permission: "application.read",
      },
      {
        name: "Submissions",
        href: "/application/submission",
        permission: "applicationSubmission.read",
      },
    ],
  },
  { name: "Permissions", href: "/permission", permission: "owner" },
];

const userNavigation = navigations
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

const isCurrent = (item: Navigation | NavigationChild) => {
  if (item?.children) {
    return !!item.children.find((child) => child.href === route.fullPath);
  }
  return route.fullPath === item.href;
};
</script>

<template>
  <ul role="list" class="flex flex-1 flex-col gap-y-7">
    <li>
      <ul role="list" class="-mx-2 space-y-1">
        <li v-for="item in userNavigation" :key="item.name">
          <NuxtLink
            v-if="!item.children"
            :to="item.href"
            :class="[
              isCurrent(item) ? 'bg-gray-50' : 'hover:bg-gray-50',
              'block rounded-md py-2 pl-8 pr-2 text-sm/6 font-semibold text-gray-700',
            ]"
          >
            {{ item.name }}
          </NuxtLink>
          <Disclosure
            v-else
            v-slot="{ open }"
            :default-open="isCurrent(item)"
            as="div"
          >
            <DisclosureButton
              :class="[
                isCurrent(item) ? 'bg-gray-50' : 'hover:bg-gray-50',
                'flex w-full items-center gap-x-2 rounded-md p-2 text-left text-sm/6 font-semibold text-gray-700',
              ]"
            >
              <ChevronRightIcon
                :class="[
                  open ? 'rotate-90 text-gray-500' : 'text-gray-400',
                  'size-5 shrink-0',
                ]"
                aria-hidden="true"
              />
              {{ item.name }}
            </DisclosureButton>
            <DisclosurePanel as="ul" class="mt-1 px-2">
              <li v-for="child in item.children" :key="child.name">
                <NuxtLink
                  :to="child.href"
                  :class="[
                    isCurrent(child) ? 'bg-gray-50' : 'hover:bg-gray-50',
                    'block rounded-md py-2 pl-9 pr-2 text-sm/6 text-gray-700',
                  ]"
                  >{{ child.name }}</NuxtLink
                >
              </li>
            </DisclosurePanel>
          </Disclosure>
        </li>
      </ul>
    </li>
    <li class="-mx-2 mt-auto">
      <a
        href="/logout"
        class="flex items-center gap-x-4 py-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-50 justify-center"
      >
        <img
          class="size-8 rounded-full bg-gray-50"
          :src="useAuth().user().value?.avatar"
          alt=""
        />
        <span class="sr-only">Your profile</span>
        <span aria-hidden="true">{{ useAuth().user().value?.nickname }}</span>
      </a>
    </li>
  </ul>
</template>
