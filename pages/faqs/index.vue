<script lang="ts" setup>
import { ref, onMounted } from "vue";
import type { FAQ } from "@/types/faq";
import { PencilIcon, PlusIcon } from "@heroicons/vue/24/solid";
import type { Pagination } from "@/types/table";
import type { PaginatedResponse } from "@/types/response";

const loading = ref(true);
const faqs = ref<FAQ[]>([]);
const toDeleteFAQ = ref();
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
    title: "",
    key: "actions",
  },
]);

const loadFAQ = async () => {
  loading.value = true;
  const { data } = await useApi<PaginatedResponse<FAQ[]>>("/faqs", {
    method: "get",
  });

  if (data.value) {
    faqs.value = data.value.data ?? [];

    pagination.value = {
      total: data.value.total,
      currentPage: data.value.current_page,
      perPage: data.value.per_page,
      from: data.value.from,
      to: data.value.to,
      totalPages: data.value.last_page,
    };
  }

  loading.value = false;
};

const remove = async () => {
  if (!toDeleteFAQ.value) {
    return;
  }
  await useApi<Record<string, string>[]>(`/faqs/${toDeleteFAQ.value.id}`, {
    method: "delete",
  });
  deleteDialog.value = false;
  toDeleteFAQ.value = undefined;
  await loadFAQ();
};

useHead({
  title: "FAQs",
});

onMounted(() => {
  loadFAQ();
});
</script>

<template>
  <div class="w-full">
    <p class="mb-4 flex items-center gap-4 text-2xl">
      FAQs
      <NuxtLink to="/faqs/create">
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
      :data="faqs"
      :pagination="pagination"
    >
      <template #body-actions="{ data }">
        <div class="flex gap-4">
          <NuxtLink :to="`/faqs/edit/${data.id}`">
            <Button size="sm" class="px-2" color="gray">
              <span class="flex items-center">
                <PencilIcon class="size-4 mr-2" />
                Edit
              </span>
            </Button>
          </NuxtLink>

          <Button
            size="sm"
            class="px-2"
            color="error"
            @click="
              () => {
                toDeleteFAQ = data;
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
          toDeleteFAQ = undefined;
          deleteDialog = false;
        }
      "
    >
      <template #title>
        <p>Löschen</p>
      </template>
      <template #body>
        <p class="mb-2">
          Delete the FAQ:
          <span class="font-bold">{{ toDeleteFAQ?.question }}</span>
          ?
        </p>
        <p
          class="rounded border border-red-400 bg-red-200 px-4 py-2 text-red-600"
        >
          This FAQ will be deleted
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
              toDeleteFAQ = undefined;
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
