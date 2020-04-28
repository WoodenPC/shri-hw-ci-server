import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Icon } from 'components/Icon';
import { Button } from './Button';

describe('Тесты компонента Button', () => {
  test('кнопка рендерится вместе с текстом', () => {
    const { getByText, getByTestId } = render(
      <Button dataTestId='someTestId' text='some button' />
    );
    expect(getByText('some button')).toBeInTheDocument();
    expect(getByTestId('someTestId')).toBeInTheDocument();
  });

  test('кнопка рендерится вместе с иконкой', () => {
    const { container } = render(
      <Button icon={<Icon type='settings' />} />
    );
    const icon = container.querySelector('.Button-Icon');
    expect(icon).toBeInTheDocument();
  });

  test('клик по кнопке вызывается', () => {
    const clickFunc = jest.fn();
    const { getByText } = render(<Button text='button' onClick={clickFunc} />);
    fireEvent.click(getByText('button'));
    expect(clickFunc).toHaveBeenCalled();
  });

  test('У компонента есть модификатор variant', () => {
    const { container } = render(<Button variant='text' />);
    const firstChild = container.firstChild as HTMLElement;
    expect(
      firstChild!.classList.contains('Button_variant_text')
    ).toBeTruthy();
  });

  test('У компонента есть модификатор color', () => {
    const { container } = render(<Button color='primary' />);
    const firstChild = container.firstChild as HTMLElement;
    expect(
      firstChild.classList.contains('Button_color_primary')
    ).toBeTruthy();
  });

  test('У компонента есть модификатор size', () => {
    const { container } = render(<Button size='big' />);
    const firstChild = container.firstChild as HTMLElement;
    expect(
      firstChild.classList.contains('Button_size_big')
    ).toBeTruthy();
  });

  test('У компонента есть модификатор type', () => {
    const { container } = render(<Button icon={<Icon />} />);
    const firstChild = container.firstChild as HTMLElement;
    expect(
      firstChild.classList.contains('Button_type_icon')
    ).toBeTruthy();
  });
});
