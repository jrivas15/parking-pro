import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'

interface CustomInputProps {
    formName: string
    label: string
    type?: string
    disabled?: boolean
    readOnly?: boolean
    autoFocus?: boolean
    uppercase?: boolean
}


const CustomInput = ({formName, label, type='text', disabled, readOnly, autoFocus=false, uppercase=false}:CustomInputProps) => {
 const {control} = useFormContext()


  return <Controller
            control={control}
            name={formName}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className=''>
                <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
                <Input
                  {...field}
                  type={type}
                  name={field.name}
                  id={field.name}
                  disabled={disabled}
                  readOnly={readOnly}
                  autoFocus={autoFocus}
                  className={readOnly ? 'bg-muted cursor-default' : ''}
                  onChange={(e) => field.onChange(uppercase ? e.target.value.toUpperCase() : e.target.value)}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
  
}

export default CustomInput
