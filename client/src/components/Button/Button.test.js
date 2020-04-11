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
    const iconContainer = container.querySelector('.Button-Icon');
    expect(iconContainer).not.toBe(null);
  });

  test('клик по кнопке вызывается', () => {
    const clickFunc = jest.fn();
    const { getByText } = render(<Button text='button' onClick={clickFunc} />);
    fireEvent.click(getByText('button'));
    expect(clickFunc).toHaveBeenCalled();
  });

  test('У компонента есть модификатор variant', () => {
    const { container } = render(<Button variant='text' />);
    expect(container.classList.contains('Button_variant_text'));
  });

  test('У компонента есть модификатор color', () => {
    const { container } = render(<Button color='primary' />);
    expect(container.classList.contains('Button_color_primary'));
  });

  test('У компонента есть модификатор size', () => {
    const { container } = render(<Button size='big' />);
    expect(container.classList.contains('Button_size_big'));
  });

  test('У компонента есть модификатор type', () => {
    const { container } = render(<Button type='icon' />);
    expect(container.classList.contains('Button_type_icon'));
  });
});
