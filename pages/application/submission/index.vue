<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useForm } from "vee-validate";
import dayjs from "dayjs";
import { EyeIcon } from "@heroicons/vue/24/solid";
import { ApplicationSubmissionState } from "@/types/application/submission";
import type {
  ApplicationSubmission,
  ApplicationSubmissionFilter,
} from "@/types/application/submission";
import type { Pagination, Sorting } from "@/types/table";
import type { PaginatedResponse } from "@/types/response";

if (!hasPermissionTo("applicationSubmission.read")) {
  await navigateTo("/");
}

const loading = ref(true);
const applicationSubmissions = ref<ApplicationSubmission[]>([]);
const pagination = ref<Pagination | null>();
const toDeleteApplicationSubmission = ref();
const deleteDialog = ref(false);
const sorting = ref<Sorting>({
  column: "submitted_at",
  order: "asc",
});
const filterValues = ref<ApplicationSubmissionFilter>({
  state: ApplicationSubmissionState.Pending,
  discord_id: null,
});

const headers = ref([
  {
    title: "ID",
    key: "id",
  },
  {
    title: "Application",
    key: "application.name",
  },
  {
    title: "State",
    key: "state",
  },
  {
    title: "Member",
    key: "member",
  },
  {
    title: "Created at",
    key: "created_at",
    sortable: true,
  },
  {
    title: "Updated at",
    key: "updated_at",
    sortable: true,
  },
  {
    title: "Submitted at",
    key: "submitted_at",
    sortable: true,
  },
  {
    title: "",
    key: "actions",
  },
]);

const formSchema = toTypedSchema(
  zod.object({
    state: zod.number().nullable(),
    discord_id: zod.string().nullable(),
  }),
);

const { handleSubmit } = useForm({
  initialValues: filterValues.value,
  validationSchema: formSchema,
});

const changeFilter = handleSubmit((values) => {
  filterValues.value = values;
  loadApplication();
});

const loadApplication = async (page = 1) => {
  loading.value = true;

  let sort = undefined;
  if (sorting.value && sorting.value.column) {
    sort = `${sorting.value.order === "asc" ? "-" : ""}${sorting.value.column}`;
  }

  const { data } = await useApi<PaginatedResponse<ApplicationSubmission[]>>(
    "/application-submission",
    {
      method: "get",
      query: {
        page_size: 10,
        page,
        ...filters.value,
        sort,
        include: "application",
      },
    },
  );

  if (data.value) {
    applicationSubmissions.value = data.value.data ?? [];

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
  loadApplication(page);
};

const setSorting = (newSorting: Sorting) => {
  sorting.value = newSorting;
  loadApplication();
};

const remove = async () => {
  if (!toDeleteApplicationSubmission.value) {
    return;
  }
  await useApi<Record<string, string>[]>(
    `/application-submission/${toDeleteApplicationSubmission.value.id}`,
    {
      method: "delete",
    },
  );
  deleteDialog.value = false;
  toDeleteApplicationSubmission.value = undefined;
  await loadApplication();
};

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

const filters = computed(() => {
  const newFilters: Record<string, string | number | boolean | null> = {};

  if (filterValues.value.discord_id) {
    newFilters["filter[discord_id]"] = filterValues.value.discord_id;
  }

  if (filterValues.value.state !== null) {
    newFilters["filter[state]"] = filterValues.value.state;
  }

  return newFilters;
});

useHead({
  title: "Application Submissions",
});

onMounted(() => {
  loadApplication();
});
</script>

<template>
  <div class="w-full">
    <p class="mb-4 flex items-center gap-4 text-2xl">Application Submissions</p>
    <Table
      :loading="loading"
      :headers="headers"
      :data="applicationSubmissions"
      :pagination="pagination"
      :initial-sort="sorting"
      @sorting-change="setSorting"
      @page-change="pageChange"
    >
      <template #search-bar>
        <FieldSelect
          :items="applicationSubmissionState"
          clearable
          name="state"
          label="State"
          @change="changeFilter"
        />
        <FieldInput
          name="discord_id"
          label="Discord ID"
          @change="changeFilter"
        />
      </template>
      <template #body-state="{ data }">
        {{ ApplicationSubmissionState[(data as ApplicationSubmission).state] }}
      </template>
      <template #body-member="{ data }">
        {{
          (data as ApplicationSubmission).member?.nick ??
          (data as ApplicationSubmission).member?.user?.global_name ??
          (data as ApplicationSubmission).member?.user?.username ??
          (data as ApplicationSubmission).discord_id
        }}
      </template>
      <template #body-created_at="{ data }">
        {{
          dayjs((data as ApplicationSubmission).created_at).format(
            "DD.MM.YYYY HH:mm:ss",
          )
        }}
      </template>
      <template #body-updated_at="{ data }">
        {{
          dayjs((data as ApplicationSubmission).updated_at).format(
            "DD.MM.YYYY HH:mm:ss",
          )
        }}
      </template>
      <template #body-submitted_at="{ data }">
        {{
          (data as ApplicationSubmission).submitted_at
            ? dayjs((data as ApplicationSubmission).submitted_at).format(
                "DD.MM.YYYY HH:mm:ss",
              )
            : "---"
        }}
      </template>
      <template #body-actions="{ data }">
        <div class="flex gap-4">
          <NuxtLink
            v-if="hasPermissionTo('applicationSubmission.read')"
            :to="`/application/submission/view/${data.id}`"
          >
            <Button size="sm" class="px-2" color="gray">
              <span class="flex items-center">
                <EyeIcon class="size-4 mr-2" />
                View
              </span>
            </Button>
          </NuxtLink>

          <Button
            v-if="hasPermissionTo('applicationSubmission.delete')"
            size="sm"
            class="px-2"
            color="error"
            @click="
              () => {
                toDeleteApplicationSubmission = data;
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
          toDeleteApplicationSubmission = undefined;
          deleteDialog = false;
        }
      "
    >
      <template #title>
        <p>Delete</p>
      </template>
      <template #body>
        <p class="mb-2">
          Do you want to delete the submission from:

          <span class="font-bold">{{
            toDeleteApplicationSubmission?.member?.nick ??
            toDeleteApplicationSubmission?.member?.user?.global_name ??
            toDeleteApplicationSubmission?.member?.user?.username ??
            toDeleteApplicationSubmission?.discord_id
          }}</span>
          ?
        </p>
        <p
          class="rounded border border-red-400 bg-red-200 px-4 py-2 text-red-600"
        >
          The submission will be deleted the user will NOT receive a response
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
              toDeleteApplicationSubmission = undefined;
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
