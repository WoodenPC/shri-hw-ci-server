import React, { memo } from 'react';
import { cn } from '@bem-react/classname';

interface ILinkProps {
  text: string,
  href: string,
  classMix: string
}

const classes = cn('Link');

const Link: React.FunctionComponent<ILinkProps> = memo(({ text, href, classMix }) => {
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
