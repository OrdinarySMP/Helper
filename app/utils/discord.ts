import type { TextChannel, Role, Category } from "@/types/discord";
import { DiscordButton } from "@OrdinarySMP/api-types";
import type { SelectMenuItem } from "@nuxt/ui";

const client = useApiClient();
const toast = useSimpleToast();

export const loadTextChannels = async (): Promise<
  { label: string; value: string }[]
> => {
  const response = await client<TextChannel[]>("/discord/text-channels");

  if (!response) {
    toast.error("Could not load discord text channels!");
  }

  return (
    response
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
  const response = await client<Role[]>("/discord/roles");

  if (!response) {
    toast.error("Could not load discord roles!");
  }

  return (
    response?.map((role) => ({
      label: role.name,
      value: role.id,
    })) ?? ([] as { label: string; value: string }[])
  );
};

export const loadCategories = async () => {
  const response = await client<Category[]>("/discord/categories");

  if (!response) {
    toast.error("Could not load discord categories!");
  }

  return (
    response
      ?.map((channel): { label: string; value: string } => ({
        label: channel.name,
        value: channel.id,
      }))
      .sort((a, b) => a.label.localeCompare(b.label)) ??
    ([] as { label: string; value: string }[])
  );
};

export const buttonOptions = (): SelectMenuItem[] => {
  return Object.entries(DiscordButton)
    .filter(([key, _value]) => isNaN(Number(key)))
    .map(([key, value]) => ({
      label: key,
      value: value,
    }));
};
