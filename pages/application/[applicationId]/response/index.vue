<script lang="ts" setup>
import { ref, onMounted } from "vue";
import type { ApplicationResponse } from "@/types/application/response";
import { ApplicationResponseType } from "@/types/application/response";
import type { Application } from "@/types/application";
import { PencilIcon, PlusIcon } from "@heroicons/vue/24/solid";
import type { Pagination } from "@/types/table";
import type { PaginatedResponse } from "@/types/response";

if (!hasPermissionTo("applicationResponse.read")) {
  await navigateTo("/");
}

const loading = ref(true);
const route = useRoute();
const applicationResponses = ref<ApplicationResponse[]>([]);
const applicationId = ref<Application["id"]>();
const toDeleteApplicationResponse = ref();
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
    title: "Response",
    key: "response",
  },
  {
    title: "Type",
    key: "type",
  },
  {
    title: "",
    key: "actions",
  },
]);

const loadApplicationResponse = async (page = 1) => {
  loading.value = true;
  const { data } = await useApi<PaginatedResponse<ApplicationResponse[]>>(
    "/application-response",
    {
      method: "get",
      query: {
        "filter[application_id]": applicationId.value,
        page_size: 10,
        page,
      },
    },
  );

  if (data.value) {
    applicationResponses.value = data.value.data ?? [];

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
  if (!toDeleteApplicationResponse.value) {
    return;
  }
  await useApi<Record<string, string>[]>(
    `/application-response/${toDeleteApplicationResponse.value.id}`,
    {
      method: "delete",
    },
  );
  deleteDialog.value = false;
  toDeleteApplicationResponse.value = undefined;
  await loadApplicationResponse();
};

const pageChange = (page: number) => {
  loadApplicationResponse(page);
};

useHead({
  title: "Application Responses",
});

onMounted(() => {
  applicationId.value = parseRouteParameter(route.params.applicationId);
  loadApplicationResponse();
});
</script>

<template>
  <div class="w-full">
    <p class="mb-4 flex items-center gap-4 text-2xl">
      Application Responses
      <NuxtLink
        v-if="hasPermissionTo('applicationResponse.create')"
        :to="`/application/${applicationId}/response/create`"
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
      :data="applicationResponses"
      :pagination="pagination"
      @page-change="pageChange"
    >
      <template #body-type="{ data }">
        {{ ApplicationResponseType[(data as ApplicationResponse).type] }}
      </template>
      <template #body-actions="{ data }">
        <div class="flex gap-4">
          <NuxtLink
            v-if="hasPermissionTo('applicationResponse.update')"
            :to="`/application/${applicationId}/response/edit/${data.id}`"
          >
            <Button size="sm" class="px-2" color="gray">
              <span class="flex items-center">
                <PencilIcon class="size-4 mr-2" />
                Edit
              </span>
            </Button>
          </NuxtLink>

          <Button
            v-if="hasPermissionTo('applicationResponse.delete')"
            size="sm"
            class="px-2"
            color="error"
            @click="
              () => {
                toDeleteApplicationResponse = data;
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
          toDeleteApplicationResponse = undefined;
          deleteDialog = false;
        }
      "
    >
      <template #title>
        <p>Delete</p>
      </template>
      <template #body>
        <p class="mb-2">
          Delete the response:
          <span class="font-bold">{{ toDeleteApplicationResponse?.name }}</span>
          ?
        </p>
        <p
          class="rounded border border-red-400 bg-red-200 px-4 py-2 text-red-600"
        >
          This response will be deleted
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
              toDeleteApplicationResponse = undefined;
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
