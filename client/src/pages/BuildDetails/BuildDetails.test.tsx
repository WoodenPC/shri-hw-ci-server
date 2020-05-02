import React from 'react';
import { fireEvent, waitForDomChange, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import '@testing-library/jest-dom/extend-expect';

import { renderWithStore } from 'utils/testUtils';
import { BuildDetailsPage } from './BuildDetails';

jest.mock('./selectors', () => ({
  __esModule: true,
  mapStateToProps: () => ({ repoName: 'testRepoName' }),
  mapDispatchToProps: () => ({
    runRebuildAsync: () => Promise.resolve({ id: 'buildTest2' }),
    loadBuildDetailsAsync: () =>
      Promise.resolve({
        id: 'buildTest1',
        status: 'Success',
        buildNumber: 123123,
        branchName: 'test-master',
        commitMessage: 'test commit',
        commitHash: '123qwe',
        authorName: 'test Author',
        start: new Date(2020, 1, 1).toString(),
      }),
    loadBuildLogsAsync: () => Promise.resolve('test logs 123'),
  }),
}));

describe('Тесты страницы BuildDetails', () => {
  test('Страница рендерится', () => {
    const history = createMemoryHistory({});
    const { container } = renderWithStore(
      <Router history={history}>
        <BuildDetailsPage />
      </Router>
    );
    expect(container.querySelector('div.Page')).toBeInTheDocument();
    expect(container.querySelector('main.Page-Main')).toBeInTheDocument();
  });

  test('При клике на настройки урл переходит на /settings', () => {
    const history = createMemoryHistory({});
    const { getByTestId } = renderWithStore(
      <Router history={history}>
        <BuildDetailsPage />
      </Router>
    );
    fireEvent.click(getByTestId('goToSettingsPage'));
    expect(history.location.pathname).toBe('/settings');
  });

  test('После рендера страницы подгружаются детали билда и его логи', async () => {
    const history = createMemoryHistory();
    history.push('/build/testBuild1');
    const { findByText, container } = renderWithStore(
      <Router history={history}>
        <BuildDetailsPage />
      </Router>
    );
    expect(container.querySelector('.Spinner')).toBeInTheDocument();
    expect(await findByText('#123123')).toBeInTheDocument();
    expect(await findByText('test-master')).toBeInTheDocument();
    expect(await findByText('test commit')).toBeInTheDocument();
    expect(await findByText('123qwe')).toBeInTheDocument();
    expect(await findByText('test logs 123')).toBeInTheDocument();
  });

  test('При клике на ребилд урл меняется на build/buildsTest2', async () => {
    const history = createMemoryHistory();
    history.push('/build/buildTest1');
    const { getByTestId, container } = renderWithStore(
      <Router history={history}>
        <BuildDetailsPage />
      </Router>
    );
    fireEvent.click(getByTestId('rebuildCurrent'));
    await waitFor(
      () => {
        expect(history.location.pathname).toBe('/build/buildTest2');
      },
      { container, timeout: 1000 }
    );
  });
});
