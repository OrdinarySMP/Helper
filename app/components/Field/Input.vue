<script setup lang="ts">
import { useField } from "vee-validate";
import { computed } from "vue";

export interface Props {
  name: string;
  type?: "text" | "email" | "password" | "number" | "color";
  step?: number;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  on?: Record<string | number, unknown>;
  autocomplete?: string;
  datalist?: { label: string; value: string | number }[];
}

const showDatalist = ref(false);
const slots = useSlots();
const input = ref<HTMLInputElement | undefined>();

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  step: 1,
  label: "",
  placeholder: "",
  disabled: false,
  autocomplete: "on",
  datalist: undefined,
  on: () => {
    return {};
  },
});

const { errors, handleChange, value } = useField(props.name, undefined, {
  validateOnValueUpdate: false,
});

const setValue = (data: string) => {
  handleChange(data);
  input.value?.focus();
  showDatalist.value = false;
};

const hasErrors = computed(() => {
  return errors.value.length > 0;
});
</script>

<template>
  <div>
    <label
      v-if="label || slots.label"
      :for="name"
      class="mb-1 ml-1 block font-medium text-gray-700"
    >
      <slot name="label">
        {{ label }}
      </slot>
    </label>
    <div class="relative rounded-md shadow-sm">
      <input
        :id="name"
        ref="input"
        v-model="value"
        :type="type"
        :name="name"
        class="focus:ring-primary block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-white focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:bg-slate-100"
        :class="{
          'bg-red-50 text-red-700 ring-red-500': hasErrors,
          'pr-8': type === 'number' && slots.icon,
        }"
        :placeholder="placeholder"
        :disabled="disabled"
        :step="step"
        :autocomplete="autocomplete"
        @change="handleChange"
        @click="showDatalist = true"
        v-on="on"
      >
      <div
        v-if="slots.icon"
        class="absolute inset-y-0 right-0 flex items-center pr-3"
      >
        <slot name="icon" />
      </div>
      <Dropdown
        v-if="datalist?.length"
        class="input-dropdown"
        :show="showDatalist"
        :items="datalist"
        @select="setValue(`${$event}`)"
      />
    </div>
    <p v-for="(error, key) in errors" :key="key" class="text-red-600">
      {{ error }}
    </p>
  </div>
</template>
