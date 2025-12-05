import type { FormSubmitEvent, Form } from "#ui/types";
import type { LaravelValidationResponse } from "@/types/form";

export const useApiForm = <T extends object>(
  form: Ref<Form<T> | undefined>,
  callback: (event: FormSubmitEvent<T>) => void | Promise<void>,
) => {
  const submitting = ref(false);

  async function onSubmit(event: FormSubmitEvent<T>) {
    submitting.value = true;
    try {
      await callback(event);
    } catch (err) {
      const response = err as LaravelValidationResponse;
      if (response.statusCode === 422) {
        form.value!.setErrors(
          laravelValidationErrorToNuxtUiForm(response.data),
        );
      }
    } finally {
      submitting.value = false;
    }
  }
  return { submitting, onSubmit };
};
