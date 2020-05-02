import React, { memo } from 'react';
import { cn } from '@bem-react/classname';

type LinkProps = {
  text?: string;
  href?: string;
  classMix?: string;
};

const classes = cn('Link');

const Link: React.FC<LinkProps> = memo(({ text, href, classMix }) => {
  return (
    <a className={`${classes()} ${classMix}`} href={href}>
      {text}
    </a>
  );
});

Link.defaultProps = {
  text: '',
  href: '/#',
  classMix: '',
};

export { Link };
