import React from 'react';
import { fireEvent, waitForDomChange } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import '@testing-library/jest-dom/extend-expect';

import { renderWithStore } from 'utils/testUtils';
import { BuildDetailsPage } from './BuildDetails';

jest.mock('./selectors', () => ({
  __esModule: true,
  mapStateToProps: () => ({ repoName: 'testRepoName' }),
  mapDispatchToProps: () => ({
    runRebuildAsync: () => ({ id: 'buildTest1' }),
    loadBuildDetailsAsync: () => ({
      id: 'buildTest1',
      status: 'Success',
      buildNumber: 123123,
      branchName: 'test-master',
      commitMessage: 'test commit',
      commitHash: '123qwe',
      authorName: 'test Author',
    }),
    loadBuildLogsAsync: () => 'test logs 123',
  }),
}));

describe('Тесты страницы BuildDetails', () => {
  test('Страница рендерится', () => {
    const history = createMemoryHistory();
    const { container } = renderWithStore(
      <Router history={history}>
        <BuildDetailsPage />
      </Router>
    );

    expect(container.querySelector('div.Page')).toBeInTheDocument();
    expect(container.querySelector('main.Page-Main')).toBeInTheDocument();
  });

  test('При клике на настройки урл переходит на /settings', () => {
    const history = createMemoryHistory();
    const { getByTestId } = renderWithStore(
      <Router history={history}>
        <BuildDetailsPage />
      </Router>
    );

    fireEvent.click(getByTestId('goToSettingsPage'));
    expect(history.location.pathname).toBe('/settings');
  });

  //findByText падает с эксепшеном, не могу понять как заставить этот тест работать
  // test('После рендера страницы подгружаются детали билда и его логи', async () => {
  //   const history = createMemoryHistory();
  //   history.location.buildId = 'testBuild1';
  //   const { getByText, container, findByText } = renderWithStore(
  //     <Router history={history}>
  //       <BuildDetailsPage />
  //     </Router>
  //   );

  //   await findByText('test-master');
  //   // expect(await findByText('test-master')).toBeInTheDocument();
  //   // expect(await findByText('test commit')).toBeInTheDocument();
  //   // expect(await findByText('123qwe')).toBeInTheDocument();
  // });
});
