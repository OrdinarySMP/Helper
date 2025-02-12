<script lang="ts" setup>
import { ref } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useForm } from "vee-validate";
import type { TextChannel } from "@/types/discord";

if (!hasPermissionTo("ticketPanel.create")) {
  await navigateTo("/ticket/panel");
}

const errorMessage = ref("");
const textChannels = ref<{ label: string; value: string }[]>([]);
const loading = ref(true);

const formSchema = toTypedSchema(
  zod.object({
    title: zod.string().min(1).max(100),
    message: zod.string().min(1).max(100),
    embed_color: zod.string().min(7).max(7),
    channel_id: zod.string(),
  }),
);

const { handleSubmit, setErrors, isSubmitting } = useForm({
  validationSchema: formSchema,
});

const save = handleSubmit(async (values) => {
  errorMessage.value = "";

  const { error } = await useApi("/ticket/panel", {
    method: "post",
    body: values,
  });

  if (error.value) {
    errorMessage.value = error.value.data.message;
    setErrors(error.value.data.errors ?? []);
  } else {
    navigateTo("/ticket/panel");
  }
});

const loadTextChannels = async () => {
  const { data, error } = await useApi<TextChannel[]>(
    "/discord/text-channels",
    {
      method: "get",
    },
  );

  if (error.value) {
    useNotification().error(
      "Could not load text channels!",
      error.value.data.message,
    );
  }

  textChannels.value =
    data.value
      ?.map((channel): { label: string; value: string } => ({
        label: channel.name,
        value: channel.id,
      }))
      .sort((a, b) => a.label.localeCompare(b.label)) ??
    ([] as { label: string; value: string }[]);
};

onMounted(async () => {
  loading.value = true;
  await loadTextChannels();
  loading.value = false;
});

useHead({
  title: "Create Ticket Panel",
});
</script>

<template>
  <div class="flex grow">
    <div class="w-full">
      <p class="mb-8 text-2xl">Create Panel</p>
      <form class="grid grid-cols-1 gap-4" @submit.prevent="save">
        <FieldInput name="title" label="Title" />
        <FieldInput name="message" label="Message" />
        <FieldInput name="embed_color" type="color" label="Color" />
        <FieldSelect :items="textChannels" name="channel_id" label="Channel" />

        <div>
          <Button
            :disabled="isSubmitting"
            :loading="isSubmitting"
            class="mr-2 px-4"
            size="md"
            type="submit"
          >
            Save
          </Button>
          <span v-if="errorMessage" class="text-red-600">{{
            errorMessage
          }}</span>
        </div>
      </form>
    </div>
  </div>
</template>
