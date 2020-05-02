import React, { ReactElement, ReactNode, ComponentType } from 'react';
import { render as rtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { createClientStore } from 'store/store';

interface IWrapperProps {
  children: ReactNode
}

/**
 * функция рендера для тестов, которая умеет в Redux
 */
export const renderWithStore = (
  ui: ReactElement,
  { store = createClientStore(), ...renderOptions } = {}
) => {
  function Wrapper({ children }: IWrapperProps) {
    return <Provider store={store}>{children}</Provider>;
  }
  return rtlRender(ui, { wrapper: Wrapper as ComponentType, ...renderOptions });
};

/** функция создания стора для тестов */
export const mockStoreCreator = () => {
  const middlewares = [thunk];
  const creator = configureMockStore(middlewares);
  return creator;
};
