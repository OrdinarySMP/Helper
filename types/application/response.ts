import type { Application } from "@/types/application";

export type ApplicationResponse = {
  id: number;
  type: ApplicationResponseType;
  name: string;
  response: string;
  created_at: string;
  updated_at: string;
  application_id: Application["id"];
};

export enum ApplicationResponseType {
  Accepted = 0,
  Denied = 1,
}
