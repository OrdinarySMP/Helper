<script setup lang="ts">
import * as z from "zod";
import type { AuthFormField } from "@nuxt/ui";
import type { Form } from "#ui/types";

const config = useRuntimeConfig();
const { login } = useSanctumAuth();
const discordOAuthUrl = ref(
  `https://discord.com/oauth2/authorize?client_id=${config.public.discordClientId}&response_type=code&redirect_uri=${encodeURIComponent(`${config.public.discordCallbackUrl}`)}&scope=guilds+identify+guilds.members.read`,
);

const fields: AuthFormField[] = [
  {
    name: "name",
    type: "text",
    label: "Name",
    placeholder: "Enter your Name",
    required: true,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    required: true,
  },
  {
    name: "remember",
    label: "Remember me",
    type: "checkbox",
  },
];

const providers = [
  {
    label: "Discord",
    icon: "i-simple-icons-discord",
    onClick: async () => {
      await navigateTo(discordOAuthUrl.value, { external: true });
    },
  },
];

const schema = z.object({
  name: z.string().min(1),
  password: z.string().min(6),
});

type Schema = z.output<typeof schema>;
const authForm = useTemplateRef<{ formRef: Form<Schema> }>("authForm");
const form = computed(() => authForm.value?.formRef);

const { onSubmit } = useApiForm(form, async (event) => {
  await login(event.data);
});

definePageMeta({
  layout: "guest",
});

useHead({
  title: "Login",
});
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        ref="authForm"
        title="Login"
        description="Enter your credentials to access your account."
        icon="i-lucide-user"
        :schema="schema"
        :fields="fields"
        :providers="providers"
        loading-auto
        @submit="onSubmit"
      >
        <template #leading>
          <div class="flex items-center justify-center">
            <AppLogo />
          </div>
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>
