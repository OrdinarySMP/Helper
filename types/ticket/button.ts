import type { Role } from "@/types/discord";
import type { Team } from "@/types/ticket/team";
import type { Panel } from "@/types/ticket/panel";

export type Button = {
  id: number;
  ticket_team_id: Team["id"];
  ticket_panel_id: Panel["id"];
  text: string;
  color: number;
  initial_message: string;
  emoji: string;
  naming_scheme: string;
  disabled: boolean;
  ticket_button_ping_roles?: ButtonPingRole[];
  created_at: string;
  updated_at: string;
};

export type ButtonFilter = {
  ticket_panel_id: Panel["id"] | null;
  ticket_team_id: Team["id"] | null;
};

export type ButtonPingRole = {
  id: number;
  ticket_button_id: Button["id"];
  role_id: Role["id"];
  role_name: Role["name"];
  created_at: string | null;
  updated_at: string | null;
};
