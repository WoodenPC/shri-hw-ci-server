import React, { memo } from 'react';
import { cn } from '@bem-react/classname';

type FormHeaderProps = {
  title?: string;
  description?: string;
};

const classes = cn('Form');

const FormHeader: React.FC<FormHeaderProps> = memo(({ title, description }) => {
  return (
    <div className={classes('Header')}>
      <h2 className={classes('Title')}>{title}</h2>
      <p className={classes('Description')}>{description}</p>
    </div>
  );
});

FormHeader.defaultProps = {
  title: '',
  description: '',
};

export { FormHeader };
