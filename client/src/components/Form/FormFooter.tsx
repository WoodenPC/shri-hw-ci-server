import React, { memo } from 'react';
import { cn } from '@bem-react/classname';

interface IFormFooterProps {}

const classes = cn('Form');

const FormFooter: React.FunctionComponent<IFormFooterProps> = memo(({ children }) => {
  return <div className={classes('Footer')}>{children}</div>;
});

FormFooter.defaultProps = {};

export { FormFooter };
