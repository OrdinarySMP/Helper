<script lang="ts" setup>
import { ref, watchEffect } from "vue";
import { ChevronLeftIcon } from "@heroicons/vue/24/solid";

const props = withDefaults(
  defineProps<{ title: string; groupKey?: number; isExpanded?: boolean }>(),
  {
    isExpanded: false,
    groupKey: undefined,
  },
);

const emit = defineEmits<{
  (e: "expand", value: { groupKey?: number; value: boolean }): void;
}>();

const expand = ref(false);

const toggleExpand = () => {
  expand.value = !expand.value;
  emit("expand", {
    groupKey: props.groupKey,
    value: expand.value,
  });
};

watchEffect(() => {
  expand.value = props.isExpanded;
});
</script>

<template>
  <div class="border-b border-gray-600 py-2">
    <div
      class="flex cursor-pointer items-center justify-between"
      data-testid="accordion"
      @click="toggleExpand"
    >
      <p class="accordion-title text-base font-semibold leading-7">
        {{ title }}
      </p>
      <ChevronLeftIcon
        class="size-4 mt-1"
        :class="[expand ? 'rotate-90' : '-rotate-90']"
      />
    </div>
    <div v-show="expand" class="mt-2">
      <slot />
    </div>
  </div>
</template>
