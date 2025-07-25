<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useForm } from "vee-validate";
import type { ApplicationSubmission } from "@/types/application/submission";
import { ApplicationSubmissionState } from "@/types/application/submission";
import type { PaginatedResponse } from "@/types/response";

if (!hasPermissionTo("applicationSubmission.read")) {
  await navigateTo("/");
}

const route = useRoute();
const applicationSubmissionId = ref<ApplicationSubmission["id"]>();
const applicationSubmission = ref<ApplicationSubmission>();
const toUpdateState = ref<ApplicationSubmissionState>();
const updateWithReasonDialog = ref(false);
const loading = ref(true);
const submitting = ref(false);
const { success: successNotification } = useNotification();

const formSchema = toTypedSchema(
  zod.object({
    reason: zod.string().min(1),
  }),
);

const { handleSubmit } = useForm({
  validationSchema: formSchema,
});

const updateSubmissionWithReason = handleSubmit(async (values) => {
  if (!toUpdateState.value) {
    return;
  }
  updateSubmission(toUpdateState.value, values.reason);
  toUpdateState.value = undefined;
  updateWithReasonDialog.value = false;
});

const updateSubmission = async (
  state: ApplicationSubmissionState,
  reason?: string,
) => {
  submitting.value = true;
  const { error } = await useApi(
    `/application-submission/${applicationSubmissionId.value}`,
    {
      method: "patch",
      body: {
        state,
        custom_response: reason,
        handled_by: useAuth().user().value?.discord_id,
      },
    },
  );
  if (error.value) {
    successNotification(
      error.value.data.message,
      error.value.data.errors.join(", "),
    );
  } else {
    loadApplicationSubmission();
  }
  submitting.value = false;
};

const loadApplicationSubmission = async () => {
  loading.value = true;
  applicationSubmissionId.value = parseRouteParameter(route.params.id);

  const { data } = await useApi<PaginatedResponse<ApplicationSubmission[]>>(
    "/application-submission",
    {
      method: "get",
      params: {
        "filter[id]": applicationSubmissionId.value,
        "include[]": [
          "applicationQuestionAnswers.applicationQuestion",
          "application",
        ],
      },
    },
  );
  if (!data.value || !data.value?.data[0]) {
    navigateTo("/application/submission");
    return;
  }

  applicationSubmission.value = data.value.data[0];

  loading.value = false;
};

const applicationQuestionAnswers = computed(() => {
  const applicationQuestionAnswers =
    applicationSubmission.value?.application_question_answers ?? [];
  return applicationQuestionAnswers.sort(
    (a, b) =>
      (a.application_question?.order ?? 0) -
      (b.application_question?.order ?? 0),
  );
});

const userName = computed(() => {
  return (
    applicationSubmission.value?.member?.nick ??
    applicationSubmission.value?.member?.user?.global_name ??
    applicationSubmission.value?.member?.user?.username ??
    applicationSubmission.value?.discord_id
  );
});

onMounted(() => {
  loadApplicationSubmission();
});

useHead({
  title: "Edit Application",
});
</script>

<template>
  <div class="flex grow">
    <div v-if="loading" class="flex grow items-center justify-center">
      <Spinner />
    </div>
    <div v-else class="w-full">
      <p class="mb-8 text-2xl">
        Application Submission from {{ userName }} for
        {{ applicationSubmission?.application?.name }}
      </p>
      <div class="grid grid-cols-1 gap-4">
        <div v-for="(answer, key) in applicationQuestionAnswers" :key="key">
          {{ key + 1 }}. {{ answer.application_question?.question }}
          <br />
          <div class="border p-2 rounded">
            {{ answer.answer }}
          </div>
        </div>

        <div
          v-if="
            applicationSubmission?.state ===
              ApplicationSubmissionState.Pending &&
            hasPermissionTo('applicationSubmission.update')
          "
          class="flex gap-2"
        >
          <Button
            class="mr-2 px-4"
            size="md"
            type="submit"
            color="success"
            :disabled="submitting"
            @click="updateSubmission(ApplicationSubmissionState.Accepted)"
          >
            Accept
          </Button>
          <Button
            class="mr-2 px-4"
            size="md"
            type="submit"
            color="error"
            :disabled="submitting"
            @click="updateSubmission(ApplicationSubmissionState.Denied)"
          >
            Deny
          </Button>
        </div>

        <div
          v-if="
            applicationSubmission?.state === ApplicationSubmissionState.Pending
          "
          class="flex gap-2"
        >
          <Button
            class="mr-2 px-4"
            size="md"
            type="submit"
            color="success"
            :disabled="submitting"
            @click="
              () => {
                toUpdateState = ApplicationSubmissionState.Accepted;
                updateWithReasonDialog = true;
              }
            "
          >
            Accept with reason
          </Button>
          <Button
            class="mr-2 px-4"
            size="md"
            type="submit"
            color="error"
            :disabled="submitting"
            @click="
              () => {
                toUpdateState = ApplicationSubmissionState.Denied;
                updateWithReasonDialog = true;
              }
            "
          >
            Deny with reason
          </Button>
        </div>
      </div>
    </div>
    <Dialog
      v-if="updateWithReasonDialog && toUpdateState"
      @close="
        () => {
          toUpdateState = undefined;
          updateWithReasonDialog = false;
        }
      "
    >
      <template #title>
        <p>Update application</p>
      </template>
      <template #body>
        <p class="mb-2">
          Do you want to update this application to
          {{ ApplicationSubmissionState[toUpdateState] }}?
        </p>
        <FieldTextArea name="reason" label="Reason" />
      </template>
      <template #footer>
        <Button
          class="ml-4 px-4"
          size="sm"
          @click="updateSubmissionWithReason()"
        >
          Update
        </Button>
        <Button
          class="px-4"
          color="gray"
          size="sm"
          @click="
            () => {
              toUpdateState = undefined;
              updateWithReasonDialog = false;
            }
          "
        >
          Cancel
        </Button>
      </template>
    </Dialog>
  </div>
</template>
