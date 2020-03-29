import React, { memo } from 'react';
import { cn } from '@bem-react/classname';
import PropTypes from 'prop-types';

const classes = cn('LogDetails');

const LogDetails = memo(({ log }) => {
  return (
    <div className={classes()}>
      <pre className={classes('Log')}>{log}</pre>
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
