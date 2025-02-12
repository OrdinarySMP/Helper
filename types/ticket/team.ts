import type { Role } from "@/types/discord";

export type Team = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  ticket_team_roles: TeamRole[];
};

export type TeamRole = {
  id: number;
  ticket_team_id: Team["id"];
  role_id: Role["id"];
  role_name: Role["name"];
  created_at: string;
  updated_at: string;
};
