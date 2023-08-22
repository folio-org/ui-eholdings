import { render } from '@folio/jest-config-stripes/testing-library/react';

import SelectionStatus from './selection-status';

const model = {
  isPartiallySelected: false,
  isSelected: true,
  selectedCount: 0,
  titleCount: 0,
  isInFlight: false,
};

describe('Given SelectionStatus', () => {
  const renderSelectionStatus = (props = {}) => render(
    <SelectionStatus
      model={model}
      onAddToHoldings={jest.fn()}
      {...props}
    />
  );

  it('should render SelectionStatus component', () => {
    const { getByTestId } = renderSelectionStatus();

    expect(getByTestId('package-selection-status')).toBeDefined();
  });

  it('should display selection status message', () => {
    const { getByTestId } = renderSelectionStatus();

    expect(getByTestId('selection-status-message')).toBeDefined();
  });

  it('should not display selection status message', () => {
    const { queryByTestId } = renderSelectionStatus({
      model: {
        ...model,
        isInFlight: true,
      },
    });

    expect(queryByTestId('selection-status-message')).toBeNull();
  });

  it('should display `selected` selection status message', () => {
    const { getByText } = renderSelectionStatus();

    expect(getByText('ui-eholdings.selected')).toBeDefined();
  });

  it('should display `not selected` selection status message', () => {
    const { getByText } = renderSelectionStatus({
      model: {
        ...model,
        isSelected: false,
      },
    });

    expect(getByText('ui-eholdings.notSelected')).toBeDefined();
  });

  it('should display `partially selected` selection status message', () => {
    const { getByText } = renderSelectionStatus({
      model: {
        ...model,
        isPartiallySelected: true,
      },
    });

    expect(getByText('ui-eholdings.package.partiallySelected')).toBeDefined();
  });

  it('should not display add to holdings button', () => {
    const { queryByTestId } = renderSelectionStatus();

    expect(queryByTestId('add-to-holdings-button')).toBeNull();
  });

  it('should display `add all to holdings` button', () => {
    const { getByRole } = renderSelectionStatus({
      model: {
        ...model,
        isPartiallySelected: true,
      },
    });

    expect(getByRole('button', { name: 'ui-eholdings.addAllToHoldings' })).toBeDefined();
  });

  it('should display `add package to holdings` button', () => {
    const { getByRole } = renderSelectionStatus({
      model: {
        ...model,
        isSelected: false,
      },
    });

    expect(getByRole('button', { name: 'ui-eholdings.addPackageToHoldings' })).toBeDefined();
  });
});
