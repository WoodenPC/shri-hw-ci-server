import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createClientStore } from 'store/store';

/**
 * функция рендера для тестов, которая умеет в Redux
 */
export function renderWithStore(
  ui,
  { store = createClientStore(), ...renderOptions } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}
