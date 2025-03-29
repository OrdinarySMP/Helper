import type { Application } from "@/types/application";

export type ApplicationQuestion = {
  id: number;
  order: number;
  question: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  application_id: Application["id"];
};
