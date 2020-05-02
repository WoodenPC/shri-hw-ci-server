import React, { memo } from 'react';
import { cn } from '@bem-react/classname';

type IconProps = {
  type?: string;
};

const classes = cn('Icon');

const Icon: React.FC<IconProps> = memo(({ type }) => {
  return <span className={classes({ type })}></span>;
});

Icon.defaultProps = {};

export { Icon };
