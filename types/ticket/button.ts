import type { TicketPanelData, TicketTeamData } from "@ordinary/api-types";

export type ButtonFilter = {
  ticket_panel_id: TicketPanelData["id"] | null;
  ticket_team_id: TicketTeamData["id"] | null;
};
