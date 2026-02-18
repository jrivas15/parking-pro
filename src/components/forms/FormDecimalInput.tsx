'use client'
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useFormContext } from "react-hook-form";

interface CustomInputProps {
  formName: string;
  label: string;
  type?: string;
  disabled?: boolean;
}

const FormDecimalInput = ({ formName, label, type = "text", disabled }: CustomInputProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={formName}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <Input
            disabled={disabled}
            onChange={(e) => {
              const value = e.target.value;
              const numericValue = Number(value);
              let output;

              if (value.includes(".")) {
                const parts = value.split(".");
                const decimalPart = parts[1];

                if (decimalPart.length > 0) {
                  output = isNaN(numericValue) ? value : numericValue;
                } else {
                  output = value;
                }
              } else {
                output = isNaN(numericValue) ? value : numericValue;
              }

              field.onChange(output);
            }}
            value={field.value}
            type={type}
            name={field.name}
            id={field.name}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default FormDecimalInput;