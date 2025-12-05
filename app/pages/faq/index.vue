<script lang="ts" setup>
import { ref } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { FaqData } from "@ordinary/api-types";
import type { PaginatedResponse } from "@/types/response";

const page = ref(1);
const { data, status, refresh } = await useApi<PaginatedResponse<FaqData[]>>(
  "/faq",
  {
    method: "get",
    query: {
      page_size: 15,
      page,
    },
    watch: [page],
  },
);
const totalItems = computed(() => data.value?.meta.total ?? 0);
const perPage = computed(() => data.value?.meta.per_page ?? 0);

const columns: TableColumn<FaqData>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "question",
    header: "Questions",
  },
  {
    id: "actions",
    cell: ({ row }) =>
      h(resolveComponent("FaqActionCell"), {
        data: row.original,
        onDeleted: refresh,
      }),
  },
];

definePageMeta({
  permission: {
    permission: "faq.read",
  },
});

useHead({
  title: "FAQs",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="FAQs">
        <template #right>
          <NuxtLink v-if="hasPermissionTo('faq.create')" to="/faq/create">
            <UButton
              label="Create"
              icon="material-symbols:add-rounded"
              size="sm"
              class="px-2"
              variant="subtle"
              color="secondary"
            />
          </NuxtLink>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UTable
        :data="data?.data"
        :columns="columns"
        :loading="status === 'pending'"
        class="flex-1"
      />

      <div
        class="flex items-center justify-end gap-3 border-t border-default pt-4 mt-auto"
      >
        <div class="flex items-center gap-1.5">
          <UPagination
            active-color="brand"
            :page="page"
            :total="totalItems"
            :items-per-page="perPage"
            @update:page="(p: number) => (page = p)"
          />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
