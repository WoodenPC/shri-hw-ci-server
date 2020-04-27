import React, { memo } from 'react';
import { cn } from '@bem-react/classname';

interface IModalProps {
  visible: boolean;
}

const classes = cn('Modal');

const Modal: React.FunctionComponent<IModalProps> = memo(({ visible, children }) => {
  return (
    <div className={classes({ visible })}>
      <div className={classes('Wrapper')}>
        <div className={classes('Content')}>{children}</div>
      </div>
    </div>
  );
});

Modal.defaultProps = {
  visible: false,
};

export { Modal };
