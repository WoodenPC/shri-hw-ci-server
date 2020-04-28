import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { LogDetails } from './LogDetails';

describe('Тесты компонента LogDetails', () => {
  test('Компонент рендерится', () => {
    const { container } = render(<LogDetails log='some test log' />);
    expect(container.querySelector('div.LogDetails')).toBeInTheDocument();
    expect(container.querySelector('pre.LogDetails-Log')).toBeInTheDocument();
  });
});
