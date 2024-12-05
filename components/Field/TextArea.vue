<script lang="ts" setup>
import { useField } from "vee-validate";
import { computed } from "vue";

export interface Props {
  name: string;
  label?: string;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  rows: 4,
  disabled: false,
  placeholder: "",
  label: "",
});

const { errors, handleChange, value } = useField<string>(
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
  <div>
    <label
      v-if="label"
      :for="name"
      class="mb-1 ml-1 block font-medium text-gray-700"
    >
      {{ label }}
    </label>
    <textarea
      :id="name"
      v-model="value"
      :name="name"
      :rows="rows"
      class="focus:ring-primary block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-white focus:outline-none focus:ring-1"
      :class="{ 'bg-red-50 text-red-700 ring-red-500': hasErrors }"
      :placeholder="placeholder"
      :disabled="disabled"
      @change="handleChange"
    ></textarea>
    <p v-for="(error, key) in errors" :key="key" class="text-red-600">
      {{ error }}
    </p>
  </div>
</template>
