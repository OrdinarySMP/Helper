import type { UserData } from "@OrdinarySMP/api-types";

export const useCurrentUser = () => {
  return useSanctumUser<UserData>();
};
