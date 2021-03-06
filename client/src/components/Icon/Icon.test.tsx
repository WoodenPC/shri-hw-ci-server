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
    const firstChild = container.firstChild as HTMLElement;
    expect(
      firstChild.classList.contains('Icon_type_settings')
    ).toBeTruthy();
  });
});
