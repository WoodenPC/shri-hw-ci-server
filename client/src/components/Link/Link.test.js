import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Link } from './Link';

describe('Тесты компонента Link', () => {
  test('Компонент рендерится', () => {
    const { container } = render(<Link text='testLink' />);
    expect(container.querySelector('a.Link')).toBeInTheDocument();
  });
});
