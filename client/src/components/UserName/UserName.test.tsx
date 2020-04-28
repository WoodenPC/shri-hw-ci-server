import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { UserName } from './UserName';

describe('Тесты компонента UserName', () => {
  test('Компонент рендерится', () => {
    const { container } = render(<UserName name='Test' />);
    expect(container.querySelector('div.UserName')).toBeInTheDocument();
  });
});
