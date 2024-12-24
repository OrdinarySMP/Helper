<script setup lang="ts">
import { useField } from "vee-validate";
import { computed } from "vue";

export interface Props {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  autocomplete?: string;
}

const inputValue = ref("");

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  label: "",
  placeholder: "",
  disabled: false,
  autocomplete: "on",
});

const { errors, value } = useField<string[]>(props.name, undefined, {
  validateOnValueUpdate: false,
});

const add = () => {
  if (!inputValue.value.trim()) {
    return;
  }
  if (!value.value) {
    value.value = [];
  }
  value.value.push(inputValue.value.trim());
  inputValue.value = "";
};

const hasErrors = computed(() => {
  return errors.value.length > 0;
});
</script>

<template>
  <div>
    <label
      v-if="label"
      :for="`${name}-add`"
      class="mb-1 ml-1 block font-medium text-gray-700"
    >
      <slot name="label">
        {{ label }}
      </slot>
    </label>
    <div v-if="value?.length" class="mb-2 flex flex-wrap gap-1">
      <Chip v-for="(item, key) in value" :key="key" color="#3b82f6">
        {{ item }}
        <Icon
          :id="`${name}-item-${key}`"
          class="cursor-pointer"
          icon="x"
          @click="value.splice(key, 1)"
        />
      </Chip>
    </div>
    <div class="flex">
      <input
        :id="`${name}-add`"
        v-model="inputValue"
        type="text"
        :name="`${name}-add`"
        class="focus:ring-primary peer w-full rounded-l-md border border-gray-300 p-2 shadow-sm focus:border-white focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:bg-slate-100"
        :class="{
          'bg-red-50 text-red-700 ring-red-500': hasErrors,
        }"
        :placeholder="placeholder"
        :disabled="disabled"
        :autocomplete="autocomplete"
      >
      <div
        :id="`${name}-add-button`"
        class="flex items-center justify-center rounded-r-md bg-green-500 px-2 text-white hover:bg-green-400 active:bg-green-300 disabled:bg-green-200 peer-focus:ring-1 peer-focus:ring-green-500"
        @click="add"
      >
        <Icon icon="plus" class="mt-1" />
      </div>
    </div>
    <p v-for="(error, key) in errors" :key="key" class="text-red-600">
      {{ error }}
    </p>
  </div>
</template>
