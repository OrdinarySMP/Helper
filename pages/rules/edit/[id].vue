<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useForm } from "vee-validate";
import type { Rule } from "@/types/rule"

const route = useRoute()
const ruleId = ref<Rule["id"]>()
const rule = ref<Rule>()
const loading = ref(true);
const errorMessage = ref("");

const formSchema = toTypedSchema(
  zod.object({
    number: zod.number().min(1),
    name: zod.string().min(1),
    rule: zod.string().min(1),
  }),
);

const { handleSubmit, setErrors, isSubmitting, setFieldValue } = useForm({
  validationSchema: formSchema,
});

const save = handleSubmit(async (values) => {
  errorMessage.value = "";

  const { error } = await await useApi(`/rules/${ruleId.value}`, {
    method:  "patch",
    body: values
  });

  if (error.value) {
    errorMessage.value = error.value.data.message;
    setErrors(error.value.data.errors ?? []);
  } else {
    navigateTo("/rules");
  }
});

onMounted(async () => {
  loading.value = true;
  ruleId.value = parseRouteParameter(route.params.id);

  const { data } = await await useApi<Rule[]>(`/rules`, {
    method:  "get",
    params: {
      "filter[id]": ruleId.value,
    }
  });
  if (!data.value || !data.value[0]) {
    navigateTo("/rules");
    return
  }

  rule.value = data.value[0]

  setFieldValue("number", rule.value.number);
  setFieldValue("name", rule.value.name);
  setFieldValue("rule", rule.value.rule);

  loading.value = false;
})
</script>

<template>
  <div class="flex grow">
    <div v-if="loading" class="flex grow items-center justify-center">
      <Spinner />
    </div>
    <div v-else class="w-full">
      <p class="mb-8 text-2xl">Edit Rule</p>
      <form class="grid grid-cols-1 gap-4" @submit.prevent="save">
        <FieldInput name="number" label="Number" type="number" />

        <FieldInput name="name" label="Name" />

        <FieldTextArea name="rule" label="Rule" />

        <div>
          <Button
            :disabled="isSubmitting"
            :loading="isSubmitting"
            class="mr-2 px-4"
            size="md"
            type="submit"
          >
            Save
          </Button>
          <span v-if="errorMessage" class="text-red-600">{{
            errorMessage
          }}</span>
        </div>
      </form>
    </div>
  </div>
</template>