<script lang="ts" setup>
import { ref } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { TicketPanelData } from "@OrdinarySMP/api-types";
import type { PaginatedResponse } from "@/types/response";

const page = ref(1);
const { data, status, refresh } = await useApi<
  PaginatedResponse<TicketPanelData[]>
>("/ticket/panel", {
  method: "get",
  query: {
    page_size: 15,
    page,
  },
  watch: [page],
});
const totalItems = computed(() => data.value?.meta.total ?? 0);
const perPage = computed(() => data.value?.meta.per_page ?? 0);

const columns: TableColumn<TicketPanelData>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => truncatedString(row.original.message),
  },
  {
    accessorKey: "embed_color",
    header: "Color",
    cell: ({ row }) =>
      h(
        "div",
        {
          style: `background-color: ${row.original.embed_color}`,
        },
        row.original.embed_color,
      ),
  },
  {
    accessorKey: "channel_name",
    header: "Channel",
  },
  {
    id: "actions",
    cell: ({ row }) =>
      h(resolveComponent("TicketPanelActionCell"), {
        data: row.original,
        onDeleted: refresh,
      }),
  },
];

definePageMeta({
  permission: {
    permission: "ticketPanel.read",
  },
});

useHead({
  title: "Ticket Panel",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Ticket Panel">
        <template #right>
          <UButton
            v-if="hasPermissionTo('ticketPanel.create')"
            label="Create"
            icon="material-symbols:add-rounded"
            size="sm"
            class="px-2"
            variant="subtle"
            color="secondary"
            to="/ticket/panel/create"
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
