import React, { memo } from 'react';
import { cn } from '@bem-react/classname';
import { Icon } from 'components/Icon/Icon';

interface IUserNameProps {
  name: string
}

const classes = cn('UserName');

const UserName: React.FunctionComponent<IUserNameProps> = memo(({ name }) => {
  return (
    <div className={classes()}>
      <Icon type='person' />
      <span className={classes('Name')}>{name}</span>
    </div>
  );
});

export { UserName };
