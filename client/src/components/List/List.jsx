import React, { memo } from 'react';
import { cn } from '@bem-react/classname';
import PropTypes from 'prop-types';

import { Button } from 'components/Button';
import { ListItem } from './ListItem';

const classes = cn('List');

const List = memo(({ children, direction, onShowMore }) => {
  return (
    <div className={classes({ direction })}>
      <div className={classes('Box')}>{children}</div>
      <div className={classes('Menu')}>
        <Button text='Show more' onClick={onShowMore} color='secondary' />
      </div>
    </div>
  );
});

List.propTypes = {
  direction: PropTypes.oneOf(['row', 'col']),
  onShowMore: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

List.defaultProps = {
  direction: 'row',
  onShowMore: null,
  children: null,
};

List.Item = ListItem;

export { List };
