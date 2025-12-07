<script lang="ts" setup>
import { ref } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { TicketTeamData } from "@ordinary/api-types";
import type { PaginatedResponse } from "@/types/response";

const page = ref(1);
const { data, status, refresh } = await useApi<
  PaginatedResponse<TicketTeamData[]>
>("/ticket/team", {
  method: "get",
  query: {
    page_size: 15,
    page,
    include: "ticketTeamRoles",
  },
  watch: [page],
});
const totalItems = computed(() => data.value?.meta.total ?? 0);
const perPage = computed(() => data.value?.meta.per_page ?? 0);

const columns: TableColumn<TicketTeamData>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    header: "Roles",
    cell: ({ row }) =>
      row.original.ticket_team_roles.map((role) => role.role_name).join(", "),
  },
  {
    id: "actions",
    cell: ({ row }) =>
      h(resolveComponent("TicketTeamActionCell"), {
        data: row.original,
        onDeleted: refresh,
      }),
  },
];

definePageMeta({
  permission: {
    permission: "ticketTeam.read",
  },
});

useHead({
  title: "Ticket Team",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Ticket Team">
        <template #right>
          <UButton
            v-if="hasPermissionTo('ticketTeam.create')"
            label="Create"
            icon="material-symbols:add-rounded"
            size="sm"
            class="px-2"
            variant="subtle"
            color="secondary"
            to="/ticket/team/create"
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
