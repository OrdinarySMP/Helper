<script lang="ts" setup>
import { ref } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { ServerContentData } from "@OrdinarySMP/api-types";
import type { PaginatedResponse } from "@/types/response";

const toast = useSimpleToast();
const client = useApiClient();
const page = ref(1);
const { data, status, refresh } = await useApi<
  PaginatedResponse<ServerContentData[]>
>("/server-content", {
  method: "get",
  query: {
    page_size: 15,
    page,
  },
  watch: [page],
});
const totalItems = computed(() => data.value?.meta.total ?? 0);
const perPage = computed(() => data.value?.meta.per_page ?? 0);

const columns: TableColumn<ServerContentData>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => truncatedString(row.original.name),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => truncatedString(row.original.description),
  },
  {
    accessorKey: "is_recommended",
    header: "Recommended",
    cell: ({ row }) =>
      h(resolveComponent("TableBooleanCell"), {
        value: row.original.is_recommended,
      }),
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
      h(resolveComponent("ServerContentActionCell"), {
        data: row.original,
        onDeleted: refresh,
      }),
  },
];

const resend = async (channelId: string) => {
  const data = await client("/server-content/resend", {
    method: "post",
    body: {
      channel_id: channelId,
    },
  });
  if (data) {
    toast.success("Send Mods and Datapacks successfully.");
  } else {
    toast.success("An error occurred while sending Mods and Datapacks.");
  }
};

definePageMeta({
  permission: {
    permission: "serverContent.read",
  },
});

useHead({
  title: "Mods + Datapacks",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Mods + Datapacks">
        <template #right>
          <TextChannelSelector
            v-if="hasPermissionTo('serverContent.resend')"
            title="Resend"
            @select="resend"
          />

          <UButton
            v-if="hasPermissionTo('serverContentMessage.read')"
            label="Messages"
            icon="material-symbols:add-rounded"
            size="sm"
            variant="subtle"
            color="secondary"
            to="/server-content/message"
          />

          <UButton
            v-if="hasPermissionTo('serverContent.create')"
            label="Create"
            icon="material-symbols:add-rounded"
            size="sm"
            variant="subtle"
            color="secondary"
            to="/server-content/create"
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
