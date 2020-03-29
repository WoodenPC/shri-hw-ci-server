import React, { memo } from 'react';
import { cn } from '@bem-react/classname';
import PropTypes from 'prop-types';

const classes = cn('Form');

const FormHeader = memo(({ title, description }) => {
  return (
    <div className={classes('Header')}>
      <h2 className={classes('Title')}>{title}</h2>
      <p className={classes('Description')}>{description}</p>
    </div>
  );
});

FormHeader.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
};

FormHeader.defaultProps = {
  title: '',
  description: '',
};

export { FormHeader };
