import React, { memo } from 'react';
import { cn } from '@bem-react/classname';

const classes = cn('List', 'Item');

const ListItem: React.FC = memo(({ children }) => {
  return <div className={classes()}>{children}</div>;
});

ListItem.defaultProps = {};

export { ListItem };
