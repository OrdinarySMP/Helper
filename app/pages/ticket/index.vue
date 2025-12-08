<script lang="ts" setup>
import { ref } from "vue";
import type { TableColumn } from "@nuxt/ui";
import { TicketState, type TicketData } from "@OrdinarySMP/api-types";
import type { PaginatedResponse } from "@/types/response";
import dayjs from "dayjs";

const client = useApiClient();
const page = ref(1);
const loading = ref(false);
const data = ref<PaginatedResponse<TicketData[]>>();
const filter = ref({
  state: null,
  id: null,
});

const loadTickets = async () => {
  const response = await client<PaginatedResponse<TicketData[]>>("/ticket", {
    method: "get",
    query: {
      page_size: 15,
      page: page.value,
      include: "ticketButton",
      sort: "-created_at",
      ...filterToQuery(filter.value),
    },
  });
  data.value = response;
};
await loadTickets();

const totalItems = computed(() => data.value?.meta.total ?? 0);
const perPage = computed(() => data.value?.meta.per_page ?? 0);

const columns: TableColumn<TicketData>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "ticket_button.text",
    header: "Button",
  },
  {
    accessorKey: "channel_name",
    header: "Channel",
  },
  {
    accessorKey: "created_by",
    header: "Created by",
    cell: ({ row }) =>
      row.original.created_by_discord_user?.global_name ??
      row.original.created_by_discord_user_id,
  },
  {
    accessorKey: "created_at",
    header: "Created at",
    cell: ({ row }) =>
      dayjs(row.original.created_at).format("DD.MM.YYYY HH:mm:ss"),
  },
  {
    accessorKey: "updated_at",
    header: "Updated at",
    cell: ({ row }) =>
      dayjs(row.original.updated_at).format("DD.MM.YYYY HH:mm:ss"),
  },
  {
    id: "actions",
    cell: ({ row }) =>
      h(resolveComponent("TicketActionCell"), {
        data: row.original,
        onClosed: loadTickets,
      }),
  },
];

const ticketState = ref([
  {
    label: "All",
    value: null,
  },
  {
    label: "Open",
    value: TicketState.Open,
  },
  {
    label: "Closed",
    value: TicketState.Closed,
  },
]);

watch(
  filter,
  () => {
    if (page.value === 1) {
      loadTickets();
    } else {
      page.value = 1;
    }
  },
  {
    deep: true,
  },
);

watch(page, loadTickets);

definePageMeta({
  permission: {
    permission: "ticket.read",
  },
});

useHead({
  title: "Tickets",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Tickets" />
    </template>

    <template #body>
      <div class="space-x-4">
        <USelectMenu
          v-model="filter.state"
          :items="ticketState"
          class="w-xs"
          label-key="label"
          value-key="value"
        />
        <UInput
          v-model="filter.id"
          type="number"
          min="0"
          class="w-sm"
          icon="i-lucide-search"
          placeholder="ID"
        />
      </div>

      <UTable
        :data="data?.data"
        :columns="columns"
        :loading="loading"
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
