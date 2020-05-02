import React, { memo } from 'react';
import { cn } from '@bem-react/classname';
import Convert from 'ansi-to-html';

type LogDetailsProps = {
  log: string;
};

const classes = cn('LogDetails');

const convert = new Convert({ fg: '#000', bg: '#000' });

const LogDetails: React.FC<LogDetailsProps> = memo(({ log }) => {
  return (
    <div className={classes()}>
      <pre className={classes('Log')}>
        <div dangerouslySetInnerHTML={{ __html: convert.toHtml(log) }}></div>
      </pre>
    </div>
  );
});

LogDetails.defaultProps = {
  log: '',
};

export { LogDetails };
