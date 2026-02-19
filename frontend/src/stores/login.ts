import { createField } from '@/composables/form/types';
import { useRegle } from '@regle/core';
import { required, email, minLength, maxValue, maxLength } from '@regle/rules';
import { defineStore } from 'pinia';
import { ref, computed, toValue, type MaybeRefOrGetter } from 'vue';

export const useLoginStore = defineStore('login', () => {
  const loginData = ref({
    username: '',
    email: '',
    password: '',
    phone: 0,
    address: {
      street: '',
    },
  });

  const { r$ } = useRegle(
    loginData,
    {
      username: { required },
      email: { required, email },
      password: { required, min: minLength(8) },
      phone: {
        required,
        max: maxValue(10),
      },
      address: {
        street: {
          required,
          maxLength: maxLength(255),
        },
      },
    },
    { id: 'login-form' },
  );

  const formFields = computed(() => [
    createField(r$.username, {
      type: 'text',
      label: 'Username',
      placeholder: 'master89',
    }),
    createField(r$.email, {
      type: 'email',
      label: 'Email Address',
    }),
    createField(r$.password, {
      type: 'password',
      label: 'Password',
      showToggleVisibility: true,
    }),
    createField(r$.phone, {
      type: 'number',
      label: 'Telefon',
      description: 'Your phone number',
      min: 0,
      max: 10,
      step: 1,
      formatOptions: {
        minimumFractionDigits: 2,
      },
      locale: 'de-DE',
    }),
    createField(r$.address.street, {
      type: 'text',
      label: 'Steet',
      placeholder: 'The Road',
      description: 'The street you live in',
    }),
  ]);

  async function onValidate() {
    await r$.$validate();
  }

  function onReset() {
    r$.$reset({ toInitialState: true });
  }

  return {
    r$,
    formFields,
    loginData,
    onValidate,
    onReset,
    setFormState(state: MaybeRefOrGetter<typeof loginData>) {
      r$.$reset({ toState: toValue(state).value });
    },
  };
});
