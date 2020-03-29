import React, { memo } from 'react';
import { cn } from '@bem-react/classname';
import PropTypes from 'prop-types';

const classes = cn('FormField');

const FormField = memo(({ name, label, required, row, suffix, children }) => {
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
});

// TODO: добавить имя

FormField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  row: PropTypes.bool,
  suffix: PropTypes.string,
};

FormField.defaultProps = {
  name: '',
  label: '',
  required: false,
  children: null,
  row: false,
  suffix: null,
};

export { FormField };
