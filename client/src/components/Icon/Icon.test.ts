import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Icon } from './Icon';

describe('Тесты компонента Icon', () => {
  test('Компонент рендерится', () => {
    const { container } = render(<Icon />);
    expect(container.querySelector('span.Icon')).toBeInTheDocument();
  });

  test('У компонента появляется модификатор type', () => {
    const { container } = render(<Icon type='settings' />);
    expect(
      container.firstChild.classList.contains('Icon_type_settings')
    ).toBeTruthy();
  });
});
