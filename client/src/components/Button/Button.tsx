import React, { memo, ReactElement } from 'react';
import { cn } from '@bem-react/classname';

const classes = cn('Button');

type ButtonProps = {
  variant?: 'outlined' | 'text';
  text?: string;
  icon?: ReactElement;
  size?: 'medium' | 'big';
  color?: 'default' | 'primary' | 'secondary';
  classMix?: string;
  disabled?: boolean;
  dataTestId?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const Button: React.FC<ButtonProps> = memo(
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
    const type = icon ? 'icon' : undefined;
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

Button.defaultProps = {
  variant: 'text',
  size: 'medium',
  color: 'default',
  classMix: '',
  disabled: false,
  dataTestId: '',
};

export { Button };
