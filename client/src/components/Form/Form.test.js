import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Form } from './Form';

describe('Тесты компонента Form', () => {
  test('Компонент рендерится', () => {
    const { container } = render(
      <Form>
        <div id='testId'></div>
      </Form>
    );
    expect(container.querySelector('form.Form')).toBeInTheDocument();
    expect(container.querySelector('div#testId')).toBeInTheDocument();
  });
});

describe('Тесты компонента FormField', () => {
  test('Компонент рендерится', () => {
    const { container } = render(
      <Form.Field>
        <div id='testDiv'>testContent</div>
      </Form.Field>
    );
    expect(container.querySelector('div.FormField')).toBeInTheDocument();
    expect(container.querySelector('div#testDiv')).toBeInTheDocument();
  });

  test('У FormField есть label', () => {
    const { getByText } = render(<Form.Field label='testLabel' />);
    expect(getByText('testLabel')).toBeInTheDocument();
  });

  test('У FormField есть suffix', () => {
    const { getByText } = render(<Form.Field suffix='testSuffix' />);
    expect(getByText('testSuffix')).toBeInTheDocument();
  });

  test('У FormField есть модификатор required, когда поле обязательно к заполнению', () => {
    const { container } = render(<Form.Field required />);
    expect(container.classList.contains('FormField_required'));
  });
});

describe('Тесты компонента FormFooter', () => {
  test('Компонент рендерится', () => {
    const { container } = render(
      <Form.Footer>
        <div id='testDiv'>testContent</div>
      </Form.Footer>
    );
    expect(container.querySelector('div.Form-Footer')).toBeInTheDocument();
    expect(container.querySelector('div#testDiv')).toBeInTheDocument();
  });
});

describe('Тесты компонента FormHeader', () => {
  test('Компонент рендерится', () => {
    const { container } = render(
      <Form.Header title='testTitle' description='testDesc' />
    );
    expect(container.querySelector('div.Form-Header')).toBeInTheDocument();
  });
});
