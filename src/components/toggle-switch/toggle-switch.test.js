import {
  screen,
  render,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import ToggleSwitch from './toggle-switch';

const mockOnChange = jest.fn();
const mockInputOnChange = jest.fn();

const testProps = {
  id: 'test-id',
  name: 'test-name',
};

const testExtendedProps = {
  ...testProps,
  checked: true,
  input: {
    onChange: mockInputOnChange,
  },
  isPending: true,
};

const testPropsWithDisabled = {
  ...testProps,
  disabled: true,
};

const testPropsWithOnChange = {
  ...testProps,
  onChange: mockOnChange,
};

describe('Given ToggleSwitch', () => {
  const renderToggleSwitch = ({ ...props }) => render(
    <ToggleSwitch {...props} />
  );

  it('should render ToggleSwitch component', () => {
    const { getByTestId } = renderToggleSwitch(testProps);

    expect(getByTestId('toggle-switch')).toBeDefined();
  });

  it('should not be checked', () => {
    const { getByTestId } = renderToggleSwitch(testProps);

    const checkboxElement = getByTestId('toggle-switch-checkbox');

    expect(checkboxElement).toBeDefined();
    expect(checkboxElement).not.toBeChecked();
  });

  it('should not be disabled', () => {
    const { getByTestId } = renderToggleSwitch(testProps);

    const checkboxElement = getByTestId('toggle-switch-checkbox');

    expect(checkboxElement).toBeDefined();
    expect(checkboxElement).not.toBeDisabled();
  });

  it('should be checked', () => {
    const { getByTestId } = renderToggleSwitch(testExtendedProps);

    const checkboxElement = getByTestId('toggle-switch-checkbox');

    expect(checkboxElement).toBeDefined();
    expect(checkboxElement).toBeChecked();
  });

  it('should be disabled by isPending prop', () => {
    const { getByTestId } = renderToggleSwitch(testExtendedProps);

    const checkboxElement = getByTestId('toggle-switch-checkbox');

    expect(checkboxElement).toBeDefined();
    expect(checkboxElement).toBeDisabled();
  });

  it('should be disabled by disabled prop', () => {
    const { getByTestId } = renderToggleSwitch(testPropsWithDisabled);

    const checkboxElement = getByTestId('toggle-switch-checkbox');

    expect(checkboxElement).toBeDefined();
    expect(checkboxElement).toBeDisabled();
  });

  it('should invoke input.onChange callback', () => {
    renderToggleSwitch(testExtendedProps);

    fireEvent.click(screen.getByTestId('toggle-switch-checkbox'));

    expect(mockInputOnChange).toBeCalled();
  });

  it('should invoke onChange callback', () => {
    renderToggleSwitch(testPropsWithOnChange);

    fireEvent.click(screen.getByTestId('toggle-switch-checkbox'));

    expect(mockOnChange).toBeCalled();
  });
});
