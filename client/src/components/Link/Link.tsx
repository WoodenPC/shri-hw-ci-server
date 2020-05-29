import React, { memo } from 'react';
import { cn } from '@bem-react/classname';

type LinkProps = {
  text?: string;
  href?: string;
  classMix?: string;
  onClick?: (event: React.MouseEvent) => void;
};

const classes = cn('Link');

const Link: React.FC<LinkProps> = memo(({ text, href, classMix, onClick }) => {
  return (
    <a className={`${classes()} ${classMix}`} href={href} onClick={onClick}>
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
