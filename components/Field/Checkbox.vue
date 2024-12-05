<script lang="ts" setup>
import { useField } from "vee-validate";
import { computed } from "vue";

export interface Props {
  name: string;
  label?: string;
  disabled?: boolean;
  trueValue?: string | number | true;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  label: "",
  trueValue: true,
});

const { errors, handleChange, value } = useField<string | number | boolean>(
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
  <div class="relative flex items-start">
    <div class="flex h-6 items-center">
      <input
        :id="`${name}-${trueValue}`"
        :name="name"
        type="checkbox"
        :checked="trueValue === value"
        :value="value"
        :disabled="disabled"
        class="focus:ring-primary size-5 rounded-md border border-gray-300 p-2 shadow-sm focus:border-white focus:outline-none focus:ring-1 disabled:cursor-not-allowed"
        :class="{ 'bg-red-50 text-red-700 ring-red-500': hasErrors }"
        @click="handleChange(trueValue === value ? false : trueValue)"
      />
    </div>
    <div class="ml-2 leading-6">
      <label
        :for="`${name}-${trueValue}`"
        class="mb-1 block font-medium"
        :class="{
          'cursor-not-allowed text-gray-500': disabled,
          'text-gray-700': !disabled,
        }"
      >
        <slot>
          {{ label }}
        </slot>
      </label>
      <p v-for="(error, key) in errors" :key="key" class="text-red-600">
        {{ error }}
      </p>
    </div>
  </div>
</template>
