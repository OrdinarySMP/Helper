import type { LaravelValidationErrors, NuxtUiFormErrors } from "@/types/form";

export const parseRouteParameter = (
  param: string | string[] | undefined,
): number => {
  if (typeof param === "object") {
    const value = parseInt(param[0] ?? "");
    return Number.isNaN(value) ? 0 : value;
  }

  const value = parseInt(param ?? "");
  return Number.isNaN(value) ? 0 : value;
};

export const hasPermissionTo = (permission: string): boolean => {
  const user = useCurrentUser().value;
  if (!user) {
    return false;
  }
  return user.permissions.includes(permission) || user.is_owner;
};

// replace with enum from api
export const discordButtonItems = [
  {
    label: "Primary",
    value: 1,
    color: "#5865f2",
  },
  {
    label: "Secondary",
    value: 2,
    color: "#4e5058",
  },
  {
    label: "Success",
    value: 3,
    color: "#248045",
  },
  {
    label: "Danger",
    value: 4,
    color: "#da373c",
  },
];

export function laravelValidationErrorToNuxtUiForm(
  response: LaravelValidationErrors,
): NuxtUiFormErrors {
  return Object.entries(response.errors).map(([name, messages]) => {
    const baseName = name.split(".")[0];
    return {
      name: baseName ?? "",
      message: messages.join(" "),
    };
  });
}
