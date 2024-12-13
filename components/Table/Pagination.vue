<script lang="ts" setup>
import { computed, ref } from "vue";
import type { Pagination } from "@/types/table";

const emit = defineEmits<{
  (e: "pageChange", page: number): void;
}>();

const props = defineProps<{ pagination: Pagination }>();

const currentClasses = ref(
  "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-not-allowed",
);
const defaultClasses = ref(
  "hover:bg-gray-50 text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-offset-0 cursor-pointer",
);
const spacerClasses = ref(
  "text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0 cursor-not-allowed",
);

const pages = computed(() => {
  if (props.pagination.totalPages > 9) {
    const numbers = [];
    if (props.pagination.currentPage <= 5) {
      for (let i = 1; i <= 7; i++) {
        numbers.push(i);
      }
      numbers.push("...");
      numbers.push(props.pagination.totalPages);
    } else if (
      props.pagination.currentPage >=
      props.pagination.totalPages - 4
    ) {
      numbers.push(1);
      numbers.push("...");
      for (
        let i = props.pagination.totalPages - 6;
        i <= props.pagination.totalPages;
        i++
      ) {
        numbers.push(i);
      }
    } else {
      numbers.push(1);
      numbers.push("...");
      for (
        let i = props.pagination.currentPage - 2;
        i <= props.pagination.currentPage + 2;
        i++
      ) {
        numbers.push(i);
      }
      numbers.push("...");
      numbers.push(props.pagination.totalPages);
    }
    return numbers;
  }
  return Array.from({ length: props.pagination.totalPages }, (_, i) => i + 1);
});

const getClasses = (page: number | string) => {
  if (typeof page === "string") {
    return spacerClasses.value;
  }
  if (page === props.pagination.currentPage) {
    return currentClasses.value;
  }
  return defaultClasses.value;
};

const pageClicked = (page: number | string) => {
  if (
    typeof page === "string" ||
    page === props.pagination.currentPage ||
    page < 1 ||
    page > props.pagination.totalPages
  ) {
    return;
  }

  emit("pageChange", page);
};
</script>

<template>
  <div
    class="flex items-center justify-between border-t border-gray-200 bg-white py-3"
  >
    <div class="flex flex-1 justify-between sm:hidden">
      <TButton
        class="relative px-4"
        size="md"
        background-color="bg-gray-300"
        text-color="black"
        type="button"
        @click="pageClicked(pagination.currentPage - 1)"
      >
        Previous
      </TButton>
      <TButton
        class="relative px-4"
        size="md"
        background-color="bg-gray-300"
        text-color="black"
        type="button"
        @click="pageClicked(pagination.currentPage + 1)"
      >
        Next
      </TButton>
    </div>
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          Showing
          {{ " " }}
          <span class="font-medium">{{ pagination.from }}</span>
          {{ " " }}
          to
          {{ " " }}
          <span class="font-medium">{{ pagination.to }}</span>
          {{ " " }}
          of
          {{ " " }}
          <span class="font-medium">{{ pagination.total }}</span>
          {{ " " }}
          results
        </p>
      </div>
      <div>
        <nav
          class="isolate inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          <div
            :class="
              pagination.currentPage === 1
                ? 'cursor-not-allowed'
                : 'hover:bg-gray-50 cursor-pointer'
            "
            class="relative inline-flex items-center rounded-l-md px-2 pb-2 pt-1 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0"
            @click="pageClicked(pagination.currentPage - 1)"
          >
            <span class="sr-only">Previous</span>
            <span class="size-5 text-center">&lt;</span>
          </div>

          <div
            v-for="(page, key) in pages"
            :key="key"
            class="relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20"
            :class="getClasses(page)"
            @click="pageClicked(page)"
          >
            {{ page }}
          </div>

          <div
            :class="
              pagination.currentPage === pagination.totalPages
                ? 'cursor-not-allowed'
                : 'hover:bg-gray-50 cursor-pointer'
            "
            class="relative inline-flex items-center rounded-r-md px-2 pb-2 pt-1 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0"
            @click="pageClicked(pagination.currentPage + 1)"
          >
            <span class="sr-only">Next</span>
            <span class="size-5 text-center">&gt;</span>
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>
