<script setup lang="ts">
import FormFieldDiscriminator from '@/components/form/FormFieldDiscriminator.vue';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Field, FieldLabel, FieldGroup, FieldError, FieldDescription } from '@/components/ui/field';
import { createField } from '@/composables/form/types';
import { useLoginStore } from '@/stores/login';
import { fromDate, getLocalTimeZone, type DateValue, today, toCalendarDate } from '@internationalized/date';
import { createRule, useRegle, type Maybe } from '@regle/core';
import { required } from '@regle/rules';
import { useTimeout } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { ref, type Ref } from 'vue';

const loginStore = useLoginStore();
const { loginData, formFields } = storeToRefs(loginStore);
useTimeout(1000, {
  callback: () => {
    loginData.value.address.street = 'Test Street';
    loginStore.setFormState(loginData);
  },
});

const myDateAfter = createRule({
  validator: (value: Maybe<NonNullable<DateValue>>, config?: { allowEqual: boolean }) => {
    if (value == null) return true;
    const todayDate = today(getLocalTimeZone());

    if (config?.allowEqual) {
      return value.compare(todayDate) >= 0;
    }

    return value.compare(todayDate) > 0;
  },
  message: 'The date must be after today.',
});

const date = ref({ date: toCalendarDate(fromDate(new Date(), getLocalTimeZone())) }) as Ref<{
  date: DateValue | undefined | null;
}>;

const { r$ } = useRegle(date, {
  date: {
    $self: {
      required,
      myDateAfter: myDateAfter({ allowEqual: true }),
    },
  },
});

const dateField = createField(r$.date, {
  type: 'date',
  label: 'Select a date',
  description: 'Please select a date that is after today.',
  minDate: toCalendarDate(fromDate(new Date(1925, 0, 1), getLocalTimeZone())),
  maxDate: toCalendarDate(fromDate(new Date(2035, 0, 1), getLocalTimeZone())),
});

function onClearDate() {
  r$.date.$value = null;
}
</script>

<template>
  <div class="w-[25%]">
    <Field>
      <FieldLabel for="date">{{ dateField.label }}</FieldLabel>
      <FieldDescription>{{ dateField.description }}</FieldDescription>

      <Calendar
        v-model="dateField.validator.$value as DateValue"
        class="rounded-md border shadow-sm"
        layout="month-and-year"
        :min-value="dateField.minDate"
        :max-value="dateField.maxDate"
      />

      <FieldError :errors="dateField.validator.$errors.$self" />
    </Field>
  </div>

  <Button @click="onClearDate">Clear Date</Button>

  <p>Selected date: {{ r$.date.$value }}</p>

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
