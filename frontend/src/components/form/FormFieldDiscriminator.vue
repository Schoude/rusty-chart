<script setup lang="ts">
import type { FieldInstance } from '@/composables/form/types';
import { Input } from '../ui/input';
import {
  NumberFieldContent,
  NumberFieldInput,
  NumberFieldIncrement,
  NumberFieldDecrement,
  NumberField,
} from '../ui/number-field';

defineModel<FieldInstance<string> | FieldInstance<number>>('field', { required: true });
</script>

<template>
  <template v-if="field.type === 'number'">
    <NumberField :id="field.id" v-model="field.validator.$value as number | null | undefined" :min="field.min"
      :max="field.max" :step="field.step" :format-options="field.formatOptions" :locale="field.locale">
      <NumberFieldContent>
        <NumberFieldDecrement />
        <NumberFieldInput />
        <NumberFieldIncrement />
      </NumberFieldContent>
    </NumberField>
  </template>

  <Input v-else :id="field.id" :type="field.type" :placeholder="field.placeholder" v-model="field.validator.$value" />
</template>
