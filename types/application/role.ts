import type { Role } from "@/types/discord";
import type { Application } from "@/types/application";

export type ApplicationRole = {
  id: number;
  application_id: Application["id"];
  role_id: Role["id"];
  type: ApplicationRoleType;
  created_at: string;
  updated_at: string;
};

export enum ApplicationRoleType {
  Restricted = 0,
  Accepted = 1,
  Denied = 2,
  Ping = 3,
  AcceptRemoval = 4,
  DenyRemoval = 5,
  Pending = 6,
}
