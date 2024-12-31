<script lang="ts" setup>
import { useField } from "vee-validate";

interface Props {
  name: string;
  label?: string;
  disabled?: boolean;
  size?: "sm" | "md";
}

const props = withDefaults(defineProps<Props>(), {
  label: "",
  disabled: false,
  size: "md",
});

const emit = defineEmits<{
  (e: "change"): void;
}>();

const { errors, value } = useField(props.name, undefined, {
  validateOnValueUpdate: false,
});

const setValue = () => {
  if (!props.disabled) {
    value.value = !value.value;
    emit("change");
  }
};
</script>

<template>
  <div class="flex items-center">
    <button
      type="button"
      class="relative inline-flex shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
      :class="{
        'bg-indigo-600': value,
        'bg-gray-200': !value,
        'cursor-not-allowed bg-gray-400': disabled,
        'cursor-pointer': !disabled,
        'h-4 w-7': size === 'sm',
        'h-6 w-11': size === 'md',
      }"
      role="switch"
      @click="setValue"
    >
      <span class="sr-only">Use setting</span>
      <span
        class="pointer-events-none relative inline-block size-3 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
        :class="{
          'translate-x-0': !value,
          'translate-x-3': value && size === 'sm',
          'translate-x-5': value && size === 'md',
          'size-3': size === 'sm',
          'size-5': size === 'md',
        }"
      >
        <span
          class="absolute inset-0 flex size-full items-center justify-center transition-opacity"
          :class="
            value
              ? 'opacity-0 duration-100 ease-out'
              : 'opacity-100 duration-200 ease-in'
          "
        >
          <svg class="size-3 text-gray-400" fill="none" viewBox="0 0 12 12">
            <path
              d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <span
          class="absolute inset-0 flex size-full items-center justify-center transition-opacity"
          :class="
            value
              ? 'opacity-100 duration-200 ease-in'
              : 'opacity-0 duration-100 ease-out'
          "
        >
          <svg
            class="size-3 text-indigo-600"
            fill="currentColor"
            viewBox="0 0 12 12"
          >
            <path
              d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z"
            />
          </svg>
        </span>
      </span>
    </button>
    <span class="ml-3 text-sm">
      <span class="select-none font-medium text-gray-900" @click="setValue">{{
        label
      }}</span>
    </span>
    <p v-for="(error, key) in errors" :key="key" class="text-red-600">
      {{ error }}
    </p>
  </div>
</template>
