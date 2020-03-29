import React, { memo } from 'react';
import { cn } from '@bem-react/classname';

const classes = cn('Form');

const FormFooter = memo(({ children }) => {
  return <div className={classes('Footer')}>{children}</div>;
});

FormFooter.propTypes = {};

FormFooter.defaultProps = {};

export { FormFooter };
