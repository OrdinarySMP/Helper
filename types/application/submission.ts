import type { ApplicationResponse } from "@/types/application/response";
import type { Application } from "@/types/application";
import type { Member } from "@/types/discord";
import type { ApplicationQuestionAnswer } from "./question";

export type ApplicationSubmission = {
  id: number;
  discord_id: string;
  submitted_at: string;
  state: ApplicationSubmissionState;
  application_response_id: ApplicationResponse["id"] | null;
  custom_response: string | null;
  message_id: string;
  channel_id: string;
  handled_by: string;
  application_id: Application["id"];
  application?: Application;
  member?: Member;
  application_question_answers?: ApplicationQuestionAnswer[];
  created_at: string;
  updated_at: string;
};

export type ApplicationSubmissionFilter = {
  state: ApplicationSubmissionState | null;
  discord_id: string | null;
};

export enum ApplicationSubmissionState {
  InProgress = 0,
  Pending = 1,
  Accepted = 2,
  Denied = 3,
  Cancelled = 4,
}
