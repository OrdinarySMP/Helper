<script lang="ts" setup>
import { computed } from "vue";

export interface Props {
  type?: "button" | "submit" | "reset";
  size?: "xl" | "md" | "sm";
  color?: "gray" | "primary" | "success" | "error" | "warning";
  backgroundColor?: string;
  textColor?: string;
  disabled?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  color: "primary",
  type: "button",
  size: "xl",
  disabled: false,
  backgroundColor: "bg-primary",
  textColor: "text-white",
  loading: false,
});

const classes = computed(() => {
  const classes = [];
  switch (props.size) {
    case "xl":
      classes.push("text-xl");
      break;
    case "sm":
      classes.push("text-sm");
      break;
    default:
      classes.push("text-md");
      break;
  }

  switch (props.color) {
    case "gray":
      classes.push(
        "bg-gray-300",
        "hover:bg-gray-200",
        "active:bg-gray-100",
        "disabled:bg-gray-400",
        "text-black",
      );
      break;
    case "success":
      classes.push(
        "bg-green-500",
        "hover:bg-green-400",
        "active:bg-green-300",
        "disabled:bg-green-600",
        "text-white",
      );
      break;
    case "error":
      classes.push(
        "bg-red-500",
        "hover:bg-red-400",
        "active:bg-red-300",
        "disabled:bg-red-600",
        "text-white",
      );
      break;
    case "warning":
      classes.push(
        "bg-yellow-400",
        "hover:bg-yellow-300",
        "active:bg-yellow-200",
        "disabled:bg-yellow-500",
        "text-black",
      );
      break;
    default:
      classes.push(
        "bg-blue-500",
        "hover:bg-blue-400-hover",
        "active:bg-blue-300-focus",
        "disabled:bg-blue-500-disabled",
        "text-white",
      );
      break;
  }
  return classes;
});
</script>

<template>
  <button
    :type="type"
    class="relative inline-flex items-center justify-center rounded py-2 font-bold transition duration-300 ease-in-out disabled:cursor-not-allowed"
    :class="classes"
    :disabled="disabled"
  >
    <Spinner v-show="loading" class="absolute !h-5 !w-5" />
    <span :class="{ invisible: loading }">
      <slot />
    </span>
  </button>
</template>
