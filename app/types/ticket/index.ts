import type { TicketState } from "@ordinary/api-types";

export type TicketFilter = {
  state: TicketState | null;
  id: number | null;
};
