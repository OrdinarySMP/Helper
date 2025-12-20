<script lang="ts" setup>
import { ref, computed } from "vue";
import {
  ApplicationSubmissionState,
  type ApplicationSubmissionData,
} from "@OrdinarySMP/api-types";
import type { PaginatedResponse } from "@/types/response";

const user = useCurrentUser();
const route = useRoute();
const client = useApiClient();
const applicationSubmission = ref<ApplicationSubmissionData>();
const reason = ref();
const updateToState = ref<ApplicationSubmissionState>();
const submitting = ref(false);
const toast = useSimpleToast();

const { data } = await useApi<PaginatedResponse<ApplicationSubmissionData[]>>(
  "/application-submission",
  {
    method: "get",
    params: {
      "filter[id]": route.params.id,
      "include[]": [
        "applicationQuestionAnswers.applicationQuestion",
        "application",
      ],
    },
  },
);
applicationSubmission.value = data.value?.data[0];

const updateSubmission = async (state: ApplicationSubmissionState) => {
  submitting.value = true;
  const response = await client(`/application-submission/${route.params.id}`, {
    method: "patch",
    body: {
      state,
      custom_response: reason.value,
      handled_by: user.value?.discord_id,
    },
  });
  if (response?.data) {
    if (applicationSubmission.value) {
      applicationSubmission.value.state = state;
    }
    toast.success("Submission updated.");
  } else {
    toast.error("An error occoured while updating the Submission.");
  }
  updateToState.value = undefined;
  submitting.value = false;
};

const closeModal = () => {
  updateToState.value = undefined;
  reason.value = undefined;
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

definePageMeta({
  permission: {
    permission: "applicationSubmission.read",
  },
});

useHead({
  title: "View Application",
});
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar
        :title="`Application Submission from ${userName} for ${applicationSubmission?.application?.name}`"
      />
    </template>

    <template #body>
      <div class="grid grid-cols-1 gap-4">
        <div v-for="(answer, key) in applicationQuestionAnswers" :key="key">
          <p>{{ key + 1 }}. {{ answer.application_question?.question }}</p>
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
          <UButton
            label="Accept"
            type="button"
            color="success"
            variant="subtle"
            :disabled="submitting"
            @click="updateSubmission(ApplicationSubmissionState.Accepted)"
          />
          <UButton
            label="Deny"
            type="button"
            color="error"
            variant="subtle"
            :disabled="submitting"
            @click="updateSubmission(ApplicationSubmissionState.Denied)"
          />
        </div>

        <div
          v-if="
            applicationSubmission?.state === ApplicationSubmissionState.Pending
          "
          class="flex gap-2"
        >
          <UButton
            label="Accept with reason"
            color="success"
            type="button"
            variant="subtle"
            :disabled="submitting"
            @click="updateToState = ApplicationSubmissionState.Accepted"
          />
          <UButton
            label="Deny with reason"
            color="error"
            type="button"
            variant="subtle"
            :disabled="submitting"
            @click="updateToState = ApplicationSubmissionState.Denied"
          />
        </div>
      </div>

      <UModal
        v-if="updateToState"
        :open="updateToState !== undefined"
        title="Update Submission"
        :description="`Do you want to update this application to ${ApplicationSubmissionState[updateToState]}?`"
        @update:open="closeModal"
      >
        <template #body>
          <UFormField label="Reason" name="reason" required>
            <FieldsEditor v-model="reason" class="w-full" />
          </UFormField>

          <div class="flex justify-end gap-2 mt-4">
            <UButton
              label="Cancel"
              color="neutral"
              variant="subtle"
              size="md"
              @click="updateToState = undefined"
            />
            <UButton
              label="Update"
              variant="subtle"
              size="md"
              @click="updateSubmission(updateToState)"
            />
          </div>
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>
