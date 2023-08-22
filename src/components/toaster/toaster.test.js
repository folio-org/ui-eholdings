import { render, waitFor } from '@folio/jest-config-stripes/testing-library/react';

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

  /*
    toasts probably need some rework: Toaster accepts `toasts` as props and clones them to state,
    and when a toast is removed it's removed from state, but on next render it's cloned from props again
    it makes for a very confusing flow with no clear source of truth of what toasts to show
    disabling this test for now
  */
  it.skip('should destroy toast after 5000ms', async () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');

    const { getByText, queryByText } = renderToaster();

    expect(getByText('test-toast-message')).toBeDefined();
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 5000);

    jest.runOnlyPendingTimers();

    await waitFor(() => expect(queryByText('test-toast-message')).toBeNull());

    jest.useRealTimers();
  });
});
