<script lang="ts" setup>
import { ref } from "vue";
import type { ButtonProps } from "@nuxt/ui";

withDefaults(
  defineProps<{
    title: string;
    size?: ButtonProps["size"];
  }>(),
  {
    size: "sm",
  },
);

const open = ref(false);
const channel = ref<string>("");
const textChannels = ref(await loadTextChannels());

const send = () => {
  emit("select", channel.value);
  open.value = false;
};

const emit = defineEmits<{
  (e: "select", value: string): void;
}>();
</script>

<template>
  <UModal
    v-model:open="open"
    :title="title"
    description="Please select a channel."
  >
    <UButton
      :size="size"
      color="secondary"
      type="button"
      variant="subtle"
      :label="title"
    />

    <template #body>
      <div class="space-y-4">
        <UFormField label="Text Channel" name="channel" required>
          <USelectMenu
            v-model="channel"
            :items="textChannels"
            class="w-full"
            value-key="value"
            label-key="label"
          />
        </UFormField>

        <div class="flex justify-end gap-2">
          <UButton
            label="Cancel"
            color="neutral"
            variant="subtle"
            size="md"
            @click="open = false"
          />
          <UButton label="Select" size="md" @click="send" />
        </div>
      </div>
    </template>
  </UModal>
</template>
