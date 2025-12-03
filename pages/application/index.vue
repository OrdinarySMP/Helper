<script lang="ts" setup>
import { ref, onMounted } from "vue";
import type { Application } from "@/types/application";
import {
  PencilIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon,
  PaperAirplaneIcon,
} from "@heroicons/vue/24/solid";
import { QuestionMarkCircleIcon } from "@heroicons/vue/24/outline";
import type { Pagination } from "@/types/table";
import type { PaginatedResponse } from "@/types/response";

const loading = ref(true);
const applications = ref<Application[]>([]);
const toDeleteApplication = ref();
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
    title: "Active",
    key: "active",
  },
  {
    title: "",
    key: "actions",
  },
]);

const loadApplication = async (page = 1) => {
  loading.value = true;
  const { data } = await useApi<PaginatedResponse<Application[]>>(
    "/application",
    {
      method: "get",
      query: {
        page_size: 10,
        page,
      },
    },
  );

  if (data.value) {
    applications.value = data.value.data ?? [];

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
  if (!toDeleteApplication.value) {
    return;
  }
  await useApi<Record<string, string>[]>(
    `/application/${toDeleteApplication.value.id}`,
    {
      method: "delete",
    },
  );
  deleteDialog.value = false;
  toDeleteApplication.value = undefined;
  await loadApplication();
};

const pageChange = (page: number) => {
  loadApplication(page);
};

const sendButton = async (application: Application) => {
  if (
    !application.embed_channel_id ||
    !application.embed_title ||
    !application.embed_color ||
    !application.embed_description
  ) {
    useNotification().error("Send button", "Please fill all embed fields");
    return;
  }
  const { data } = await useApi(`/application/${application.id}/send-button`);

  if (data.value) {
    useNotification().success("Send button", "Embed send");
  }
};

definePageMeta({
  permission: {
    permission: "application.read",
  },
});

useHead({
  title: "Applications",
});

onMounted(() => {
  loadApplication();
});
</script>

<template>
  <div class="w-full">
    <p class="mb-4 flex items-center gap-4 text-2xl">
      Applications
      <NuxtLink
        v-if="hasPermissionTo('application.create')"
        to="/application/create"
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
      :data="applications"
      :pagination="pagination"
      @page-change="pageChange"
    >
      <template #body-active="{ data }">
        <CheckIcon v-if="data.is_active" class="size-6 text-green-500" />
        <XMarkIcon v-else class="size-6 text-red-500" />
      </template>
      <template #body-actions="{ data }">
        <div class="flex gap-4">
          <NuxtLink
            v-if="hasPermissionTo('application.update')"
            :to="`/application/edit/${data.id}`"
          >
            <Button size="sm" class="px-2" color="gray">
              <span class="flex items-center">
                <PencilIcon class="size-4 mr-2" />
                Edit
              </span>
            </Button>
          </NuxtLink>

          <NuxtLink
            v-if="hasPermissionTo('applicationQuestion.read')"
            :to="`/application/${data.id}/question`"
          >
            <Button size="sm" class="px-2" color="gray">
              <span class="flex items-center">
                <QuestionMarkCircleIcon class="size-4 mr-2" />
                Questions
              </span>
            </Button>
          </NuxtLink>

          <NuxtLink
            v-if="hasPermissionTo('applicationResponse.read')"
            :to="`/application/${data.id}/response`"
          >
            <Button size="sm" class="px-2" color="gray">
              <span class="flex items-center">
                <PaperAirplaneIcon class="size-4 mr-2" />
                Responses
              </span>
            </Button>
          </NuxtLink>

          <Button
            v-if="hasPermissionTo('application.update')"
            size="sm"
            class="px-2"
            color="primary"
            @click="sendButton(data as Application)"
          >
            <span class="flex items-center">
              <PaperAirplaneIcon class="size-4 mr-2" />
              Send button
            </span>
          </Button>

          <Button
            v-if="hasPermissionTo('application.delete')"
            size="sm"
            class="px-2"
            color="error"
            @click="
              () => {
                toDeleteApplication = data;
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
          toDeleteApplication = undefined;
          deleteDialog = false;
        }
      "
    >
      <template #title>
        <p>Delete</p>
      </template>
      <template #body>
        <p class="mb-2">
          Delete the Application:
          <span class="font-bold">{{ toDeleteApplication?.name }}</span>
          ?
        </p>
        <p
          class="rounded border border-red-400 bg-red-200 px-4 py-2 text-red-600"
        >
          This Application will be deleted
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
              toDeleteApplication = undefined;
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
