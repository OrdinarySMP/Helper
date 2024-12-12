<script lang="ts" setup>
import { XMarkIcon } from "@heroicons/vue/24/solid";
</script>
<template>
  <div
    aria-live="assertive"
    class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
  >
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <transition
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="Object.keys(useNotification().notifications.value).length"
          class="w-full max-w-sm"
        >
          <div
            v-for="(notification, key) in useNotification().notifications.value"
            :key="key"
            class="mb-4 w-full max-w-sm"
          >
            <div
              v-if="notification?.title && notification?.content"
              class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5"
            >
              <div class="p-4">
                <div class="flex items-start">
                  <div>
                    <p
                      v-if="notification.type === 'success'"
                      icon="circle-check"
                      class="text-2xl text-green-500"
                    />
                    <p v-else icon="x" class="text-2xl text-red-500" />
                  </div>
                  <div class="ml-3 w-0 flex-1 pt-0.5">
                    <p class="text-sm font-medium text-gray-900">
                      {{ notification.title }}
                    </p>
                    <p class="mt-1 text-sm text-gray-500">
                      {{ notification.content }}
                    </p>
                  </div>
                  <div class="ml-4 flex shrink-0">
                    <button
                      type="button"
                      class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      @click="useNotification().dissmiss(key)"
                    >
                      <span class="sr-only">Close</span>
                      <XMarkIcon class="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
