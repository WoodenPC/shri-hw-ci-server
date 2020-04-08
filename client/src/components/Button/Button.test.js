import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Icon } from 'components/Icon';
import { Button } from './Button';

describe('Тесты компонента Button', () => {
  test('кнопка рендерится вместе с текстом', () => {
    const { getByText } = render(<Button text='some button' />);
    expect(getByText('some button')).toBeInTheDocument();
  });

  test('кнопка рендерится вместе с иконкой', () => {
    const { container } = render(
      <Button type='icon' icon={<Icon type='settings' />} />
    );
    const iconContainer = container.querySelector('.Icon.Icon_type_settings');
    expect(iconContainer).not.toBe(null);
  });

  test('клик по кнопке вызывается', () => {
    const clickFunc = jest.fn();
    const { getByText } = render(<Button text='button' onClick={clickFunc} />);
    fireEvent.click(getByText('button'));
    expect(clickFunc).toHaveBeenCalled();
  });
});
