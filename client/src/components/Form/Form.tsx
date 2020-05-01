import React, { memo } from 'react';
import { cn } from '@bem-react/classname';

import { FormHeader } from './FormHeader';
import { FormFooter } from './FormFooter';
import { FormField } from './FormField';

interface IFormFieldsProps {}

const classes = cn('Form');

const FormFields: React.FunctionComponent<IFormFieldsProps> = memo(({ children }) => {
  return (
    <div className={classes('Body')}>
      <fieldset>{children}</fieldset>
    </div>
  );
});

interface IFormProps {}
// interface IForm<T> extends React.FunctionComponent<T> {
//   Header: ReactElement,
//   Fields: ReactElement,
//   Footer: ReactElement,
//   Field: ReactElement
// }

const Form: React.FunctionComponent<IFormProps> = memo(({ children }) => {
  return <form className={classes()}>{children}</form>;
});

Form.defaultProps = {
  children: null,
};

// Form.Header = FormHeader;
// Form.Fields = FormFields;
// Form.Footer = FormFooter;
// Form.Field = FormField;

export { Form, FormHeader, FormFields, FormField, FormFooter };
