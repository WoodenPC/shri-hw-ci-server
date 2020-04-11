import React, { memo } from 'react';
import { cn } from '@bem-react/classname';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

import { Icon } from 'components/Icon';
import { UserName } from 'components/UserName';
import { Commit } from 'components/Commit';
import { useMemo } from 'react';
import { useCallback } from 'react';

const classes = cn('Card');

const Card = memo(
  ({
    id,
    status,
    buildNumber,
    title,
    branch,
    hash,
    who,
    start,
    duration,
    onClick,
  }) => {
    const utcDateString = useMemo(() => {
      const date = new Date(start);
      const utcDate = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDay())
      );
      return format(utcDate, 'dd MMM, HH:mm');
    }, [start]);

    const onClickInner = useCallback(() => {
      if (onClick !== undefined) {
        onClick({ buildId: id, commitHash: hash });
      }
    }, [id, hash]);

    return (
      <div className={classes({ status })} onClick={onClickInner}>
        <div>
          <Icon type={status} />
        </div>
        <div className={classes('Content')}>
          <div className={classes('Body')}>
            <div className={classes('Title')}>
              <span className={classes('Number')}>#{buildNumber}</span>
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
              <span>{utcDateString}</span>
            </div>
            <div className={classes('BuildDuration')}>
              <Icon type='timer' />
              <span>{duration}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Card.propTypes = {
  id: PropTypes.string,
  status: PropTypes.oneOf(['success', 'fail', 'inprogress', 'waiting']),
  buildNumber: PropTypes.number,
  hash: PropTypes.string,
  who: PropTypes.string,
  title: PropTypes.string,
  branch: PropTypes.string,
  onClick: PropTypes.func,
  start: PropTypes.string,
  duration: PropTypes.number,
};

Card.defaultProps = {
  id: '',
  status: 'waiting',
  buildNumber: -1,
  hash: '',
  who: '',
  title: '',
  branch: '',
  onClick: undefined,
  start: new Date(2020, 1, 1).toString(),
  duration: 0,
};

export { Card };
