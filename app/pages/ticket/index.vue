<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useForm } from "vee-validate";
import type { TicketFilter } from "@/types/ticket";
import { TicketState, type TicketData, type DiscordUserData } from "@ordinary/api-types";
import { DocumentTextIcon } from "@heroicons/vue/24/solid";
import type { Pagination } from "@/types/table";
import type { PaginatedResponse } from "@/types/response";
import dayjs from "dayjs";

const user = useCurrentUser();
const loading = ref(true);
const tickets = ref<TicketData[]>([]);
const pagination = ref<Pagination | null>();
const filterValues = ref<TicketFilter>({
  state: TicketState.Open,
  id: null,
});

const headers = ref([
  {
    title: "ID",
    key: "id",
  },
  {
    title: "Button",
    key: "ticket_button.text",
  },
  {
    title: "Channel",
    key: "channel_name",
  },
  {
    title: "Created by",
    key: "created_by",
  },
  {
    title: "Created at",
    key: "created_at",
  },
  {
    title: "Updated at",
    key: "updated_at",
  },
  {
    title: "",
    key: "actions",
  },
]);

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

const formSchema = toTypedSchema(
  zod.object({
    state: zod.number().nullable(),
    id: zod.number().nullable(),
  }),
);

const { handleSubmit } = useForm({
  initialValues: filterValues.value,
  validationSchema: formSchema,
});

const changeFilter = handleSubmit((values) => {
  filterValues.value = values;
  loadTicket();
});

const loadTicket = async (page = 1) => {
  loading.value = true;
  const { data } = await useApi<PaginatedResponse<TicketData[]>>("/ticket", {
    method: "get",
    query: {
      page_size: 10,
      page,
      include: "ticketButton",
      sort: "-created_at",
      ...filters.value,
    },
  });

  if (data.value) {
    tickets.value = data.value.data ?? [];

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

const pageChange = (page: number) => {
  loadTicket(page);
};

const filters = computed(() => {
  const newFilters: Record<string, string | number | boolean | null> = {};

  if (filterValues.value.id) {
    newFilters["filter[id]"] = filterValues.value.id;
  }

  if (filterValues.value.state !== null) {
    newFilters["filter[state]"] = filterValues.value.state;
  }

  return newFilters;
});

const closeTicket = async (ticketId: number) => {
  const { error } = await useApi(`/ticket/${ticketId}/close`, {
    method: "post",
    body: {
      closed_by_discord_user_id: user.value?.discord_id,
    },
  });
  if (error.value) {
    useNotification().error(
      "Could not close ticket!",
      error.value.data.message,
    );
  } else {
    useNotification().error("Ticket close", "Ticket successfully closed");
    reloadNuxtApp();
  }
};

definePageMeta({
  permission: {
    permission: "ticket.read",
  },
});

useHead({
  title: "Tickets",
});

onMounted(() => {
  loadTicket();
});
</script>

<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center gap-4">
        <p class="text-2xl">Tickets</p>
      </div>
      <div class="flex items-center gap-4">
        <NuxtLink
          v-if="hasPermissionTo('ticketConfig.read')"
          to="/ticket/config"
        >
          <Button size="sm" class="px-2" color="primary">
            <span class="flex items-center"> Config </span>
          </Button>
        </NuxtLink>
        <NuxtLink
          v-if="hasPermissionTo('ticketButton.read')"
          to="/ticket/button"
        >
          <Button size="sm" class="px-2" color="primary">
            <span class="flex items-center"> Button </span>
          </Button>
        </NuxtLink>
        <NuxtLink v-if="hasPermissionTo('ticketPanel.read')" to="/ticket/panel">
          <Button size="sm" class="px-2" color="primary">
            <span class="flex items-center"> Panel </span>
          </Button>
        </NuxtLink>
        <NuxtLink v-if="hasPermissionTo('ticketTeam.read')" to="/ticket/team">
          <Button size="sm" class="px-2" color="primary">
            <span class="flex items-center"> Team </span>
          </Button>
        </NuxtLink>
      </div>
    </div>
    <Table
      :loading="loading"
      :headers="headers"
      :data="tickets"
      :pagination="pagination"
      @page-change="pageChange"
    >
      <template #search-bar>
        <FieldSelect
          :items="ticketState"
          clearable
          name="state"
          label="State"
          @change="changeFilter"
        />
        <FieldInput name="id" label="ID" type="number" @change="changeFilter" />
      </template>
      <template #body-created_by="{ data }">
        {{
          (data.created_by_discord_user as DiscordUserData | null)?.global_name ??
          data.created_by_discord_user_id
        }}
      </template>
      <template #body-created_at="{ data }">
        {{ dayjs((data as TicketData).created_at).format("DD.MM.YYYY HH:mm:ss") }}
      </template>
      <template #body-updated_at="{ data }">
        {{ dayjs((data as TicketData).updated_at).format("DD.MM.YYYY HH:mm:ss") }}
      </template>
      <template #body-actions="{ data }">
        <div class="flex gap-4">
          <NuxtLink
            v-if="hasPermissionTo('ticketTranscript.read')"
            :to="`/ticket/transcript/${data.id}`"
          >
            <Button size="sm" class="px-2" color="gray">
              <span class="flex items-center">
                <DocumentTextIcon class="size-4 mr-2" />
                Transcript
              </span>
            </Button>
          </NuxtLink>
          <Button
            v-if="data.state === TicketState.Open"
            size="sm"
            class="px-2"
            color="error"
            @click="closeTicket(data.id as number)"
          >
            Close
          </Button>
        </div>
      </template>
    </Table>
  </div>
</template>
