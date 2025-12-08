<script lang="ts" setup>
import type { ReactionRoleData } from "@OrdinarySMP/api-types";
import EmojiPicker from "vue3-emoji-picker";
import "vue3-emoji-picker/css";

const model = defineModel<Partial<ReactionRoleData>>({ required: true });
const roles = ref(await loadRoles());
const showEmojiPicker = ref(false);

const onSelectEmoji = (data: { i: string }) => {
  model.value.emoji = data.i;
  showEmojiPicker.value = false;
};
</script>

<template>
  <UFormField label="Message link" name="message_link" required>
    <UInput
      v-model="model.message_link"
      class="w-full"
      :disabled="!!model.id"
    />
  </UFormField>
  <UFormField label="Emoji" name="emoji" required>
    <UInput v-model="model.emoji" class="w-full" :disabled="!!model.id">
      <template #trailing>
        <UIcon
          v-if="!model.id"
          name="ic:outline-emoji-emotions"
          @click="showEmojiPicker = !showEmojiPicker"
        />
        <div class="relative">
          <EmojiPicker
            v-if="showEmojiPicker"
            class="absolute z-10 right-0"
            :native="true"
            @select="onSelectEmoji"
          />
        </div>
      </template>
    </UInput>
  </UFormField>
  <UFormField label="Role" name="role_id" required>
    <USelectMenu
      v-model="model.role_id"
      :items="roles"
      class="w-full"
      value-key="value"
      label-key="label"
    />
  </UFormField>
</template>
