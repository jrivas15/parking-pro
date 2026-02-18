import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'

interface CustomInputProps {
    formName: string
    label: string
    type?: string
    disabled?: boolean
}


const CustomInput = ({formName, label, type='text', disabled}:CustomInputProps) => {
 const {control} = useFormContext()
 
 
  return <Controller
            control={control}
            name={formName}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
                <Input {...field} type={type} name={field.name} id={field.name} disabled={disabled} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
  
}

export default CustomInput
