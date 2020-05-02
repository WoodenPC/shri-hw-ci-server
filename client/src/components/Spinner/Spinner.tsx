import React, { memo } from 'react';
import { cn } from '@bem-react/classname';

const classes = cn('Spinner');

const Spinner: React.FC = memo(() => {
  return (
    <div className={classes()}>
      <div className={classes('Wrapper')}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
});

export { Spinner };
