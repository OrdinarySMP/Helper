import type { Application } from "@/types/application";
import type { ApplicationSubmission } from "@/types/application/submission";

export type ApplicationQuestion = {
  id: number;
  order: number;
  question: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  application_id: Application["id"];
};

export type ApplicationQuestionAnswer = {
  id: number;
  application_question_id: ApplicationQuestion["id"];
  answer: string;
  created_at: string;
  updated_at: string;
  application_submission_id: ApplicationSubmission["id"];
  attachments: string;
  application_question?: ApplicationQuestion;
};
