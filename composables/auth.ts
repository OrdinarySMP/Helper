// import { User } from "@/types/user";
// import { ValidateResponse } from "@/types/response";

export const useAuth = () => {
  const user = () => useState<any | undefined>("user", () => undefined);

  const check = user().value !== undefined;

  const guest = user().value === undefined;

  const logout = () => {
    user().value = undefined;
  };

  const bootstrap = async () => {
    await useApi(`/csrf-cookie`, {
      method: "get",
    });

    const { data, error } = await useApi<any>("/me", {
      method: "get",
    });

    if (error.value) {
      user().value = undefined;
      return;
    }
    if (Object.keys(data.value ?? {}).length === 0) {
      user().value = undefined;
    } else {
      user().value = data.value;
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
