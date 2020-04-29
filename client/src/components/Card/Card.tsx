import React, { memo, useMemo, useCallback } from 'react';
import { cn } from '@bem-react/classname';
import { format } from 'date-fns';

import { Icon } from 'components/Icon';
import { UserName } from 'components/UserName';
import { Commit } from 'components/Commit';
import { BuildStatus } from 'interfaces/data.intfs';

interface ICardProps {
  id?: string,
  status?: BuildStatus,
  buildNumber?: number,
  title?: string,
  branch?: string,
  hash?: string,
  who?: string,
  start?: string,
  duration?: number,
  onClick?: (...args: Array<any>) => any;
}

const statuses = {
  [BuildStatus.Success]: 'success',
  [BuildStatus.Waiting]: 'waiting',
  [BuildStatus.InProgress]: 'inProgress',
  [BuildStatus.Fail]: 'fail',
  [BuildStatus.Canceled]: 'canceled'
};

const classes = cn('Card');

const Card: React.FunctionComponent<ICardProps> = memo(
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
      if (start === '') {
        return '';
      }
      const date = new Date(start as string);
      const utcDate = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDay())
      );
      return format(utcDate, 'dd MMM, HH:mm');
    }, [start]);

    const onClickInner = useCallback(() => {
      if (onClick !== undefined) {
        onClick({ buildId: id, commitHash: hash });
      }
    }, [id, hash, onClick]);

    return (
      <div
        className={classes({ status: statuses[status as BuildStatus] })}
        onClick={onClickInner}
      >
        <div>
          <Icon type={statuses[status as BuildStatus]} />
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

Card.defaultProps = {
  id: '',
  status: BuildStatus.InProgress,
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
