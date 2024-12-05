<script lang="ts" setup>
import { ref, computed } from "vue";
import { useField } from "vee-validate";

export interface Props {
  name: string;
  label?: string;
  items: { label: string; value: string | number | null }[];
  disabled?: boolean;
  clearable?: boolean;
  addable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  clearable: false,
  label: "",
  addable: false,
});

const emit = defineEmits(["change", "add"]);

const isDropdownOpen = ref(false);
const hover = ref(false);

const selectedLabel = computed(() => {
  const selected = props.items.find((item) => item.value === value.value);
  return selected ? selected.label : "";
});

const toggleDropdown = () => {
  if (!props.disabled) {
    isDropdownOpen.value = !isDropdownOpen.value;
  }
};

const select = (option: string | number | null) => {
  if (props.disabled) {
    return;
  }
  handleChange(option);
  emit("change");
  isDropdownOpen.value = false;
};

const clearSelect = () => {
  if (props.disabled) {
    return;
  }
  handleChange(null);
  emit("change");
};

const { errors, handleChange, value } = useField(props.name, undefined, {
  validateOnValueUpdate: false,
});

const hasErrors = computed(() => {
  return errors.value.length > 0;
});
</script>

<template>
  <div class="group relative" tabindex="0" @blur="isDropdownOpen = false">
    <label
      v-if="label"
      :for="name"
      class="mb-1 ml-1 block font-medium text-gray-700"
    >
      {{ label }}
    </label>
    <div class="flex">
      <div
        class="select flex w-full justify-between border border-gray-300 p-2 shadow-sm"
        :class="{
          'rounded-l-md': addable,
          'rounded-md': !addable,
          'bg-white': !hasErrors && !disabled,
          'bg-red-50 text-red-700 ring-red-500': hasErrors,
          'cursor-not-allowed bg-gray-100': disabled,
          'group-focus:ring-primary group-focus:border-white group-focus:outline-none group-focus:ring-1':
            !disabled,
        }"
        @click="toggleDropdown"
        @mouseover="hover = true"
        @mouseleave="hover = false"
      >
        <span class="overflow-hidden">
          {{ selectedLabel }}
        </span>
        <div class="block">
          <Icon
            v-if="clearable && hover && selectedLabel"
            icon="x"
            class="clear-icon mr-2 cursor-pointer"
            style="line-height: inherit"
            @click="clearSelect"
          />
          <Icon
            :icon="isDropdownOpen ? 'chevron-top' : 'chevron-bottom'"
            style="line-height: inherit"
          />
        </div>
      </div>
      <div
        v-if="addable"
        class="select-add-button flex items-center justify-center rounded-r-md bg-green-500 px-2 text-white hover:bg-green-400 active:bg-green-300 disabled:bg-green-200 group-focus:ring-1 group-focus:ring-green-500"
        @click="emit('add')"
      >
        <Icon icon="plus" class="mt-1" />
      </div>
    </div>
    <Dropdown :show="isDropdownOpen" :items="items" @select="select">
      <template #default="{ data }">
        <slot :data="data" />
      </template>
    </Dropdown>
    <p v-for="(error, key) in errors" :key="key" class="text-red-600">
      {{ error }}
    </p>
  </div>
</template>
