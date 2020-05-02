import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Footer } from './Footer';

describe('Тесты компонента Footer', () => {
  test('Компонент рендерится', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('footer.Footer')).toBeInTheDocument();
  });
});
