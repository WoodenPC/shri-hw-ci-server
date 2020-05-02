import React, { memo } from 'react';
import { cn } from '@bem-react/classname';

const classes = cn('Form');

const FormFooter: React.FC = memo(({ children }) => {
  return <div className={classes('Footer')}>{children}</div>;
});

FormFooter.defaultProps = {};

export { FormFooter };
