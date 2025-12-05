import type { UserData } from "@ordinary/api-types";

export const useCurrentUser = () => {
  return useSanctumUser<UserData>();
};
