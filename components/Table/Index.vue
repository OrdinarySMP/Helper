<script lang="ts" setup>
import type { Header, Data, Pagination, Sorting } from "@/types/table";

interface Props {
  headers: Header[];
  data: Data[] | null;
  footer?: Data;
  pagination?: Pagination | null;
  loading?: boolean;
  rowStylesCallback?: (values: Data) => string;
  initialSort?: Sorting;
  noData?: string;
}

const props = defineProps<Props>();

const sorting = ref(
  props.initialSort ?? {
    column: null,
    order: null,
  },
);

const emit = defineEmits<{
  (e: "pageChange", page: number): void;
  (e: "sortingChange", sorting: Sorting): void;
}>();

const getValue = (values: Data, header: Header) => {
  const keys = getHeaderKey(header).split(".");
  let current = values;

  for (const key of keys) {
    if (current?.[key] !== undefined) {
      current = current[key] as Record<string, unknown>;
    } else {
      return "";
    }
  }

  return current;
};

const getSlotName = (prefix: string, header: Header) => {
  return `${prefix}-${getHeaderKey(header).replace(".", "-")}`;
};

const getHeaderKey = (header: Header) => {
  return (header.key ??= header.title.toLowerCase().replace(" ", "-"));
};

const getRowStyles = (values: Data) => {
  if (props.rowStylesCallback !== undefined) {
    return props.rowStylesCallback(values);
  }
  return "";
};

const setSorting = (header: Header) => {
  if (header.sortable === false) {
    return;
  } else if (sorting.value.column !== header.key && header.key) {
    sorting.value = {
      column: header.key,
      order: "desc",
    };
  } else if (sorting.value.order === "asc") {
    sorting.value = {
      column: null,
      order: null,
    };
  } else if (sorting.value.order === "desc") {
    sorting.value.order = "asc";
  } else {
    sorting.value.order = "desc";
  }

  emit("sortingChange", sorting.value);
};
</script>
<template>
  <div>
    <div v-if="loading" class="text-center">
      <Spinner />
    </div>
    <table v-else class="min-w-full divide-y divide-gray-300">
      <thead>
        <tr>
          <th
            v-for="(header, key) in headers"
            :key="key"
            scope="col"
            class="select-none py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
            :class="`header-${getHeaderKey(header)}`"
            @click="setSorting(header)"
          >
            <slot :name="getSlotName('header', header)" :data="header">
              <div
                class="group inline-flex"
                :class="{ 'cursor-pointer': header.sortable }"
              >
                {{ header.title }}
                <template v-if="header.sortable === true">
                  <span
                    v-if="sorting.column !== getHeaderKey(header)"
                    class="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible"
                  >
                    &darr;
                  </span>
                  <span
                    v-else
                    class="ml-2 flex-none px-1.5 pb-0.5 text-gray-900 group-hover:text-gray-600"
                  >
                    <span v-if="sorting.order === 'asc'"> &uarr; </span>
                    <span v-else> &darr; </span>
                  </span>
                </template>
              </div>
            </slot>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 bg-white">
        <tr
          v-for="(values, key) in data"
          :key="key"
          class="odd:bg-white even:bg-gray-100 hover:bg-gray-200"
          :class="`row-${key}`"
          :style="getRowStyles(values)"
        >
          <template v-for="(header, headerKey) in headers" :key="headerKey">
            <td
              class="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0"
            >
              <slot :name="getSlotName('body', header)" :data="values">
                {{ getValue(values, header) }}
              </slot>
            </td>
          </template>
        </tr>
        <tr />
      </tbody>
      <tfoot v-if="footer">
        <tr>
          <td
            v-for="(header, key) in headers"
            :key="key"
            class="py-4 pl-4 pr-3 text-sm font-bold text-gray-900 sm:pl-0"
          >
            <slot :name="getSlotName('footer', header)" :data="footer">
              {{ getValue(footer, header) }}
            </slot>
          </td>
        </tr>
      </tfoot>
    </table>
    <div
      v-if="!data?.length && !loading"
      class="flex justify-center font-light"
    >
      {{ noData ?? "No data found." }}
    </div>
    <TablePagination
      v-if="pagination"
      :pagination="pagination"
      @page-change="emit('pageChange', $event)"
    />
  </div>
</template>
