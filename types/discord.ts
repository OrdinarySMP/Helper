export type TextChannel = {
  id: string;
  type: number;
  last_message_id: string;
  flags: number;
  guild_id: string;
  name: string;
  parent_id: string;
  rate_limit_per_user: number;
  topic?: string;
  position: number;
  permission_overwrites: Array<unknown>;
  nsfw: boolean;
};

export type Category = {
  id: string;
  type: number;
  flags: number;
  guild_id: string;
  name: string;
  parent_id: string;
  position: number;
  permission_overwrites: Array<unknown>;
};

export type Role = {
  id: string;
  name: string;
  description?: string;
  permissions: string;
  position: number;
  color: number;
  hoist: boolean;
  managed: boolean;
  mentionable: boolean;
  icon?: string;
  unicode_emoji?: string;
  flags: number;
};

export type User = {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
  flags: number;
  banner?: string;
  accent_color: number;
  global_name: string;
  avatar_decoration_data?: string;
  banner_color: string;
  clan?: string;
  primary_guild?: string;
};

export type GifAttachment = {
  video: {
    width: number;
    url: string;
    proxy_url: string;
    placeholder_version: number;
    placeholder: string;
    height: number;
    flags: number;
  };
  url: string;
  type: "gifv";
  thumbnail: {
    width: number;
    url: string;
    proxy_url: string;
    placeholder_version: number;
    placeholder: string;
    height: number;
    flags: number;
  };
  provider: {
    url: string;
    name: string;
  };
  content_scan_version: number;
};

export type FileAttachment = {
  attachment: string;
  name: string;
  id: string;
  size: number;
  url: string;
  proxyURL: string;
  height: number;
  width: number;
  contentType: string;
  description: string | null;
  ephemeral: boolean;
  duration: string | number | null;
  waveform: string | number | null;
  flags: number;
  title: string | null;
};
