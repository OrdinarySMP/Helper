export type User = {
  id: number;
  discord_id: string;
  nickname: string;
  name: string;
  avatar: string;
  is_owner: boolean;
  permissions: string[];
  created_at: string;
  updated_at: string;
};
