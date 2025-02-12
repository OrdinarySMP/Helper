import type { TextChannel, User } from "@/types/discord";
import type { Button } from "@/types/ticket/button";
import type { Transcript } from "@/types/ticket/transcript";

export type Ticket = {
  id: number;
  ticket_button_id: Button["id"];
  channel_id: TextChannel["id"];
  channel_name: string;
  state: TicketState;
  created_by_discord_user_id: string;
  closed_by_discord_user_id?: string;
  closed_reason?: string;
  created_at: string;
  updated_at: string;
  ticket_transcripts?: Transcript[];
  closed_by_discord_user?: User;
  created_by_discord_user?: User;
  ticket_button?: Button;
};

export enum TicketState {
  Open = 0,
  Closed = 1,
}

export type TicketFilter = {
  state: TicketState | null;
  id: number | null;
};
