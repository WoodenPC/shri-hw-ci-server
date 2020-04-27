import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Spinner } from './Spinner';

describe('Тесты компонента Spinner', () => {
  test('Компонент рендерится', () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector('div.Spinner')).toBeInTheDocument();
  });
});
