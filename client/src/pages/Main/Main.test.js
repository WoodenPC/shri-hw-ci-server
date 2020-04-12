import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import '@testing-library/jest-dom/extend-expect';

import { MainPage } from './Main';

describe('тесты страницы Main', () => {
  test('Страница рендерится', () => {
    const history = createMemoryHistory();
    const { container } = render(
      <Router history={history}>
        <MainPage />
      </Router>
    );
    expect(container.querySelector('div.Page')).toBeInTheDocument();
    expect(container.querySelector('main.Page-Main')).toBeInTheDocument();
  });

  test('При клике на кнопку Open settings, идет переход по урлу /settings', () => {
    const history = createMemoryHistory();
    const { getByText } = render(
      <Router history={history}>
        <MainPage />
      </Router>
    );

    const button = getByText('Open settings');
    fireEvent.click(button);
    expect(history.location.pathname).toBe('/settings');
  });
});
