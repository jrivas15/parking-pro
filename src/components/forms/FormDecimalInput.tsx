import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface CustomInputProps {
  formName: string;
  label: string;
  disabled?: boolean;
  autoFocus?: boolean;
  fxEnterKeyDown?: () => void;
}

const FormDecimalInput = ({ formName, label, disabled, autoFocus, fxEnterKeyDown }: CustomInputProps) => {
  const { control } = useFormContext();
  const [display, setDisplay] = useState("");

  return (
    <Controller
      control={control}
      name={formName}
      render={({ field, fieldState }) => {
        // Sync display with field value when it changes externally because it doesn't work properly if it isn't implemented
        useEffect(() => {
          const value = field.value ?? 0;
          if (value === 0) {
            setDisplay("");
          } else {
            const formatted = value.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            });
            setDisplay(formatted);
          }
        }, [field.value]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const raw = e.target.value.replace(/,/g, "");
          if (raw === "" || raw === ".") {
            setDisplay(raw);
            field.onChange(0);
            return;
          }
          if (!/^\d*\.?\d*$/.test(raw)) return;
          const numeric = parseFloat(raw);
          field.onChange(isNaN(numeric) ? 0 : numeric);
          const [integer, decimal] = raw.split(".");
          const formatted =
            integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
            (raw.includes(".") ? "." + (decimal ?? "") : "");
          setDisplay(formatted);
        };

        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
            <Input
              disabled={disabled}
              id={field.name}
              name={field.name}
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={display}
              onChange={handleChange}
              autoFocus={autoFocus}
              onKeyDown={(e) => {
                if (e.key === "Enter" && fxEnterKeyDown) {
                  e.preventDefault();
                  e.stopPropagation();
                  fxEnterKeyDown();
                }
              }}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
};

export default FormDecimalInput;