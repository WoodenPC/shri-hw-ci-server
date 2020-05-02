import React, { memo } from 'react';
import { cn } from '@bem-react/classname';

import { FormHeader } from './FormHeader';
import { FormFooter } from './FormFooter';
import { FormField } from './FormField';

const classes = cn('Form');

const FormFields: React.FC = memo(({ children }) => {
  return (
    <div className={classes('Body')}>
      <fieldset>{children}</fieldset>
    </div>
  );
});

// interface IForm<T> extends React.FunctionComponent<T> {
//   Header: ReactElement,
//   Fields: ReactElement,
//   Footer: ReactElement,
//   Field: ReactElement
// }

const Form: React.FC = memo(({ children }) => {
  return <form className={classes()}>{children}</form>;
});

// Form.Header = FormHeader;
// Form.Fields = FormFields;
// Form.Footer = FormFooter;
// Form.Field = FormField;

export { Form, FormHeader, FormFields, FormField, FormFooter };
