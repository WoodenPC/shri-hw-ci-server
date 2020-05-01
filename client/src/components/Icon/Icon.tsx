import React, { memo } from 'react';
import { cn } from '@bem-react/classname';

interface IIconProps {
  type?: string
}

const classes = cn('Icon');

const Icon: React.FunctionComponent<IIconProps> = memo(({ type }) => {
  return <span className={classes({ type })}></span>;
});

Icon.defaultProps = {
};

export { Icon };
