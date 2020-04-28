import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Card } from './Card';

describe('Тесты компонента Card', () => {
  test('Компонент рендерится', () => {
    const { getByText } = render(
      <Card
        id='123'
        status='Success'
        buildNumber={123}
        hash='adscd123'
        who='test'
        title='test commit'
        branch='master'
      />
    );

    expect(getByText('test commit')).toBeInTheDocument();
  });

  test('Клик по компоненту отрабатывает корректно', () => {
    const testFunc = jest.fn();
    const { container } = render(<Card id='123' onClick={testFunc} />);
    fireEvent.click(container.querySelector('.Card'));
    expect(testFunc).toHaveBeenCalled();
  });

  test('У компонента есть модификатор status', () => {
    const { container } = render(<Card status='Success' />);
    expect(
      container.firstChild.classList.contains('Card_status_success')
    ).toBeTruthy();
  });
});
