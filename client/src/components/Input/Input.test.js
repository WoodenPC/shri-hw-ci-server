import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Input } from './Input';

describe('тесты компонента Input', () => {
  test('Компонент рендерится', () => {
    const { container } = render(<Input />);
    expect(container.querySelector('div.Input')).toBeInTheDocument();
    expect(container.querySelector('input.Input-Box')).toBeInTheDocument();
  });

  test('Событие  onChange отрабатывает корректно', () => {
    let testValue = '0';
    const onChange = (e) => {
      testValue = e.target.value;
    };
    const { container } = render(
      <Input value={testValue} onChange={onChange} />
    );
    const input = container.querySelector('input');
    fireEvent.change(input, { target: { value: '333222111' } });
    expect(testValue).toBe('333222111');
  });

  test('Сброс значения инпута отрабатывает корректно', () => {
    let testValue = 'some test value';
    const onChange = (e) => {
      testValue = e.target.value;
    };
    const { container } = render(
      <Input value={testValue} onChange={onChange} />
    );

    const clearButton = container.querySelector('.Input-AddonAfter button');
    expect(clearButton).toBeInTheDocument();
    fireEvent.click(clearButton);
    expect(testValue).toBe('');
  });

  test('У компонента появляется модификатор short', () => {
    const { container } = render(<Input short />);
    expect(container.classList.contains('Input_short'));
  });
});
