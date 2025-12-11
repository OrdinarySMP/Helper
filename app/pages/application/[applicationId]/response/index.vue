<script lang="ts" setup>
import { ref } from "vue";
import type { TableColumn } from "@nuxt/ui";
import {
  ApplicationResponseType,
  type ApplicationResponseData,
} from "@OrdinarySMP/api-types";
import type { PaginatedResponse } from "@/types/response";

const route = useRoute();
const page = ref(1);
const { data, status, refresh } = await useApi<
  PaginatedResponse<ApplicationResponseData[]>
>("/application-response", {
  method: "get",
  query: {
    page_size: 15,
    page,
    "filter[application_id]": route.params.applicationId,
  },
  watch: [page],
});
const totalItems = computed(() => data.value?.meta.total ?? 0);
const perPage = computed(() => data.value?.meta.per_page ?? 0);

const columns: TableColumn<ApplicationResponseData>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "response",
    header: "Response",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => ApplicationResponseType[row.original.type],
  },
  {
    id: "actions",
    cell: ({ row }) =>
      h(resolveComponent("ApplicationResponseActionCell"), {
        data: row.original,
        onDeleted: refresh,
      }),
  },
];

definePageMeta({
  permission: {
    permission: "applicationResponse.read",
  },
});

useHead({
  title: "Application Responses",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Application Responses">
        <template #right>
          <UButton
            v-if="hasPermissionTo('applicationResponse.create')"
            label="Create"
            icon="material-symbols:add-rounded"
            size="sm"
            class="px-2"
            variant="subtle"
            color="secondary"
            :to="`/application/${route.params.applicationId}/response/create`"
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
