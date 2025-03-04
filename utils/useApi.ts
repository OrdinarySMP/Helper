type UseFetchOptions = {
  method?: "get" | "post" | "patch" | "put" | "delete";
  query?: Record<string, unknown> | [key: string, value: string][];
  params?: Record<string, unknown> | [key: string, value: string][];
  body?:
    | RequestInit["body"]
    | Record<string, unknown>
    | Record<string, unknown>[];
  headers?: Record<string, string> | [key: string, value: string][] | Headers;
  watch?: boolean;
  baseURL?: string;
  credentials?: string;
};

export const useApi = async <T>(
  path: string,
  options: UseFetchOptions = {},
  displayErrors = false,
) => {
  const xsrfToken = useCookie("XSRF-TOKEN");
  if (xsrfToken.value) {
    options.headers = {
      "X-XSRF-TOKEN": xsrfToken.value,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    };
  }
  options.credentials = "include";
  options.watch = false;
  options.baseURL = "/";

  const { data, error, refresh } = await useFetch<T>(
    apiUrl(path),
    options as object,
  );

  await handleError(error.value, displayErrors);

  return { data, error, refresh };
};

const handleError = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any | null,
  displayAllError: boolean,
) => {
  if (!error || error.statusCode === undefined) {
    return;
  }

  if ([400, 500, 502].includes(error.statusCode)) {
    useNotification().error(
      error.cause?.response.statusText,
      `${error.message}: ${error.cause?.response._data.message}`,
    );
  } else if ([401, 403].includes(error.statusCode ?? 0)) {
    await navigateTo("/login");
  } else if (displayAllError) {
    let errorMessage = error.data.message;
    let errorTitle = error.cause?.response.statusText;

    if (error.data.errors) {
      errorTitle = error.data.message;
      Object.keys(error.data.errors).forEach((key) => {
        errorMessage += `${error.data.errors[key].join(",")}\n`;
      });
    }

    useNotification().error(errorTitle, errorMessage);
  }
};

export const apiUrl = (path: string): string => {
  const config = useRuntimeConfig();

  return `${config.public.apiBase}${path.startsWith("/") ? "" : "/"}${path}`;
};
