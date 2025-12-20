<script lang="ts" setup>
import {
  ApplicationSubmissionState,
  type ApplicationSubmissionData,
} from "@OrdinarySMP/api-types";
import type { FullResponse } from "@/types/response";

const { data } = await useApi<FullResponse<ApplicationSubmissionData[]>>(
  "/application-submission",
  {
    params: {
      full: true,
      "filter[state]": ApplicationSubmissionState.Pending,
    },
  },
);
</script>

<template>
  <UCard v-if="hasPermissionTo('applicationSubmission.read')" variant="subtle">
    <template #header>
      Pending Applications
      <UBadge variant="subtle">{{ data?.data?.length }}</UBadge>
    </template>

    <div class="grid grid-cols-3 gap-4">
      <p>Application</p>
      <p>Member</p>
      <p>View</p>
      <template v-for="(submission, key) in data?.data" :key="key">
        <p>{{ submission.application?.name }}</p>
        <p>
          {{
            submission.member?.nick ??
            submission.member?.user?.global_name ??
            submission.member?.user?.username ??
            submission.discord_id
          }}
        </p>
        <div>
          <UButton
            label="View"
            size="md"
            icon="material-symbols:search-rounded"
            type="button"
            variant="subtle"
            :to="`/application/submission/view/${submission.id}`"
          />
        </div>
      </template>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <UButton
          label="To the applications"
          size="md"
          variant="subtle"
          to="/application/submission"
        />
      </div>
    </template>
  </UCard>
</template>
