<script lang="ts" setup>
import { ref, onMounted, watchEffect } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useForm } from "vee-validate";
import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/solid";

const config = useRuntimeConfig()
const route = useRoute();
const errorMessage = ref<string>();
const showPassword = ref(true)
const passwordType = ref<"password" | "text">("password")

const formSchema = toTypedSchema(
  zod.object({
    name: zod.string().min(1),
    password: zod.string().min(6),
  }),
);

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: "",
    password: "",
  },
});

const login = handleSubmit(async (values) => {
  const { error } = await useApi("/login", {
    method: "post",
    body: {
      name: values.name,
      password: values.password,
    },
  });

  if (error.value) {
    errorMessage.value = error.value.data.message;
    return;
  }

  await navigateTo("/");
});

const discordOAuthUrl = ref(
  `https://discord.com/oauth2/authorize?client_id=${config.public.discordClientId}&response_type=code&redirect_uri=${encodeURIComponent(`${config.public.discordCallbackUrl}`)}&scope=guilds+identify+guilds.members.read`,
);

definePageMeta({
  layout: "guest",
});

watchEffect(() => {
  passwordType.value = showPassword.value ? 'password' : 'text'
})

onMounted(() => {
  if ("noPermission" in route.query) {
    errorMessage.value = "You do not have the required permissions.";
  }
});
</script>

<template>
  <div class="flex h-full flex-1 flex-col py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2
        class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
      >
        Ordinary SMP
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <div
        class="border border-gray-100 bg-white px-6 py-12 shadow-lg sm:rounded-lg sm:px-12"
      >
        <form class="space-y-4" @submit.prevent="login">
          <FieldInput
            name="name"
            label="Username"
            placeholder="you@example.com"
          />
          <FieldInput
            :type="passwordType"
            name="password"
            label="Password"
            placeholder="******"
          >
            <template #icon>
              <EyeIcon
                v-if="showPassword"
                class="size-4 cursor-pointer"
                @click="showPassword = !showPassword"
              />
              <EyeSlashIcon
                v-else
                class="size-4 cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </FieldInput>

          <div>
            <span v-if="errorMessage" class="text-red-600">{{
              errorMessage
            }}</span>
          </div>
          <div class="flex gap-4">
            <Button
              class="px-2 font-bold"
              size="md"
              type="submit"
              :disabled="isSubmitting"
              :loading="isSubmitting"
            >
              Login
            </Button>
            <NuxtLink :to="discordOAuthUrl">
              <Button
                class="px-2 font-bold"
                size="md"
                :disabled="isSubmitting"
                :loading="isSubmitting"
              >
                Login with Discord
              </Button>
            </NuxtLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
