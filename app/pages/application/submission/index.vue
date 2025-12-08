<script lang="ts" setup>
import { ref } from "vue";
import type { TableColumn } from "@nuxt/ui";
import {
  ApplicationSubmissionState,
  type ApplicationSubmissionData,
} from "@ordinary/api-types";
import type { PaginatedResponse } from "@/types/response";
import dayjs from "dayjs";

const client = useApiClient();
const page = ref(1);
const loading = ref(false);
const data = ref<PaginatedResponse<ApplicationSubmissionData[]>>();
const filter = ref({
  state: null,
  discord_id: null,
});

const loadSubmissions = async () => {
  const response = await client<PaginatedResponse<ApplicationSubmissionData[]>>(
    "/application-submission",
    {
      method: "get",
      query: {
        page_size: 15,
        page: page.value,
        include: "application",
        sort: "-submitted_at",
        ...filterToQuery(filter.value),
      },
    },
  );
  data.value = response;
};
await loadSubmissions();

const totalItems = computed(() => data.value?.meta.total ?? 0);
const perPage = computed(() => data.value?.meta.per_page ?? 0);

const columns: TableColumn<ApplicationSubmissionData>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "application.name",
    header: "Application",
  },
  {
    accessorKey: "state",
    header: "State",
    cell: ({ row }) => ApplicationSubmissionState[row.original.state],
  },
  {
    accessorKey: "member",
    header: "Member",
    cell: ({ row }) =>
      row.original.member?.nick ??
      row.original.member?.user?.global_name ??
      row.original.member?.user?.username ??
      row.original.discord_id,
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
    accessorKey: "submitted_at",
    header: "Submitted at",
    cell: ({ row }) =>
      row.original.submitted_at
        ? dayjs(row.original.submitted_at).format("DD.MM.YYYY HH:mm:ss")
        : "Not submitted",
  },
  {
    id: "actions",
    cell: ({ row }) =>
      h(resolveComponent("ApplicationSubmissionActionCell"), {
        data: row.original,
        onDeleted: loadSubmissions,
      }),
  },
];

const applicationSubmissionState = computed(() => {
  const states = Object.entries(ApplicationSubmissionState)
    .filter(([_, value]) => typeof value === "number")
    .map(([key, value]): { label: string; value: number | null } => ({
      label: key,
      value: value as number,
    }));
  states.unshift({
    label: "All",
    value: null,
  });
  return states;
});

watch(
  filter,
  () => {
    if (page.value === 1) {
      loadSubmissions();
    } else {
      page.value = 1;
    }
  },
  {
    deep: true,
  },
);

watch(page, loadSubmissions);

definePageMeta({
  permission: {
    permission: "applicationSubmission.read",
  },
});

useHead({
  title: "Application Submissions",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Application Submissions" />
    </template>

    <template #body>
      <div class="space-x-4">
        <USelectMenu
          v-model="filter.state"
          :items="applicationSubmissionState"
          class="w-xs"
          label-key="label"
          value-key="value"
        />
        <UInput
          v-model="filter.discord_id"
          class="w-sm"
          icon="i-lucide-search"
          placeholder="Discord ID"
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
