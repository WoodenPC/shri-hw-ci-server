import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Form } from './Form';
import { FormField } from './FormField';
import { FormFooter } from './FormFooter';
import { FormHeader } from './FormHeader';

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
      <FormField>
        <div id='testDiv'>testContent</div>
      </FormField>
    );
    expect(container.querySelector('div.FormField')).toBeInTheDocument();
    expect(container.querySelector('div#testDiv')).toBeInTheDocument();
  });

  test('У FormField есть label', () => {
    const { getByText } = render(<FormField label='testLabel' />);
    expect(getByText('testLabel')).toBeInTheDocument();
  });

  test('У FormField есть suffix', () => {
    const { getByText } = render(<FormField suffix='testSuffix' />);
    expect(getByText('testSuffix')).toBeInTheDocument();
  });

  test('У FormField есть модификатор required, когда поле обязательно к заполнению', () => {
    const { container } = render(<FormField required />);
    const firstChild = container.firstChild as HTMLElement;
    expect(
      firstChild.classList.contains('FormField_required')
    ).toBeTruthy();
  });
});

describe('Тесты компонента FormFooter', () => {
  test('Компонент рендерится', () => {
    const { container } = render(
      <FormFooter>
        <div id='testDiv'>testContent</div>
      </FormFooter>
    );
    expect(container.querySelector('div.Form-Footer')).toBeInTheDocument();
    expect(container.querySelector('div#testDiv')).toBeInTheDocument();
  });
});

describe('Тесты компонента FormHeader', () => {
  test('Компонент рендерится', () => {
    const { container } = render(
      <FormHeader title='testTitle' description='testDesc' />
    );
    expect(container.querySelector('div.Form-Header')).toBeInTheDocument();
  });
});
