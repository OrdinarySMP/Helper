<script lang="ts" setup>
export interface Props {
  show: boolean;
  items: { label: string; value: string | number | boolean | null }[];
}

defineProps<Props>();

const emit = defineEmits<{
  (e: "select", value: string | number | boolean | null): void;
}>();
</script>

<template>
  <ul
    v-if="show"
    class="options absolute z-20 w-full rounded-md border border-gray-300 bg-white shadow-md"
  >
    <li
      v-for="(item, key) in items"
      :key="key"
      class="mx-1 cursor-pointer select-none break-all rounded-lg p-2 first:mt-1 last:mb-1 hover:bg-blue-500 hover:text-white"
      :class="`dropdown-item-${key}`"
      @click="emit('select', item.value)"
    >
      <slot :data="item">
        {{ item.label }}
      </slot>
    </li>
  </ul>
</template>
