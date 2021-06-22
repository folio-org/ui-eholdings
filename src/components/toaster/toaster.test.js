import { render } from '@testing-library/react';

import Toaster from './toaster';

const testEmptyToasts = [];

const testToasts = [
  {
    id: 'test-toast-id',
    message: 'test-toast-message',
  },
];

describe('Given Toaster', () => {
  const renderToaster = (props = {
    toasts: testToasts,
  }) => render(
    <Toaster
      toasts={props.toasts}
      {...props}
    />
  );

  it('should render Toaster component', () => {
    const { getByTestId } = renderToaster();

    expect(getByTestId('toaster-container')).toBeDefined();
  });

  it('should not display toast message', () => {
    const { queryByText } = renderToaster({ toasts: testEmptyToasts });

    expect(queryByText('test-toast-message')).toBeNull();
  });

  it('should display toast message', () => {
    const { getByText } = renderToaster();

    expect(getByText('test-toast-message')).toBeDefined();
  });

  it('should destroy toast after 5000ms', () => {
    jest.useFakeTimers();

    const { getByText, queryByText } = renderToaster();

    expect(getByText('test-toast-message')).toBeDefined();
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 5000);

    jest.runAllTimers();

    expect(queryByText('test-toast-message')).toBeNull();

    jest.useRealTimers();
  });
});
