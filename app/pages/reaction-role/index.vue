<script lang="ts" setup>
import { ref } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { ReactionRoleData } from "@OrdinarySMP/api-types";
import type { PaginatedResponse } from "@/types/response";

const page = ref(1);
const { data, status, refresh } = await useApi<
  PaginatedResponse<ReactionRoleData[]>
>("/reaction-role", {
  method: "get",
  query: {
    page_size: 15,
    page,
  },
  watch: [page],
});
const totalItems = computed(() => data.value?.meta.total ?? 0);
const perPage = computed(() => data.value?.meta.per_page ?? 0);

const columns: TableColumn<ReactionRoleData>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "message_link",
    header: "Message",
    cell: ({ row }) =>
      h(
        resolveComponent("NuxtLink"),
        {
          to: row.original.message_link,
          target: "_blank",
        },
        () => "open message",
      ),
  },
  {
    accessorKey: "role_name",
    header: "Role",
  },
  {
    accessorKey: "emoji",
    header: "Emoji",
  },
  {
    id: "actions",
    cell: ({ row }) =>
      h(resolveComponent("ReactionRoleActionCell"), {
        data: row.original,
        onDeleted: refresh,
      }),
  },
];

definePageMeta({
  permission: {
    permission: "reactionRole.read",
  },
});

useHead({
  title: "Reaction roles",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Reaction roles">
        <template #right>
          <UButton
            v-if="hasPermissionTo('reactionRole.create')"
            label="Create"
            icon="material-symbols:add-rounded"
            size="sm"
            class="px-2"
            variant="subtle"
            color="secondary"
            to="/reaction-role/create"
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
