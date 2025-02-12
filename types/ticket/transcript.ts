import type { User } from "@/types/discord";
import type { Ticket } from "@/types/ticket";

export type Transcript = {
  id: number;
  ticket_id: Ticket["id"];
  discord_user_id: User["id"];
  message_id: string;
  message?: string;
  attachments?: string;
  embeds?: string;
  created_at: string;
  updated_at: string;
  user?: User;
};
