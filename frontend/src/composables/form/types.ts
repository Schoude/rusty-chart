import type { DateValue } from '@internationalized/date';

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

export interface DateFieldConfig extends BaseFieldConfig {
  type: 'date';
  minDate?: DateValue;
  maxDate?: DateValue;
}

export type FormFieldConfig =
  | TextFieldConfig
  | EmailFieldConfig
  | PasswordFieldConfig
  | NumberFieldConfig
  | DateFieldConfig;

export type FieldInstance<TValidator> = FormFieldConfig & {
  id: string;
  validator: TValidator;
};

export function createField<TValidator, TConfig extends FormFieldConfig>(
  validator: TValidator,
  config: TConfig,
): FieldInstance<TValidator> {
  return {
    validator,
    id: crypto.randomUUID(),
    ...config,
  };
}
