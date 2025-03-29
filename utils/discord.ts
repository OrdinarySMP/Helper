import type { TextChannel, Role } from "@/types/discord";

export const loadTextChannels = async (): Promise<
  { label: string; value: string }[]
> => {
  const { data, error } = await useApi<TextChannel[]>(
    "/discord/text-channels",
    {
      method: "get",
    },
  );

  if (error.value) {
    useNotification().error(
      "Could not load text channels!",
      error.value.data.message,
    );
  }

  return (
    data.value
      ?.map((channel): { label: string; value: string } => ({
        label: channel.name,
        value: channel.id,
      }))
      .sort((a, b) => a.label.localeCompare(b.label)) ??
    ([] as { label: string; value: string }[])
  );
};

export const loadRoles = async (): Promise<
  { label: string; value: string }[]
> => {
  const { data } = await useApi<Role[]>("/discord/roles", {
    method: "get",
  });

  return (
    data.value?.map((role) => ({
      label: role.name,
      value: role.id,
    })) ?? ([] as { label: string; value: string }[])
  );
};
