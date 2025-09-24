<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useForm } from "vee-validate";
import type { Panel } from "@/types/ticket/panel";
import type { PaginatedResponse } from "@/types/response";

if (!hasPermissionTo("ticketPanel.update")) {
  await navigateTo("/ticket/panel");
}

const route = useRoute();
const ticketPanelId = ref<Panel["id"]>();
const ticketPanel = ref<Panel>();
const loading = ref(true);
const errorMessage = ref("");
const textChannels = ref(await loadTextChannels());

const formSchema = toTypedSchema(
  zod.object({
    title: zod.string().min(1).max(100),
    message: zod.string().min(1).max(1000),
    embed_color: zod.string().min(7).max(7),
    channel_id: zod.string(),
  }),
);

const { handleSubmit, setErrors, isSubmitting, setFieldValue } = useForm({
  validationSchema: formSchema,
});

const save = handleSubmit(async (values) => {
  errorMessage.value = "";

  const { error } = await useApi(`/ticket/panel/${ticketPanelId.value}`, {
    method: "patch",
    body: values,
  });

  if (error.value) {
    errorMessage.value = error.value.data.message;
    setErrors(error.value.data.errors ?? []);
  } else {
    navigateTo("/ticket/panel");
  }
});

const sendPanel = async () => {
  const { data } = await useApi(`/ticket/panel/${ticketPanel.value?.id}/send`, {
    method: "post",
  });

  if (data.value) {
    useNotification().success(
      "Send panel",
      "The panel has been send successfully.",
    );
  } else {
    useNotification().error(
      "Send panel",
      "An error occurred while sending the panel. Please try again later. If this error persists, please report to the staff team.",
    );
  }
};

onMounted(async () => {
  loading.value = true;
  ticketPanelId.value = parseRouteParameter(route.params.id);

  const { data } = await useApi<PaginatedResponse<Panel[]>>("/ticket/panel", {
    method: "get",
    params: {
      "filter[id]": ticketPanelId.value,
    },
  });
  if (!data.value || !data.value?.data[0]) {
    navigateTo("/ticket/panel");
    return;
  }

  ticketPanel.value = data.value.data[0];

  setFieldValue("title", ticketPanel.value.title);
  setFieldValue("message", ticketPanel.value.message);
  setFieldValue("embed_color", ticketPanel.value.embed_color);
  setFieldValue("channel_id", ticketPanel.value.channel_id);

  loading.value = false;
});

useHead({
  title: "Edit Ticket Panel",
});
</script>

<template>
  <div class="flex grow">
    <div v-if="loading" class="flex grow items-center justify-center">
      <Spinner />
    </div>
    <div v-else class="w-full">
      <div class="flex justify-between items-center mb-8">
        <div class="flex items-center gap-4">
          <p class="text-2xl">Edit Ticket Panel</p>
        </div>
        <div class="flex items-center gap-4">
          <Button size="sm" class="px-2" color="primary" @click="sendPanel">
            <span class="flex items-center"> Send Panel </span>
          </Button>
        </div>
      </div>
      <form class="grid grid-cols-1 gap-4" @submit.prevent="save">
        <FieldInput name="title" label="Title" />
        <FieldTextArea name="message" label="Message" />
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
