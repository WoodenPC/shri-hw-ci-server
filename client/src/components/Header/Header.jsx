import React, { memo } from 'react';
import { cn } from '@bem-react/classname';
import PropTypes from 'prop-types';

const classes = cn('Header');

const Header = memo(({ title, children, color }) => {
  return (
    <header className={classes()}>
      <div className={classes('Title', { color })}>
        <h1>{title}</h1>
      </div>
      <div className={classes('Menu')}>{children}</div>
    </header>
  );
});

Header.propTypes = {
  title: PropTypes.string,
  children: PropTypes.element,
  color: PropTypes.oneOf([null, 'black']),
};

Header.defaultProps = {
  title: '',
  children: null,
  color: null,
};

export { Header };
