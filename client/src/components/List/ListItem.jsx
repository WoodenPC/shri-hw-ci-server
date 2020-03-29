import React, { memo } from 'react';
import { cn } from '@bem-react/classname';

const classes = cn('List', 'Item');

const ListItem = memo(({ children }) => {
  return <div className={classes()}>{children}</div>;
});

ListItem.propTypes = {};
ListItem.defaultProps = {};

export { ListItem };
