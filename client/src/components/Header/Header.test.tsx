import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Header } from './Header';

describe('Тесты компонента Header', () => {
  test('Компонент рендерится', () => {
    const { container } = render(
      <Header>
        <div id='testId'></div>
      </Header>
    );
    expect(container.querySelector('header.Header')).toBeInTheDocument();
    expect(
      container.querySelector('div.Header-Menu #testId')
    ).toBeInTheDocument();
  });

  test('У Title компонента появляется модификатор color, когда color прилетает в пропсы', () => {
    const { container } = render(<Header color='black' />);
    const title = container
        .querySelector('div.Header-Title') as HTMLElement;
    expect(title.classList.contains('Header-Title_color_black')).toBeTruthy();
  });
});
