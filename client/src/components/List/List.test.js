import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { List } from './List';

describe('Тесты компонента List', () => {
  test('Компонент рендерится', () => {
    const { container } = render(
      <List>
        <div id='testId'></div>
      </List>
    );
    expect(container.querySelector('div.List')).toBeInTheDocument();
    expect(container.querySelector('div#testId')).toBeInTheDocument();
  });

  test('У компонента есть модификатор direction', () => {
    const { container } = render(<List direction='row' />);
    expect(container.classList.contains('List_direction_col'));
  });

  test('Эвент onShowMore отрабатывает корректно', () => {
    const testShowMore = jest.fn();
    const { getByText } = render(<List onShowMore={testShowMore} />);
    const button = getByText('Show more');
    fireEvent.click(button);
    expect(testShowMore).toHaveBeenCalled();
  });
});

describe('Тесты компонента ListItem', () => {
  test('Компонент рендерится', () => {
    const { container } = render(
      <List.Item>
        <div id='testId'></div>
      </List.Item>
    );
    expect(container.querySelector('div.List-Item')).toBeInTheDocument();
    expect(container.querySelector('div#testId')).toBeInTheDocument();
  });
});
