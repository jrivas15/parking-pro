import { Controller, useFormContext } from "react-hook-form";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Field, FieldError } from "../ui/field";

interface FormSwitchProps {
  formName: string;
  label?: string;
  disabled?: boolean;
}

const FormSwitch = ({ formName, label, disabled }: FormSwitchProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={formName}
      render={({ field, fieldState }) => (
        <Field className="">
          <div className="flex items-center space-x-2">
            <Label htmlFor={formName}>{label}</Label>

            <Switch
              id={formName}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </div>
        </Field>
      )}
    />
  );
};

export default FormSwitch;
