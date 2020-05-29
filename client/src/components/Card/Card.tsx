import React, { memo, useMemo, useCallback } from 'react';
import { cn } from '@bem-react/classname';
import { format } from 'date-fns';
import prettyMs from 'pretty-ms';

import { Icon } from 'components/Icon';
import { UserName } from 'components/UserName';
import { Commit } from 'components/Commit';
import { BuildStatus } from 'types/data.types';
import { useTranslation } from 'react-i18next';
import { ru, enUS } from 'date-fns/locale';

type CardProps = {
  id?: string;
  status?: BuildStatus;
  buildNumber?: number;
  title?: string;
  branch?: string;
  hash?: string;
  who?: string;
  start?: string;
  duration?: number;
  onClick?: (id: string, hash: string) => void;
};

const statuses = {
  [BuildStatus.Success]: 'success',
  [BuildStatus.Waiting]: 'waiting',
  [BuildStatus.InProgress]: 'inProgress',
  [BuildStatus.Fail]: 'fail',
  [BuildStatus.Canceled]: 'canceled',
};

const classes = cn('Card');

const Card: React.FC<CardProps> = memo(
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
    const { i18n } = useTranslation();
    const utcDateString = useMemo(() => {
      if (start === '') {
        return '';
      }
      const date = new Date(start as string);
      const utcDate = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDay())
      );
      return format(utcDate, 'dd MMM, HH:mm', {
        locale: i18n.language === 'ru' ? ru : enUS,
      });
    }, [start, i18n.language]);

    const onClickInner = useCallback(() => {
      if (onClick !== undefined) {
        onClick(id as string, hash as string);
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
              <span>{prettyMs(duration as number)}</span>
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
  start: new Date(2020, 1, 1).toString(),
  duration: 0,
};

export { Card };
