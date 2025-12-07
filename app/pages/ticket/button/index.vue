<script lang="ts" setup>
import { ref } from "vue";
import type { TableColumn } from "@nuxt/ui";
import { DiscordButton, type TicketButtonData } from "@ordinary/api-types";
import type { PaginatedResponse } from "@/types/response";

const page = ref(1);
const { data, status, refresh } = await useApi<
  PaginatedResponse<TicketButtonData[]>
>("/ticket/button", {
  method: "get",
  query: {
    page_size: 15,
    page,
  },
  watch: [page],
});
const totalItems = computed(() => data.value?.meta.total ?? 0);
const perPage = computed(() => data.value?.meta.per_page ?? 0);

const columns: TableColumn<TicketButtonData>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "text",
    header: "Text",
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => DiscordButton[row.original.color],
  },
  {
    accessorKey: "emoji",
    header: "Emoji",
  },
  {
    accessorKey: "naming_scheme",
    header: "Naming scheme",
  },
  {
    id: "actions",
    cell: ({ row }) =>
      h(resolveComponent("TicketButtonActionCell"), {
        data: row.original,
        onDeleted: refresh,
      }),
  },
];

definePageMeta({
  permission: {
    permission: "ticketButton.read",
  },
});

useHead({
  title: "Ticket Button",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Ticket Button">
        <template #right>
          <UButton
            v-if="hasPermissionTo('ticketButton.create')"
            label="Create"
            icon="material-symbols:add-rounded"
            size="sm"
            class="px-2"
            variant="subtle"
            color="secondary"
            to="/ticket/button/create"
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
