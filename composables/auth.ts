import type { User } from "@/types/user";

export const useAuth = () => {
  const user = () => useState<User | undefined>("user", () => undefined);

  const check = user().value !== undefined;

  const guest = user().value === undefined;

  const logout = () => {
    user().value = undefined;
  };

  const bootstrap = async () => {
    await useApi("/csrf-cookie", {
      method: "get",
    });

    const { data, error } = await useApi<User>("/me", {
      method: "get",
    });

    if (error.value) {
      user().value = undefined;
      return;
    }
    if (Object.keys(data.value ?? {}).length === 0) {
      user().value = undefined;
    } else {
      user().value = data.value ?? undefined;
    }
  };

  return {
    user,
    check,
    guest,
    logout,
    bootstrap,
  };
};
