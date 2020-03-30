import React, { memo, useEffect, useState } from 'react';
import { cn } from '@bem-react/classname';
import PropTypes from 'prop-types';
import Convert from 'ansi-to-html';

import webpackLogs from './logs.txt'; // тестовые логи

const classes = cn('LogDetails');

const convert = new Convert({ fg: '#000', bg: '#000' });

const LogDetails = memo(({ log }) => {
  const [testLogs, setTestLogs] = useState('');
  useEffect(() => {
    fetch(webpackLogs)
      .then((response) => response.text())
      .then((text) => setTestLogs(text));
  }, []);

  return (
    <div className={classes()}>
      <pre className={classes('Log')}>
        <div
          dangerouslySetInnerHTML={{ __html: convert.toHtml(testLogs) }}
        ></div>
        {log}
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
