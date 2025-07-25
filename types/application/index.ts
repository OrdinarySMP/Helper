import type { TextChannel } from "@/types/discord";
import type { ApplicationRole } from "@/types/application/role";

export type Application = {
  id: number;
  guild_id: string;
  name: string;
  is_active: boolean;
  log_channel: TextChannel["id"];
  accept_message: string;
  deny_message: string;
  confirmation_message: string;
  completion_message: string;
  created_at: string;
  updated_at: string;
  restricted_roles: ApplicationRole[];
  accepted_roles: ApplicationRole[];
  denied_roles: ApplicationRole[];
  ping_roles: ApplicationRole[];
  accept_removal_roles: ApplicationRole[];
  deny_removal_roles: ApplicationRole[];
  pending_roles: ApplicationRole[];
  required_roles: ApplicationRole[];
};
