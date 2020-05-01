import React from 'react';
import { fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import '@testing-library/jest-dom/extend-expect';

import { renderWithStore } from 'utils/testUtils';
import { BuildHistoryPage } from './BuildHistory';

jest.mock('./selectors', () => ({
  __esModule: true,
  mapStateToProps: () => ({
    builds: [
      { id: 'testBuild1', commitMessage: 'testBuild1' },
      { id: 'testBuild2', commitMessage: 'testBuild2' },
    ],
    offset: 2,
    limit: 2,
    repoName: 'testRepoName',
  }),
  mapDispatchToProps: () => ({
    loadBuildsAsync: jest.fn(),
    runBuildAsync: jest.fn(),
  }),
}));

describe('Тесты странички BuildHistory', () => {
  test('Страница рендерится', () => {
    const history = createMemoryHistory();
    const { container } = renderWithStore(
      <Router history={history}>
        <BuildHistoryPage />
      </Router>
    );

    expect(container.querySelector('div.Page')).toBeInTheDocument();
    expect(container.querySelector('main.Page-Main')).toBeInTheDocument();
  });

  test('При клике на Run Build, открывается модальное окно', () => {
    const history = createMemoryHistory();
    const { container, getByTestId } = renderWithStore(
      <Router history={history}>
        <BuildHistoryPage />
      </Router>
    );

    fireEvent.click(getByTestId('openRunBuildModal'));
    const modal = container.querySelector('div.Modal') as HTMLElement;
    expect(modal.classList.contains('Modal_visible')).toBeTruthy();
  });

  test('При клике на настройки, урл переходит на /settings', () => {
    const history = createMemoryHistory();
    const { getByTestId } = renderWithStore(
      <Router history={history}>
        <BuildHistoryPage />
      </Router>
    );

    fireEvent.click(getByTestId('goToSettingsPage'));
    expect(history.location.pathname).toBe('/settings');
  });

  test('При клике на билд, урл переходит на /builds/buildId', () => {
    const history = createMemoryHistory();
    const { getByText } = renderWithStore(
      <Router history={history}>
        <BuildHistoryPage />
      </Router>
    );

    fireEvent.click(getByText('testBuild1'));
    expect(history.location.pathname).toBe('/build/testBuild1');
  });
});
