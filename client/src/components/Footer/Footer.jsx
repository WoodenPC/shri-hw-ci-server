import React from 'react';
import { cn } from '@bem-react/classname';
import { Link } from 'components/Link';

const classes = cn('Footer');

const Footer = () => {
  return (
    <footer className={classes()}>
      <div className={classes('Inner')}>
        <div className={classes('Menu')}>
          <Link text='Support' classMix={classes('Link')} />
          <Link text='Learning' classMix={classes('Link')} />
        </div>
        <div className={classes('Author')}>&copy; 2020 Arslanov Rasul</div>
      </div>
    </footer>
  );
};

export { Footer };
