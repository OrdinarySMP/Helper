export type PermissionTemplate = {
  [key: string]: string[];
};

export type Permission = {
  role: string;
  permissions: string[];
};

export type PermissionMap = {
  role: string;
  permissions: Record<string, Record<string, boolean>>;
};
