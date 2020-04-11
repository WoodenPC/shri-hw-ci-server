import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Commit } from './Commit';

describe('Тесты компонента Commit', () => {
  test('Компонент рендерится', () => {
    const { getByText } = render(
      <Commit hash='testHash' branchName='master' />
    );
    expect(getByText('testHash')).toBeInTheDocument();
  });
});
