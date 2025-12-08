<script lang="ts" setup>
import { ref } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { ApplicationQuestionData } from "@OrdinarySMP/api-types";
import type { PaginatedResponse } from "@/types/response";

const route = useRoute();
const page = ref(1);
const { data, status, refresh } = await useApi<
  PaginatedResponse<ApplicationQuestionData[]>
>("/application-question", {
  method: "get",
  query: {
    page_size: 15,
    page,
    "filter[application_id]": route.params.id,
  },
  watch: [page],
});
const totalItems = computed(() => data.value?.meta.total ?? 0);
const perPage = computed(() => data.value?.meta.per_page ?? 0);

const columns: TableColumn<ApplicationQuestionData>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "question",
    header: "Questions",
  },
  {
    accessorKey: "order",
    header: "Order",
  },
  {
    accessorKey: "is_active",
    header: "Active",
    cell: ({ row }) =>
      h(resolveComponent("TableBooleanCell"), {
        value: row.original.is_active,
      }),
  },
  {
    id: "actions",
    cell: ({ row }) =>
      h(resolveComponent("ApplicationQuestionActionCell"), {
        data: row.original,
        onDeleted: refresh,
      }),
  },
];

definePageMeta({
  permission: {
    permission: "applicationQuestion.read",
  },
});

useHead({
  title: "Application Questions",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Application Questions">
        <template #right>
          <UButton
            v-if="hasPermissionTo('applicationQuestion.create')"
            label="Create"
            icon="material-symbols:add-rounded"
            size="sm"
            class="px-2"
            variant="subtle"
            color="secondary"
            :to="`/application/${route.params.applicationId}/question/create`"
          />
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
