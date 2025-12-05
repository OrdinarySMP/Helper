export const useApiClient = () => {
  const client = useSanctumClient();
  const config = useRuntimeConfig();
  return client.create({
    baseURL: `${config.public.sanctum.baseUrl}/api/v1`,
  });
};
