<script lang="ts" setup>
import { ref, computed } from "vue";
import { useField } from "vee-validate";

export interface Props {
  name: string;
  label?: string;
  items: { label: string; value: string | number }[];
  disabled?: boolean;
  clearable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  clearable: false,
  label: "",
});

const emit = defineEmits(["change"]);

const isDropdownOpen = ref(false);
const hover = ref(false);

const selectedLabel = computed(() => {
  const labels: Array<string | number> = [];
  value.value?.forEach((selectedValue) => {
    const selected = props.items.find((item) => item.value === selectedValue);
    if (selected) {
      labels.push(selected.label);
    }
  });
  return labels.join(", ");
});

const toggleDropdown = () => {
  if (!props.disabled) {
    isDropdownOpen.value = !isDropdownOpen.value;
  }
};

const select = (option: string | number | null) => {
  if (props.disabled || !option) {
    return;
  }
  const data = [...(value.value ?? [])];
  if (data?.includes(option)) {
    const index = data.indexOf(option);
    if (index !== -1) {
      data.splice(index, 1);
    }
  } else {
    data.push(option);
  }
  handleChange(data, true);

  isDropdownOpen.value = false;
};

const clearSelect = () => {
  if (props.disabled) {
    return;
  }
  handleChange([]);
  emit("change");
};

const { errors, handleChange, value } = useField<Array<string | number>>(
  props.name,
  undefined,
  {
    validateOnValueUpdate: false,
  },
);

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
    <div
      class="select flex w-full justify-between rounded-md border border-gray-300 p-2 shadow-sm"
      :class="{
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
      <span>
        {{ selectedLabel !== "" ? selectedLabel : "&nbsp;" }}
      </span>
      <div>
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
