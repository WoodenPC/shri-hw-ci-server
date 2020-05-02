import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Modal } from './Modal';

describe('Тесты компонента Modal', () => {
  test('Компонент рендерится', () => {
    const { container } = render(
      <Modal>
        <div id='testId'></div>
      </Modal>
    );
    expect(container.querySelector('div.Modal')).toBeInTheDocument();
    expect(container.querySelector('div#testId')).toBeInTheDocument();
  });

  test('У компонента есть модификатор visible', () => {
    const { container } = render(<Modal visible />);
    const firstChild = container.firstChild as HTMLElement;
    expect(
      firstChild.classList.contains('Modal_visible')
    ).toBeTruthy();
  });
});
