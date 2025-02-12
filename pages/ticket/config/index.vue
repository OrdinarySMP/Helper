<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useForm } from "vee-validate";
import type { Config } from "@/types/ticket/config";
import type { TextChannel, Category } from "@/types/discord";

if (!hasPermissionTo("ticketConfig.read")) {
  await navigateTo("/ticket");
}

const loading = ref(true);
const errorMessage = ref("");
const textChannels = ref<{ label: string; value: string }[]>([]);
const categories = ref<{ label: string; value: string }[]>([]);

const formSchema = toTypedSchema(
  zod.object({
    category_id: zod.string().min(1).max(20),
    transcript_channel_id: zod.string().min(1).max(20),
  }),
);

const { handleSubmit, setErrors, isSubmitting, setFieldValue } = useForm({
  validationSchema: formSchema,
});

const save = handleSubmit(async (values) => {
  errorMessage.value = "";

  const { error } = await useApi("/ticket/config", {
    method: "post",
    body: values,
  });

  if (error.value) {
    errorMessage.value = error.value.data.message;
    setErrors(error.value.data.errors ?? []);
  } else {
    navigateTo("/ticket");
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

const loadCategories = async () => {
  const { data, error } = await useApi<Category[]>("/discord/categories", {
    method: "get",
  });

  if (error.value) {
    useNotification().error(
      "Could not load text channels!",
      error.value.data.message,
    );
  }

  categories.value =
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

  const { data } = await useApi<{ data: Config }>("/ticket/config", {
    method: "get",
  });

  if (data.value) {
    setFieldValue("category_id", data.value.data.category_id);
    setFieldValue(
      "transcript_channel_id",
      data.value.data.transcript_channel_id,
    );
  }

  loading.value = false;
});

const canCreate = computed(() => hasPermissionTo("ticketConfig.create"));

onMounted(async () => {
  loading.value = true;
  await loadTextChannels();
  await loadCategories();
  loading.value = false;
});

useHead({
  title: "Mod/Datapack Messages",
});
</script>

<template>
  <div class="flex grow">
    <div v-if="loading" class="flex grow items-center justify-center">
      <Spinner />
    </div>
    <div v-else class="w-full">
      <p class="mb-8 text-2xl">Ticket Config</p>
      <form class="grid grid-cols-1 gap-4" @submit.prevent="save">
        <FieldSelect :items="categories" name="category_id" label="Category" />

        <FieldSelect
          :items="textChannels"
          name="transcript_channel_id"
          label="Transcript Channel"
        />

        <div>
          <Button
            :disabled="isSubmitting || !canCreate"
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
