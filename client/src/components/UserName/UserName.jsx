import React, { memo } from 'react';
import { cn } from '@bem-react/classname';
import PropTypes from 'prop-types';
import { Icon } from 'components/Icon/Icon';

const classes = cn('UserName');

const UserName = memo(({ name }) => {
  return (
    <div className={classes()}>
      <Icon type='person' />
      <span className={classes('Name')}>{name}</span>
    </div>
  );
});

UserName.propTypes = {
  name: PropTypes.string.isRequired,
};

export { UserName };
