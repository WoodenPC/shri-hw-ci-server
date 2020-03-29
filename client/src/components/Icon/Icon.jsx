import React, { memo } from 'react';
import { cn } from '@bem-react/classname';
import PropTypes from 'prop-types';

const classes = cn('Icon');

const Icon = memo(({ type }) => {
  return <span className={classes({ type })}></span>;
});

Icon.propTypes = {
  type: PropTypes.string,
};

Icon.defaultProps = {
  type: '',
};

export { Icon };
