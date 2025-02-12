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
  created_at: string;
  updated_at: string;
};

export type ButtonFilter = {
  ticket_panel_id: Panel["id"] | null;
  ticket_team_id: Team["id"] | null;
};
