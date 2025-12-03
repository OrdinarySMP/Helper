<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useForm } from "vee-validate";
import type { Button, ButtonFilter } from "@/types/ticket/button";
import { PencilIcon, PlusIcon } from "@heroicons/vue/24/solid";
import type { Pagination } from "@/types/table";
import type { PaginatedResponse, FullResponse } from "@/types/response";
import type { Panel } from "@/types/ticket/panel";
import type { Team } from "@/types/ticket/team";

const loading = ref(true);
const ticketButtons = ref<Button[]>([]);
const toDeleteTicketButton = ref();
const deleteDialog = ref(false);
const pagination = ref<Pagination | null>();
const panels = ref<{ label: string; value: number }[]>([]);
const teams = ref<{ label: string; value: number }[]>([]);
const filterValues = ref<ButtonFilter>({
  ticket_panel_id: null,
  ticket_team_id: null,
});

const headers = ref([
  {
    title: "ID",
    key: "id",
  },
  {
    title: "Text",
    key: "text",
  },
  {
    title: "Color",
    key: "color_name",
  },
  {
    title: "Emoji",
    key: "emoji",
  },
  {
    title: "Naming scheme",
    key: "naming_scheme",
  },
  {
    title: "",
    key: "actions",
  },
]);

const formSchema = toTypedSchema(
  zod.object({
    ticket_panel_id: zod.number().nullable(),
    ticket_team_id: zod.number().nullable(),
  }),
);

const { handleSubmit } = useForm({
  initialValues: filterValues.value,
  validationSchema: formSchema,
});

const changeFilter = handleSubmit((values) => {
  filterValues.value = values;
  loadTicketButton();
});

const loadTicketButton = async (page = 1) => {
  loading.value = true;
  const { data } = await useApi<PaginatedResponse<Button[]>>("/ticket/button", {
    method: "get",
    query: {
      page_size: 10,
      page,
      ...filters.value,
    },
  });

  if (data.value) {
    ticketButtons.value = data.value.data ?? [];

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

const loadTeam = async () => {
  const { data } = await useApi<FullResponse<Team[]>>("/ticket/team", {
    method: "get",
    query: {
      full: true,
    },
  });
  teams.value =
    data.value?.data?.map((team) => ({
      label: team.name,
      value: team.id,
    })) ?? ([] as { label: string; value: number }[]);
};

const loadPanel = async () => {
  const { data } = await useApi<FullResponse<Panel[]>>("/ticket/panel", {
    method: "get",
    query: {
      full: true,
    },
  });
  panels.value =
    data.value?.data?.map((panel) => ({
      label: panel.title,
      value: panel.id,
    })) ?? ([] as { label: string; value: number }[]);
};

const remove = async () => {
  if (!toDeleteTicketButton.value) {
    return;
  }
  await useApi<Record<string, string>[]>(
    `/ticket/button/${toDeleteTicketButton.value.id}`,
    {
      method: "delete",
    },
  );
  deleteDialog.value = false;
  toDeleteTicketButton.value = undefined;
  await loadTicketButton();
};

const pageChange = (page: number) => {
  loadTicketButton(page);
};

const filters = computed(() => {
  const newFilters: Record<string, string | number | boolean | null> = {};

  if (filterValues.value.ticket_panel_id) {
    newFilters["filter[ticket_panel_id]"] = filterValues.value.ticket_panel_id;
  }

  if (filterValues.value.ticket_team_id) {
    newFilters["filter[ticket_team_id]"] = filterValues.value.ticket_team_id;
  }

  return newFilters;
});

definePageMeta({
  permission: {
    permission: "ticket.read",
  },
});

useHead({
  title: "Ticket Button",
});

onMounted(() => {
  loadTicketButton();
  loadPanel();
  loadTeam();
});
</script>

<template>
  <div class="w-full">
    <p class="mb-4 flex items-center gap-4 text-2xl">
      Button
      <NuxtLink
        v-if="hasPermissionTo('ticketButton.create')"
        to="/ticket/button/create"
      >
        <Button size="sm" class="px-2" color="primary">
          <span class="flex items-center">
            <PlusIcon class="size-4 mr-2" />
            Create
          </span>
        </Button>
      </NuxtLink>
    </p>
    <Table
      :loading="loading"
      :headers="headers"
      :data="ticketButtons"
      :pagination="pagination"
      @page-change="pageChange"
    >
      <template #search-bar>
        <FieldSelect
          :items="panels"
          clearable
          name="ticket_panel_id"
          label="Panel"
          @change="changeFilter"
        />
        <FieldSelect
          :items="teams"
          clearable
          name="ticket_team_id"
          label="Team"
          @change="changeFilter"
        />
      </template>
      <template #body-actions="{ data }">
        <div class="flex gap-4">
          <NuxtLink
            v-if="hasPermissionTo('ticketButton.update')"
            :to="`/ticket/button/edit/${data.id}`"
          >
            <Button size="sm" class="px-2" color="gray">
              <span class="flex items-center">
                <PencilIcon class="size-4 mr-2" />
                Edit
              </span>
            </Button>
          </NuxtLink>

          <Button
            v-if="hasPermissionTo('ticketButton.delete')"
            size="sm"
            class="px-2"
            color="error"
            @click="
              () => {
                toDeleteTicketButton = data;
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
          toDeleteTicketButton = undefined;
          deleteDialog = false;
        }
      "
    >
      <template #title>
        <p>Delete</p>
      </template>
      <template #body>
        <p class="mb-2">
          Delete the button:
          <span class="font-bold">{{ toDeleteTicketButton?.text }}</span>
          ?
        </p>
        <p
          class="rounded border border-red-400 bg-red-200 px-4 py-2 text-red-600"
        >
          This button will be deleted
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
              toDeleteTicketButton = undefined;
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
