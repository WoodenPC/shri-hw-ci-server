import React, { memo } from 'react';
import { cn } from '@bem-react/classname';
import PropTypes from 'prop-types';

const classes = cn('Link');

const Link = memo(({ text, href, classMix }) => {
  return (
    <a className={`${classes()} ${classMix}`} href={href}>
      {text}
    </a>
  );
});

Link.propTypes = {
  text: PropTypes.string,
  href: PropTypes.string,
  classMix: PropTypes.string,
};

Link.defaultProps = {
  text: '',
  href: '/#',
  classMix: '',
};

export { Link };
