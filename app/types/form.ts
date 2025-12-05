export type LaravelValidationResponse = {
  statusCode: number;
  data: LaravelValidationErrors;
};

export type LaravelValidationErrors = {
  errors: Record<string, string[]>;
  message: string;
};

export type NuxtUiFormError = {
  name: string; // The path to the field with the error
  message: string; // The error message
};

export type NuxtUiFormErrors = NuxtUiFormError[];
