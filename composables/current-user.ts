import type { User } from "@/types/ticket/user";

export const useCurrentUser = () => {
  return useSanctumUser<User>()
}
