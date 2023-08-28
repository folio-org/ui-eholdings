import {
  render,
  cleanup,
} from '@folio/jest-config-stripes/testing-library/react';

import Harness from '../../../../../../test/jest/helpers/harness';

import HoldingStatus from './holding-status';

describe('Given HoldingStatus', () => {
  let component;
  const onToggleMock = jest.fn();
  const onAddToHoldingsMock = jest.fn();

  const renderHoldingStatus = (props = {}) => render(
    <Harness>
      <HoldingStatus
        isOpen
        onToggle={onToggleMock}
        onAddToHoldings={onAddToHoldingsMock}
        model={{}}
        {...props}
      />
    </Harness>
  );

  afterEach(() => {
    cleanup();
    onToggleMock.mockClear();
  });

  it('should render an accordion', () => {
    component = renderHoldingStatus();
    expect(component.getByText('ui-eholdings.label.holdingStatus')).toBeDefined();
  });

  it('should display selection status', () => {
    component = renderHoldingStatus();
    expect(component.getByTestId('package-selection-status')).toBeDefined();
  });
});
