import React, { memo } from 'react';
import { cn } from '@bem-react/classname';

import { Icon } from 'components/Icon';

type CommitProps = {
  hash?: string;
  branchName?: string;
};

const classes = cn('Commit');

const Commit: React.FC<CommitProps> = memo(({ hash, branchName }) => {
  return (
    <div className={classes()}>
      <div className={classes('Branch')}>
        <Icon type='codeCommit' />
        <span className={classes('BranchName')}>{branchName}</span>
      </div>
      <span className={classes('Hash')}>{hash}</span>
    </div>
  );
});

export { Commit };
