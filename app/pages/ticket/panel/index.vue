<script lang="ts" setup>
import { ref, onMounted } from "vue";
import type { TicketPanelData } from "@ordinary/api-types";
import { PencilIcon, PlusIcon } from "@heroicons/vue/24/solid";
import type { Pagination } from "@/types/table";
import type { PaginatedResponse } from "@/types/response";

const loading = ref(true);
const ticketPanels = ref<TicketPanelData[]>([]);
const toDeleteTicketPanel = ref();
const deleteDialog = ref(false);
const pagination = ref<Pagination | null>();

const headers = ref([
  {
    title: "ID",
    key: "id",
  },
  {
    title: "Title",
    key: "title",
  },
  {
    title: "Message",
    key: "message",
  },
  {
    title: "Color",
    key: "embed_color",
  },
  {
    title: "Channel",
    key: "channel_name",
  },
  {
    title: "",
    key: "actions",
  },
]);

const loadTicketPanel = async (page = 1) => {
  loading.value = true;
  const { data } = await useApi<PaginatedResponse<TicketPanelData[]>>(
    "/ticket/panel",
    {
      method: "get",
      query: {
        page_size: 10,
        page,
      },
    },
  );

  if (data.value) {
    ticketPanels.value = data.value.data ?? [];

    pagination.value = {
      total: data.value.meta.total,
      currentPage: data.value.meta.current_page,
      perPage: data.value.meta.per_page,
      from: data.value.meta.from,
      to: data.value.meta.to,
      totalPages: data.value.meta.last_page,
    };
  }

  loading.value = false;
};

const remove = async () => {
  if (!toDeleteTicketPanel.value) {
    return;
  }
  await useApi<Record<string, string>[]>(
    `/ticket/panel/${toDeleteTicketPanel.value.id}`,
    {
      method: "delete",
    },
  );
  deleteDialog.value = false;
  toDeleteTicketPanel.value = undefined;
  await loadTicketPanel();
};

const pageChange = (page: number) => {
  loadTicketPanel(page);
};

definePageMeta({
  permission: {
    permission: "ticket.read",
  },
});

useHead({
  title: "Ticket Panel",
});

onMounted(() => {
  loadTicketPanel();
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Ticket Panel">
        <template #right>
          <NuxtLink
            v-if="hasPermissionTo('ticketPanel.create')"
            to="/ticket/panel/create"
          >
            <Button size="sm" class="px-2" color="primary">
              <span class="flex items-center">
                <PlusIcon class="size-4 mr-2" />
                Create
              </span>
            </Button>
          </NuxtLink>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="w-full">
        <Table
          :loading="loading"
          :headers="headers"
          :data="ticketPanels"
          :pagination="pagination"
          @page-change="pageChange"
        >
          <template #body-embed_color="{ data }">
            <div :style="`background-color: ${data.embed_color}`">&nbsp;</div>
          </template>
          <template #body-actions="{ data }">
            <div class="flex gap-4">
              <NuxtLink
                v-if="hasPermissionTo('ticketPanel.update')"
                :to="`/ticket/panel/edit/${data.id}`"
              >
                <Button size="sm" class="px-2" color="gray">
                  <span class="flex items-center">
                    <PencilIcon class="size-4 mr-2" />
                    Edit
                  </span>
                </Button>
              </NuxtLink>

              <Button
                v-if="hasPermissionTo('ticketPanel.delete')"
                size="sm"
                class="px-2"
                color="error"
                @click="
                  () => {
                    toDeleteTicketPanel = data;
                    deleteDialog = true;
                  }
                "
              >
                <span class="flex items-center"> Delete </span>
              </Button>
            </div>
          </template>
        </Table>
        <Dialog
          v-if="deleteDialog"
          @close="
            () => {
              toDeleteTicketPanel = undefined;
              deleteDialog = false;
            }
          "
        >
          <template #title>
            <p>Delete</p>
          </template>
          <template #body>
            <p class="mb-2">
              Delete the panel:
              <span class="font-bold">{{ toDeleteTicketPanel?.title }}</span>
              ?
            </p>
            <p
              class="rounded border border-red-400 bg-red-200 px-4 py-2 text-red-600"
            >
              This panel will be deleted
            </p>
          </template>
          <template #footer>
            <Button class="ml-4 px-4" color="error" size="sm" @click="remove">
              Delete
            </Button>
            <Button
              class="px-4"
              color="gray"
              size="sm"
              @click="
                () => {
                  toDeleteTicketPanel = undefined;
                  deleteDialog = false;
                }
              "
            >
              Cancel
            </Button>
          </template>
        </Dialog>
      </div>
    </template>
  </UDashboardPanel>
</template>
