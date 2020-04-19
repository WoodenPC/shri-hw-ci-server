import React, { memo } from 'react';
import { cn } from '@bem-react/classname';
import PropTypes from 'prop-types';
import { Button } from 'components/Button/Button';
import { Icon } from 'components/Icon/Icon';
import { useCallback } from 'react';

const classes = cn('Input');

const Input = memo(
  ({ value, onChange, placeholder, type, short, defaultValue, id }) => {
    const clearValue = useCallback(() => {
      if (onChange !== undefined) {
        onChange({ target: { value: '' } });
      }
    }, [onChange]);

    return (
      <div className={classes({ short })}>
        <input
          id={id}
          className={classes('Box')}
          value={value}
          onChange={onChange}
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
        />
        {onChange && (
          <div className={classes('AddonAfter')}>
            <Button icon={<Icon type='clear' />} onClick={clearValue} />
          </div>
        )}
      </div>
    );
  }
);

Input.propTypes = {
  id: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onChange: PropTypes.func,
  type: PropTypes.oneOf(['number', 'text']),
  placeholder: PropTypes.string,
  short: PropTypes.bool,
  defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

Input.defaultProps = {
  id: undefined,
  value: undefined,
  onChange: undefined,
  type: 'text',
  placeholder: '',
  short: false,
  defaultValue: undefined,
};

export { Input };
