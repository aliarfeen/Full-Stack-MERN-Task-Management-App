import React from 'react';
import { Input, InputProps } from '../ui/Input';

export interface FormFieldProps extends InputProps {
  label?: string;
  error?: string;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, ...props }, ref) => {
    return <Input ref={ref} label={label} error={error} {...props} />;
  }
);

FormField.displayName = 'FormField';
