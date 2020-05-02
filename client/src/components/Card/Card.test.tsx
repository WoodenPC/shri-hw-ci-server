import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Card } from './Card';
import { BuildStatus } from 'types/data.types';

describe('Тесты компонента Card', () => {
  test('Компонент рендерится', () => {
    const { getByText } = render(
      <Card
        id='123'
        status={BuildStatus.Success}
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
    const card = container.querySelector('.Card') as HTMLElement;
    fireEvent.click(card);
    expect(testFunc).toHaveBeenCalled();
  });

  test('У компонента есть модификатор status', () => {
    const { container } = render(<Card status={BuildStatus.Success} />);
    const firstChild = container.firstChild as HTMLElement;
    expect(firstChild.classList.contains('Card_status_success')).toBeTruthy();
  });
});
