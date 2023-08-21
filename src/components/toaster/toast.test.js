import {
  screen,
  render,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import Toast from './toast';

describe('Given Toast', () => {
  const mockOnClose = jest.fn();

  const renderToast = (props = {
    type: 'warn',
  }) => render(
    <Toast
      id="test-id"
      onClose={mockOnClose}
      type={props.type}
      {...props}
    >
      <div>Child element</div>
    </Toast>
  );

  it.skip('should invoke onClose callback after 5000ms when initially rendered', () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');

    renderToast();

    expect(mockOnClose).not.toBeCalled();
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 5000);

    jest.runAllTimers();

    expect(mockOnClose).toBeCalled();
    expect(mockOnClose).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });

  it('should display warn type toast', () => {
    const { getByTestId } = renderToast();

    expect(getByTestId('type-warn')).toBeDefined();
  });

  it('should display success type toast', () => {
    const { getByTestId } = renderToast({ type: 'success' });

    expect(getByTestId('type-success')).toBeDefined();
  });

  it('should display error type toast', () => {
    const { getByTestId } = renderToast({ type: 'error' });

    expect(getByTestId('type-error')).toBeDefined();
  });

  it('should render children', () => {
    const { getByText } = renderToast();

    expect(getByText('Child element')).toBeDefined();
  });

  it('should render close button', () => {
    const { getByTestId } = renderToast();

    expect(getByTestId('toast-close-btn')).toBeDefined();
  });

  it('should invoke onClose callback', () => {
    renderToast();

    fireEvent.click(screen.getByTestId('toast-close-btn'));

    expect(mockOnClose).toBeCalled();
  });
});
