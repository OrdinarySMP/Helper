import type { LocationQueryValue } from "vue-router";

export const parseRouteParameter = (
  param: string | string[] | LocationQueryValue[],
): number => {
  if (typeof param === "object") {
    const value = parseInt(param[0] ?? "");
    return Number.isNaN(value) ? 0 : value;
  }

  const value = parseInt(param);
  return Number.isNaN(value) ? 0 : value;
};

export const parseRouteParameterString = (
  param: string | string[] | LocationQueryValue[],
): string => {
  if (typeof param === "object") {
    return `${param[0]}`;
  }
  return `${param}`;
};

export const hasPermissionTo = (permission: string): boolean => {
  const user = useAuth().user().value;
  if (!user) {
    return false;
  }
  return user.permissions.includes(permission) || user.is_owner;
};
