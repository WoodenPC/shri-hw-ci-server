import React, { memo } from 'react';
import { cn } from '@bem-react/classname';

interface IFormFieldProps {
  name?: string;
  label?: string;
  required?: boolean;
  row?: boolean;
  suffix?: string;
}

const classes = cn('FormField');

const FormField: React.FunctionComponent<IFormFieldProps> = memo(
  ({ name, label, required, row, suffix, children }) => {
    return (
      <div className={classes({ required, row })}>
        {label && (
          <label className={classes('Label')} htmlFor={name}>
            {label}
          </label>
        )}
        {children}
        {suffix && <label className={classes('Label')}>{suffix}</label>}
      </div>
    );
  }
);

FormField.defaultProps = {
  name: '',
  label: '',
  required: false,
  row: false,
};

export { FormField };
