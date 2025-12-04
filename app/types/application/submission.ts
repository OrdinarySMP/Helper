import { ApplicationSubmissionState } from "@ordinary/api-types";

export type ApplicationSubmissionFilter = {
  state: ApplicationSubmissionState | null;
  discord_id: string | null;
};
