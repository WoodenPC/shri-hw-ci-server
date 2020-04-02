import React, { memo } from 'react';
import { cn } from '@bem-react/classname';
import PropTypes from 'prop-types';

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

Form.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

Form.defaultProps = {
  children: null,
};

Form.Header = FormHeader;
Form.Fields = FormFields;
Form.Footer = FormFooter;
Form.Field = FormField;

export { Form };
