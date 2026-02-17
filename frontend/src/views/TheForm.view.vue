<script setup lang="ts">
import FormFieldDiscriminator from '@/components/form/FormFieldDiscriminator.vue';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel, FieldGroup, FieldError, FieldDescription } from '@/components/ui/field';
import { useLoginStore } from '@/stores/login';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const loginStore = useLoginStore();
const { r$, loginData, formFields } = storeToRefs(loginStore);

onMounted(() => {
  setTimeout(() => {
    loginData.value.address.street = 'Test Street';
    r$.value.$reset({ toState: loginData.value });
  }, 2000);
});
</script>

<template>
  <FieldGroup class="grid grid-cols-2 gap-4 max-w-300 mx-auto my-10">
    <Field v-for="field in formFields" :key="field.id">
      <FieldLabel :for="field.id">{{ field.label }}</FieldLabel>

      <FieldDescription>{{ field.description }}</FieldDescription>

      <FormFieldDiscriminator :field />

      <FieldError :errors="field.validator.$errors" />
    </Field>
  </FieldGroup>

  <div class="flex gap-2">
    <Button variant="outline" @click="loginStore.onReset">Reset</Button>
    <Button @click="loginStore.onValidate">Validate</Button>
  </div>
</template>
