import React, { memo } from 'react';
import { cn } from '@bem-react/classname';
import PropTypes from 'prop-types';

import { Icon } from 'components/Icon';

const classes = cn('Commit');

const Commit = memo(({ hash, branchName }) => {
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

Commit.propTypes = {
  hash: PropTypes.string.isRequired,
  branchName: PropTypes.string.isRequired,
};

export { Commit };
