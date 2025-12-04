<script lang="ts" setup>
import { ref, onMounted } from "vue";
import type { ApplicationQuestionData, ApplicationData } from "@ordinary/api-types";
import {
  PencilIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/vue/24/solid";
import type { Pagination } from "@/types/table";
import type { PaginatedResponse } from "@/types/response";

const loading = ref(true);
const route = useRoute();
const applicationQuestions = ref<ApplicationQuestionData[]>([]);
const applicationId = ref<ApplicationData["id"]>();
const toDeleteApplicationQuestion = ref();
const deleteDialog = ref(false);
const pagination = ref<Pagination | null>();

const headers = ref([
  {
    title: "ID",
    key: "id",
  },
  {
    title: "Question",
    key: "question",
  },
  {
    title: "Order",
    key: "order",
  },
  {
    title: "Active?",
    key: "is_active",
  },
  {
    title: "",
    key: "actions",
  },
]);

const loadApplicationQuestion = async (page = 1) => {
  loading.value = true;
  const { data } = await useApi<PaginatedResponse<ApplicationQuestionData[]>>(
    "/application-question",
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
    applicationQuestions.value = data.value.data ?? [];

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
  if (!toDeleteApplicationQuestion.value) {
    return;
  }
  await useApi<Record<string, string>[]>(
    `/application-question/${toDeleteApplicationQuestion.value.id}`,
    {
      method: "delete",
    },
  );
  deleteDialog.value = false;
  toDeleteApplicationQuestion.value = undefined;
  await loadApplicationQuestion();
};

const pageChange = (page: number) => {
  loadApplicationQuestion(page);
};

definePageMeta({
  permission: {
    permission: "applicationQuestion.read",
  },
});

useHead({
  title: "Application Questions",
});

onMounted(() => {
  applicationId.value = parseRouteParameter(route.params.applicationId);
  loadApplicationQuestion();
});
</script>

<template>
  <div class="w-full">
    <p class="mb-4 flex items-center gap-4 text-2xl">
      Application Questions
      <NuxtLink
        v-if="hasPermissionTo('applicationQuestion.create')"
        :to="`/application/${applicationId}/question/create`"
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
      :data="applicationQuestions"
      :pagination="pagination"
      @page-change="pageChange"
    >
      <template #body-is_active="{ data }">
        <CheckIcon v-if="data.is_active" class="size-6 text-green-500" />
        <XMarkIcon v-else class="size-6 text-red-500" />
      </template>
      <template #body-actions="{ data }">
        <div class="flex gap-4">
          <NuxtLink
            v-if="hasPermissionTo('applicationQuestion.update')"
            :to="`/application/${applicationId}/question/edit/${data.id}`"
          >
            <Button size="sm" class="px-2" color="gray">
              <span class="flex items-center">
                <PencilIcon class="size-4 mr-2" />
                Edit
              </span>
            </Button>
          </NuxtLink>

          <Button
            v-if="hasPermissionTo('applicationQuestion.delete')"
            size="sm"
            class="px-2"
            color="error"
            @click="
              () => {
                toDeleteApplicationQuestion = data;
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
          toDeleteApplicationQuestion = undefined;
          deleteDialog = false;
        }
      "
    >
      <template #title>
        <p>Delete</p>
      </template>
      <template #body>
        <p class="mb-2">
          Delete the question:
          <span class="font-bold">{{
            toDeleteApplicationQuestion?.question
          }}</span>
          ?
        </p>
        <p
          class="rounded border border-red-400 bg-red-200 px-4 py-2 text-red-600"
        >
          This question will be deleted
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
              toDeleteApplicationQuestion = undefined;
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
