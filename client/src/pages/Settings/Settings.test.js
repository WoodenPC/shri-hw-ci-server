import React from 'react';
import { fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import '@testing-library/jest-dom/extend-expect';

import { renderWithStore } from 'utils/testUtils';
import { SettingsPage } from './Settings';

describe('Тесты странички Settings', () => {
  const testSettings = {
    repoName: 'testRepo',
    buildCommand: 'testCommand',
    mainBranch: 'testBranch',
    period: 99,
  };

  test('Страница рендерится', () => {
    const history = createMemoryHistory();
    const { container } = renderWithStore(
      <Router history={history}>
        <SettingsPage />
      </Router>
    );

    expect(container.querySelector('div.Page')).toBeInTheDocument();
    expect(container.querySelector('main.Page-Main')).toBeInTheDocument();
  });

  test('После монтирования компонента в инпуты попадают данные из стора', () => {
    const history = createMemoryHistory();
    const { getByPlaceholderText } = renderWithStore(
      <Router history={history}>
        <SettingsPage />
      </Router>,
      {
        settings: {
          ...testSettings,
        },
      }
    );

    expect(getByPlaceholderText('user-name/repo-name')).toHaveTextContent('');
    expect(getByPlaceholderText('master')).toHaveTextContent('');
    expect(getByPlaceholderText('npm ci && npm run build')).toHaveTextContent(
      ''
    );
    expect(getByPlaceholderText('timing')).toHaveTextContent('');
  });

  test('При нажатии на кнопку cancel происходит возврат на предыдующую страницу', () => {
    const history = createMemoryHistory();
    history.push('/');
    const { getByText } = renderWithStore(
      <Router history={history}>
        <SettingsPage />
      </Router>
    );

    history.push('/settings');

    const button = getByText('Cancel');
    fireEvent.click(button);
    expect(history.location.pathname).toBe('/');
  });
});
