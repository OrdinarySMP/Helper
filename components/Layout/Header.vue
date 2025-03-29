<script lang="ts" setup>
import { ref } from "vue";
import { Dialog, DialogPanel } from "@headlessui/vue";
import { Bars3Icon, XMarkIcon } from "@heroicons/vue/24/outline";

const mobileMenuOpen = ref(false);
</script>

<template>
  <header class="inset-x-0 top-0 bg-gradient-to-b from-orange-500 to-red-500">
    <nav
      class="flex items-center justify-between px-6 py-2.5 lg:px-8"
      aria-label="Global"
    >
      <div class="flex lg:flex-1">
        <LayoutLogo class="size-12" />
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
    </nav>
    <Dialog
      class="lg:hidden"
      :open="mobileMenuOpen"
      @close="mobileMenuOpen = false"
    >
      <DialogPanel
        class="flex flex-col fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-64 sm:ring-1 sm:ring-gray-900/10"
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
        <LayoutNavigation />
      </DialogPanel>
    </Dialog>
  </header>
</template>
