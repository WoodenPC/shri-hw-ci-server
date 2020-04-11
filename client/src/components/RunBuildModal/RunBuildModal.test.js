import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { RunBuildModal } from './RunBuildModal';

describe('Тесты компонента RunBuildModal', () => {
  test('Компонент рендерится', () => {
    const { container } = render(<RunBuildModal visible />);
    expect(container).toBeInTheDocument();
  });

  test('Событие onRunBuild отрабатывает корректно', () => {
    const onRunBuild = jest.fn();
    const { getByText, getByPlaceholderText } = render(
      <RunBuildModal visible onRunBuild={onRunBuild} />
    );
    const testHashValue = '123testHash';
    fireEvent.change(getByPlaceholderText('Commit hash'), {
      target: { value: testHashValue },
    });

    fireEvent.click(getByText('Run build'));

    expect(onRunBuild).toHaveBeenCalledWith(testHashValue);
  });

  test('Событие onCancel отрабатывает корректно', () => {
    const onCancel = jest.fn();
    const { getByText } = render(<RunBuildModal onCancel={onCancel} visible />);
    fireEvent.click(getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });
});
