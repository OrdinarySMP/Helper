<script lang="ts" setup>
import { ref } from "vue";
const navigation = ref<{ name: string; href: string; icon: string }[]>([]);
</script>

<template>
  <footer class="bg-gray-900">
    <div
      class="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8"
    >
      <div class="flex justify-center space-x-6 md:order-2">
        <a
          v-for="item in navigation"
          :key="item.name"
          :href="item.href"
          class="text-gray-400 hover:text-gray-500"
        >
          <span class="sr-only">{{ item.name }}</span>
          <component :is="item.icon" class="size-6" aria-hidden="true" />
        </a>
      </div>
      <div class="mt-8 md:order-1 md:mt-0">
        <LayoutLogo />
      </div>
    </div>
  </footer>
</template>
