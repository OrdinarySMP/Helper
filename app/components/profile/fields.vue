<script lang="ts" setup>
import type { Profile } from "@/types/profile";
const model = defineModel<Partial<Profile>>({ required: true });
const showPassword = ref(false);
const showPasswordConfirmation = ref(false);
</script>

<template>
  <UFormField label="Password" name="password" required>
    <UInput
      v-model="model.password"
      placeholder="Password"
      :type="showPassword ? 'text' : 'password'"
      :ui="{ trailing: 'pe-1' }"
      class="w-full"
    >
      <template #trailing>
        <UButton
          color="neutral"
          variant="link"
          size="sm"
          :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
          :aria-label="showPassword ? 'Hide password' : 'show password'"
          :aria-pressed="showPassword"
          aria-controls="password"
          @click="showPassword = !showPassword"
        />
      </template>
    </UInput>
  </UFormField>
  <UFormField label="Confirm password" name="password_confirmation" required>
    <UInput
      v-model="model.password_confirmation"
      placeholder="Password"
      :type="showPasswordConfirmation ? 'text' : 'password'"
      :ui="{ trailing: 'pe-1' }"
      class="w-full"
    >
      <template #trailing>
        <UButton
          color="neutral"
          variant="link"
          size="sm"
          :icon="showPasswordConfirmation ? 'i-lucide-eye-off' : 'i-lucide-eye'"
          :aria-label="
            showPasswordConfirmation ? 'Hide password' : 'show password'
          "
          :aria-pressed="showPasswordConfirmation"
          aria-controls="password"
          @click="showPasswordConfirmation = !showPasswordConfirmation"
        />
      </template>
    </UInput>
  </UFormField>
</template>
