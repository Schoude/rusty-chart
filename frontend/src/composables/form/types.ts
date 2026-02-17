import { type RegleFieldStatus } from '@regle/core';

export type InputType = 'text' | 'email' | 'password';

interface BaseFieldConfig {
  label: string;
  placeholder?: string;
  description?: string;
}

export interface TextFieldConfig extends BaseFieldConfig {
  type: 'text';
}
export interface EmailFieldConfig extends BaseFieldConfig {
  type: 'email';
}
export interface PasswordFieldConfig extends BaseFieldConfig {
  type: 'password';
  showToggleVisibility?: boolean;
}
export interface NumberFieldConfig extends BaseFieldConfig {
  type: 'number';
  min: number;
  max: number;
  step: number;
  formatOptions?: Intl.NumberFormatOptions;
  locale?: string;
}

export type FormFieldConfig = TextFieldConfig | EmailFieldConfig | PasswordFieldConfig | NumberFieldConfig;

// This represents the merged object we loop over
// We use unknown for the value type to remain safe during iteration
export type FieldInstance<TValue> = FormFieldConfig & {
  id: string;
  validator: RegleFieldStatus<TValue>;
};

export function createField<TValue, TConfig extends FormFieldConfig>(
  validator: RegleFieldStatus<TValue>,
  config: TConfig,
): FieldInstance<TValue> {
  return {
    validator,
    id: crypto.randomUUID(),
    ...config,
  };
}
