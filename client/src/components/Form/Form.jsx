import React, { memo } from 'react';
import { cn } from '@bem-react/classname';

import { FormHeader } from './FormHeader';
import { FormFooter } from './FormFooter';
import { FormField } from './FormField';

const classes = cn('Form');

const FormFields = memo(({ children }) => {
  return (
    <div className={classes('Body')}>
      <fieldset>{children}</fieldset>
    </div>
  );
});

const Form = memo(({ children }) => {
  return <form className={classes()}>{children}</form>;
});

Form.propTypes = {};

Form.defaultProps = {};

Form.Header = FormHeader;
Form.Fields = FormFields;
Form.Footer = FormFooter;
Form.Field = FormField;

export { Form };
