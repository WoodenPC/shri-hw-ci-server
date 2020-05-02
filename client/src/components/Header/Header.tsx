import React, { memo } from 'react';
import { cn } from '@bem-react/classname';

type HeaderProps = {
  title?: string;
  color?: 'black';
};

const classes = cn('Header');

const Header: React.FC<HeaderProps> = memo(({ title, children, color }) => {
  return (
    <header className={classes()}>
      <div className={classes('Title', { color })}>
        <h1>{title}</h1>
      </div>
      <div className={classes('Menu')}>{children}</div>
    </header>
  );
});

Header.defaultProps = {
  title: '',
};

export { Header };
