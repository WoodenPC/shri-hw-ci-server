import React, { memo } from 'react';
import { cn } from '@bem-react/classname';

import { Button } from 'components/Button';
import { ListItem } from './ListItem';

type ListProps = {
  direction?: 'row' | 'col';
  onShowMore?: (...args: Array<any>) => any;
};

const classes = cn('List');

const List: React.FC<ListProps> = memo(
  ({ children, direction, onShowMore }) => {
    return (
      <div className={classes({ direction })}>
        <div className={classes('Box')}>{children}</div>
        <div className={classes('Menu')}>
          <Button text='Show more' onClick={onShowMore} color='secondary' />
        </div>
      </div>
    );
  }
);

List.defaultProps = {
  direction: 'row',
};

// List.Item = ListItem;

export { List, ListItem };
