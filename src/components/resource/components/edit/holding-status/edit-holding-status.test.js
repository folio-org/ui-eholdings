import {
  render,
  cleanup,
  fireEvent,
} from '@testing-library/react';

import Harness from '../../../../../../test/jest/helpers/harness';

import HoldingStatus from './edit-holding-status';

describe('Given HoldingStatus', () => {
  const handleSectionToggleMock = jest.fn();
  const handleToggleResourceHoldingsMock = jest.fn();
  const defaultModel = {
    update: {
      isPending: false,
    },
    isSelected: true,
  };

  const renderHoldingStatus = (props = {}) => render(
    <Harness>
      <HoldingStatus
        isOpen
        getSectionHeader={() => 'Holding status'}
        handleSectionToggle={handleSectionToggleMock}
        model={defaultModel}
        resourceIsCustom
        resourceSelected
        isSelectInFlight={false}
        handleToggleResourceHoldings={handleToggleResourceHoldingsMock}
        {...props}
      />
    </Harness>
  );

  afterEach(() => {
    cleanup();
    handleSectionToggleMock.mockClear();
    handleToggleResourceHoldingsMock.mockClear();
  });

  it('should render an accordion', () => {
    const { getByText } = renderHoldingStatus();

    expect(getByText('Holding status')).toBeDefined();
  });

  describe('when model is loading', () => {
    it('should show spinner', () => {
      const { queryByTestId } = renderHoldingStatus({
        model: {
          update: {
            isPending: true,
          },
        },
      });

      expect(queryByTestId('spinner')).toBeDefined();
    });
  });

  describe('when select update is in flight', () => {
    it('should not show add to holdings button', () => {
      const { queryByTestId } = renderHoldingStatus({
        isSelectInFlight: true,
        resourceIsCustom: false,
        model: {
          ...defaultModel,
          isSelected: false,
        },
      });

      expect(queryByTestId('resource-add-to-holdings-button')).toBeDefined();
    });
  });

  describe('when clicking on add to holdings button', () => {
    it('should call handleToggleResourceHoldings', () => {
      const { getByTestId } = renderHoldingStatus({
        resourceSelected: false,
        resourceIsCustom: false,
      });

      fireEvent.click(getByTestId('resource-add-to-holdings-button'));

      expect(handleToggleResourceHoldingsMock).toBeCalled();
    });
  });
});
