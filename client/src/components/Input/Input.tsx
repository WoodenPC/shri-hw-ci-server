import React, { memo } from 'react';
import { cn } from '@bem-react/classname';
import { Button } from 'components/Button';
import { Icon } from 'components/Icon';
import { useCallback } from 'react';

interface IInputProps {
  value?: number | string,
  id?: string,
  onChange?: (...args: Array<any>) => any;
  type?: 'number' | 'text',
  placeholder?: string,
  short?: boolean,
  defaultValue?: number | string
}

const classes = cn('Input');

const Input: React.FunctionComponent<IInputProps> = memo(
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
