<script lang="ts" setup>
import { ref, onMounted } from "vue";
import type { TicketTeamData, TicketTeamRoleData } from "@ordinary/api-types";
import { PencilIcon, PlusIcon } from "@heroicons/vue/24/solid";
import type { Pagination } from "@/types/table";
import type { PaginatedResponse } from "@/types/response";

const loading = ref(true);
const ticketTeams = ref<TicketTeamData[]>([]);
const toDeleteTicketTeam = ref();
const deleteDialog = ref(false);
const pagination = ref<Pagination | null>();

const headers = ref([
  {
    title: "ID",
    key: "id",
  },
  {
    title: "Name",
    key: "name",
  },
  {
    title: "Roles",
    key: "roles",
  },
  {
    title: "",
    key: "actions",
  },
]);

const loadTicketTeam = async (page = 1) => {
  loading.value = true;
  const { data } = await useApi<PaginatedResponse<TicketTeamData[]>>(
    "/ticket/team",
    {
      method: "get",
      query: {
        page_size: 10,
        page,
        include: "ticketTeamRoles",
      },
    },
  );

  if (data.value) {
    ticketTeams.value = data.value.data ?? [];

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
  if (!toDeleteTicketTeam.value) {
    return;
  }
  await useApi<Record<string, string>[]>(
    `/ticket/team/${toDeleteTicketTeam.value.id}`,
    {
      method: "delete",
    },
  );
  deleteDialog.value = false;
  toDeleteTicketTeam.value = undefined;
  await loadTicketTeam();
};

const pageChange = (page: number) => {
  loadTicketTeam(page);
};

definePageMeta({
  permission: {
    permission: "ticket.read",
  },
});

useHead({
  title: "Ticket Team",
});

onMounted(() => {
  loadTicketTeam();
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Ticket Team">
        <template #right>
          <NuxtLink
            v-if="hasPermissionTo('ticketTeam.create')"
            to="/ticket/team/create"
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
          :data="ticketTeams"
          :pagination="pagination"
          @page-change="pageChange"
        >
          <template #body-roles="{ data }">
            {{
              (data.ticket_team_roles as TicketTeamRoleData[])
                .map((role) => role.role_name)
                .join(", ")
            }}
          </template>
          <template #body-actions="{ data }">
            <div class="flex gap-4">
              <NuxtLink
                v-if="hasPermissionTo('ticketTeam.update')"
                :to="`/ticket/team/edit/${data.id}`"
              >
                <Button size="sm" class="px-2" color="gray">
                  <span class="flex items-center">
                    <PencilIcon class="size-4 mr-2" />
                    Edit
                  </span>
                </Button>
              </NuxtLink>

              <Button
                v-if="hasPermissionTo('ticketTeam.delete')"
                size="sm"
                class="px-2"
                color="error"
                @click="
                  () => {
                    toDeleteTicketTeam = data;
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
              toDeleteTicketTeam = undefined;
              deleteDialog = false;
            }
          "
        >
          <template #title>
            <p>Delete</p>
          </template>
          <template #body>
            <p class="mb-2">
              Delete the team:
              <span class="font-bold">{{ toDeleteTicketTeam?.name }}</span>
              ?
            </p>
            <p
              class="rounded border border-red-400 bg-red-200 px-4 py-2 text-red-600"
            >
              This team will be deleted
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
                  toDeleteTicketTeam = undefined;
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
