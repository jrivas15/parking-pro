import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, useFormContext } from "react-hook-form";

interface SelectProps {
  options: { value: string; label: string }[];
  formName: string;
  label: string;
  placeholder: string;
  colorLabel?: string;
  disabled?: boolean;
}

const FormSelect = ({
  options,
  formName,
  label,
  placeholder,
  colorLabel,
  disabled,
}: SelectProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={formName}
      control={control}
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel
            htmlFor={field.name}
            className={`${colorLabel ? colorLabel : ""}`}
          >
            {label}
          </FieldLabel>
          <Select
            disabled={disabled}
            name={field.name}
            value={field.value}
            onValueChange={field.onChange}
          >
            <SelectTrigger
              id={`${field.name}`}
              aria-invalid={fieldState.invalid}
              className="min-w-30"
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent position="item-aligned">
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    ></Controller>
  );
};

export default FormSelect;
