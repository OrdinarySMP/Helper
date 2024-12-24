<script lang="ts" setup>
import { ref } from "vue";
import { Dialog, DialogPanel } from "@headlessui/vue";
import { Bars3Icon, XMarkIcon } from "@heroicons/vue/24/outline";

const navigation = [
  { name: "FAQ", href: "/faq" },
  { name: "Rules", href: "/rule" },
  { name: "Reaction roles", href: "/reaction-role" },
  { name: "Applications", href: "/application" },
];

const userMenuOpen = ref(false);
const mobileMenuOpen = ref(false);

const select = (path: string) => {
  navigateTo(path);
  userMenuOpen.value = false;
};

const userMenu = ref([
  { label: "Profile", value: "/profile" },
  { label: "log out", value: "logout" },
]);
</script>

<template>
  <header class="inset-x-0 top-0 bg-gradient-to-b from-orange-500 to-red-500">
    <nav
      class="flex items-center justify-between px-6 py-2.5 lg:px-8"
      aria-label="Global"
    >
      <div class="flex lg:flex-1">
        <LayoutLogo />
      </div>
      <div class="flex lg:hidden">
        <button
          type="button"
          class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-800"
          @click="mobileMenuOpen = true"
        >
          <span class="sr-only">Open main menu</span>
          <Bars3Icon class="size-6" aria-hidden="true" />
        </button>
      </div>
      <div class="hidden lg:flex lg:gap-x-12">
        <NuxtLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          class="text- text-sm font-semibold leading-6"
          >{{ item.name }}</NuxtLink
        >
      </div>
      <div class="hidden lg:flex lg:flex-1 lg:justify-end relative">
        <img
          :src="useAuth().user().value?.avatar"
          class="size-10 rounded-full cursor-pointer"
          @click="userMenuOpen = !userMenuOpen"
        >

        <Dropdown
          class="user-menu right-0 top-full mt-2 !w-[fit-content]"
          :show="userMenuOpen"
          :items="userMenu"
          @select="select(`${$event}`)"
        >
          <template #default="{ data }">
            <span class="whitespace-nowrap">
              {{ data.label }}
            </span>
          </template>
        </Dropdown>
      </div>
    </nav>
    <Dialog
      class="lg:hidden"
      :open="mobileMenuOpen"
      @close="mobileMenuOpen = false"
    >
      <div class="fixed inset-0 z-50" />
      <DialogPanel
        class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
      >
        <div class="flex items-center justify-between">
          <LayoutLogo />
          <button
            type="button"
            class="-m-2.5 rounded-md p-2.5 text-gray-700"
            @click="mobileMenuOpen = false"
          >
            <span class="sr-only">Close menu</span>
            <XMarkIcon class="size-6" aria-hidden="true" />
          </button>
        </div>
        <div class="mt-6 flow-root">
          <div class="-my-6 divide-y divide-gray-500/10">
            <div class="space-y-2 py-6">
              <NuxtLink
                v-for="item in navigation"
                :key="item.name"
                :to="item.href"
                class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                @click="mobileMenuOpen = false"
                >{{ item.name }}</NuxtLink
              >
            </div>
            <div class="py-6">
              <a
                href="#"
                class="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >Profile</a
              >
              <a
                href="#"
                class="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >Log out</a
              >
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  </header>
</template>
