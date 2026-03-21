import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'

interface FormTextAreaProps {
    formName: string
    label: string
    disabled?: boolean
    placeholder?: string
    rows?: number
}

const FormTextArea = ({formName, label, disabled, placeholder, rows = 4}: FormTextAreaProps) => {
  const {control} = useFormContext()
  
  return <Controller
            control={control}
            name={formName}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className=''>
                <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
                <Textarea 
                  {...field} 
                  name={field.name} 
                  id={field.name} 
                  disabled={disabled}
                  placeholder={placeholder}
                  rows={rows}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
}

export default FormTextArea
