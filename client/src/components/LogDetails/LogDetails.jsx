import React, { memo } from 'react';
import { cn } from '@bem-react/classname';
import PropTypes from 'prop-types';
import Convert from 'ansi-to-html';

const classes = cn('LogDetails');

const convert = new Convert({ fg: '#000', bg: '#000' });

const LogDetails = memo(({ log }) => {
  return (
    <div className={classes()}>
      <pre className={classes('Log')}>
        <div dangerouslySetInnerHTML={{ __html: convert.toHtml(log) }}></div>
      </pre>
    </div>
  );
});

LogDetails.propTypes = {
  log: PropTypes.string,
};

LogDetails.defaultProps = {
  log: '',
};

export { LogDetails };
