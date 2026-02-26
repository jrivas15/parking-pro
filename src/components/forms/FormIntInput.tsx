'use client';
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useFormContext } from "react-hook-form";

interface NumberInputProps {
  formName: string;
  label: string;
  disabled?: boolean;
}

const FormIntInput = ({ formName, label, disabled }: NumberInputProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={formName}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className="mt-2">
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <Input
            disabled={disabled}
            type="text"
            value={field.value ? field.value.toLocaleString() : '0'}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9,]/g, '');
              const numericValue = parseFloat(value.replace(/,/g, ''));
              field.onChange(isNaN(numericValue) ? 0 : numericValue);
            }}
            name={field.name}
            id={field.name}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default FormIntInput;