import type { UseFetchOptions } from "nuxt/app";

export const useApi = async <T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>,
) => {
  const client = useApiClient();

  return await useFetch(url, {
    ...options,
    $fetch: client as typeof $fetch,
  });
};
