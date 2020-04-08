import React, { memo } from 'react';
import { cn } from '@bem-react/classname';
import PropTypes from 'prop-types';

const classes = cn('Modal');

const Modal = memo(({ visible, children }) => {
  return (
    <div className={classes({ visible })}>
      <div className={classes('Wrapper')}>
        <div className={classes('Content')}>{children}</div>
      </div>
    </div>
  );
});

Modal.propTypes = {
  visible: PropTypes.bool,
};

Modal.defaultProps = {
  visible: false,
};

export { Modal };
