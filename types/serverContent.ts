export type ServerContent = {
  id: number;
  name: string;
  url: string;
  description: string;
  is_recommended: boolean;
  created_at: string;
  updated_at: string;
};

export type ServerContentFilter = {
  name: string | null;
  is_recommended: boolean | null;
};

export type ServerContentMessage = {
  id: number;
  heading: string;
  not_recommended: string;
  recommended: string;
  created_at: string;
  updated_at: string;
};
