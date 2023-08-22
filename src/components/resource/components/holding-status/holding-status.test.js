import {
  render,
  cleanup,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import Harness from '../../../../../test/jest/helpers/harness';

import HoldingStatus from './holding-status';

describe('Given HoldingStatus', () => {
  let component;
  const onToggleMock = jest.fn();
  const onAddToHoldingsMock = jest.fn();

  const defaultModel = {
    update: {
      isPending: false,
      changedAttributes: {},
    },
    destroy: {
      isPending: false,
    },
    isSelected: true,
  };

  const renderHoldingStatus = (props = {}) => render(
    <Harness>
      <HoldingStatus
        isOpen
        onToggle={onToggleMock}
        model={defaultModel}
        resourceSelected
        onAddToHoldings={onAddToHoldingsMock}
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

  describe('when model is loading', () => {
    it('should render spinner', () => {
      component = renderHoldingStatus({
        model: {
          ...defaultModel,
          update: {
            isPending: true,
            changedAttributes: {},
          },
        },
      });
      expect(component.queryByTestId('spinner')).toBeDefined();
    });
  });

  it('should render selected message', () => {
    component = renderHoldingStatus();
    expect(component.getByText('ui-eholdings.selected')).toBeDefined();
  });

  describe('when resource is not selected', () => {
    it('should render add to holdings button', () => {
      component = renderHoldingStatus({
        resourceSelected: false,
      });
      expect(component.getByText('ui-eholdings.addToHoldings')).toBeDefined();
    });
  });

  it('should call onAddToHoldings', () => {
    component = renderHoldingStatus({
      resourceSelected: false,
    });

    fireEvent.click(component.getByTestId('resource-add-to-holdings-button'));

    expect(onAddToHoldingsMock.mock.calls.length).toEqual(1);
  });
});
