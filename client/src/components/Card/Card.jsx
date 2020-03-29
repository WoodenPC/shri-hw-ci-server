import React, { memo } from 'react';
import { cn } from '@bem-react/classname';
import PropTypes from 'prop-types';

import { Icon } from 'components/Icon';
import { UserName } from 'components/UserName';
import { Commit } from 'components/Commit';

const classes = cn('Card');

const Card = memo(
  ({ status, commitNumber, title, branch, hash, who, time, onClick }) => {
    return (
      <div className={classes({ status })} onClick={onClick}>
        <div>
          <Icon type={status} />
        </div>
        <div className={classes('Content')}>
          <div className={classes('Body')}>
            <div className={classes('Title')}>
              <span className={classes('Number')}>#{commitNumber}</span>
              <span className={classes('Text')}>{title}</span>
            </div>
            <div className={classes('Subtitle')}>
              <Commit hash={hash} branchName={branch} />
              <UserName name={who} />
            </div>
          </div>
          <div className={classes('Meta')}>
            <div className={classes('BuildStartTime')}>
              <Icon type='calendar' />
              <span>{time.startTime}</span>
            </div>
            <div className={classes('BuildDuration')}>
              <Icon type='timer' />
              <span>{time.duration}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Card.propTypes = {
  status: PropTypes.oneOf(['done', 'fail', 'pending']),
  commitNumber: PropTypes.number,
  hash: PropTypes.string,
  who: PropTypes.string,
  time: PropTypes.object,
  title: PropTypes.string,
  branch: PropTypes.string,
  onClick: PropTypes.func,
};

Card.defaultProps = {
  status: 'pending',
  commitNumber: -1,
  hash: '',
  who: '',
  time: null,
  title: '',
  branch: '',
  onClick: undefined,
};

export { Card };
