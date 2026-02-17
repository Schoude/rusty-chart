<script setup lang="ts">
import FormFieldDiscriminator from '@/components/form/FormFieldDiscriminator.vue';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel, FieldGroup, FieldError, FieldDescription } from '@/components/ui/field';
import { useLoginStore } from '@/stores/login';
import { useTimeout } from '@vueuse/core';
import { storeToRefs } from 'pinia';

const loginStore = useLoginStore();
const { loginData, formFields } = storeToRefs(loginStore);
useTimeout(1000, {
  callback: () => {
    loginData.value.address.street = 'Test Street';
    loginStore.setFormState(loginData);
  },
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
