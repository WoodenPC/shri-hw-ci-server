import React, { memo } from 'react';
import { cn } from '@bem-react/classname';
import PropTypes from 'prop-types';

const classes = cn('Button');

const Button = memo(
  ({
    variant,
    text,
    icon,
    size,
    color,
    onClick,
    classMix,
    disabled,
    dataTestId,
  }) => {
    const type = icon ? 'icon' : null;
    return (
      <button
        data-testid={dataTestId}
        className={`${classes({ variant, color, size, type })} ${classMix}`}
        onClick={onClick}
        type='button'
        disabled={disabled}
      >
        {icon && <span className={classes('Icon')}>{icon}</span>}
        {text && <span className={classes('Text')}>{text}</span>}
      </button>
    );
  }
);

Button.propTypes = {
  variant: PropTypes.oneOf(['outlined', 'text']),
  text: PropTypes.string,
  icon: PropTypes.element,
  size: PropTypes.oneOf(['medium', 'big']),
  onClick: PropTypes.func,
  color: PropTypes.oneOf(['default', 'primary', 'secondary']),
  classMix: PropTypes.string,
  disabled: PropTypes.bool,
  dataTestId: PropTypes.string,
};

Button.defaultProps = {
  variant: 'text',
  text: null,
  icon: null,
  size: 'medium',
  onClick: undefined,
  color: 'default',
  classMix: '',
  disabled: false,
  dataTestId: '',
};

export { Button };
