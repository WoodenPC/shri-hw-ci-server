import React, { memo } from 'react';
import { cn } from '@bem-react/classname';
import { Icon } from 'components/Icon/Icon';

type UserNameProps = {
  name?: string;
};

const classes = cn('UserName');

const UserName: React.FC<UserNameProps> = memo(({ name }) => {
  return (
    <div className={classes()}>
      <Icon type='person' />
      <span className={classes('Name')}>{name}</span>
    </div>
  );
});

UserName.defaultProps = {
  name: '',
};

export { UserName };
