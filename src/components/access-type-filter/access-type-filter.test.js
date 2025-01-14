import { act } from 'react';

import { render } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { AccessTypesFilter } from './access-type-filter';

const mockOnStandaloneFilterChange = jest.fn();
const mockOnStandaloneFilterToggle = jest.fn();
const mockHandleStandaloneFilterChange = jest.fn();

const accessTypesStoreData = {
  items: {
    data: [
      {
        id: '1',
        attributes: { name: 'Open Access' },
      },
      {
        id: '2',
        attributes: { name: 'Restricted Access' },
      },
    ],
  },
  isLoading: false,
  isDeleted: false,
};

const dataOptions = [
  { label: 'Open Access', value: 'open-access' },
  { label: 'Restricted Access', value: 'restricted-access' },
];

const renderAccessTypeFilter = (props = {}) => render(
  <AccessTypesFilter
    accessTypesStoreData={accessTypesStoreData}
    searchByAccessTypesEnabled={false}
    selectedValues={[]}
    onStandaloneFilterChange={mockOnStandaloneFilterChange}
    onStandaloneFilterToggle={mockOnStandaloneFilterToggle}
    dataOptions={dataOptions}
    handleStandaloneFilterChange={mockHandleStandaloneFilterChange}
    {...props}
  />
);

describe('AccessTypesFilter', () => {
  it('should render loading', () => {
    const { getByTestId } = renderAccessTypeFilter({
      accessTypesStoreData: {
        ...accessTypesStoreData,
        isLoading: true,
      },
    });

    expect(getByTestId('spinner-ellipsis')).toBeInTheDocument();
  });

  describe('when there are no access types', () => {
    it('should render nothing', () => {
      const { container } = renderAccessTypeFilter({
        accessTypesStoreData: {
          ...accessTypesStoreData,
          items: { data: [] },
        },
      });

      expect(container).toBeEmptyDOMElement();
    });
  });

  it('should render access types filter', () => {
    const { getByText } = renderAccessTypeFilter();

    expect(getByText('ui-eholdings.accessTypes.filter')).toBeInTheDocument();
  });

  describe('when hitting the clear icon', () => {
    it('should call onStandaloneFilterChange', async () => {
      const { getByRole } = renderAccessTypeFilter({
        selectedValues: ['open-access'],
        showClearButton: true,
      });

      await act(() => userEvent.click(getByRole('button', { name: /clear/i })));

      expect(mockOnStandaloneFilterChange).toHaveBeenCalledWith({ 'access-type': undefined });
    });
  });

  describe('when searchByAccessTypesEnabled is false', () => {
    it('should disable filter', () => {
      const { getByRole } = renderAccessTypeFilter({
        searchByAccessTypesEnabled: false,
      });

      expect(getByRole('combobox')).toBeDisabled();
    });
  });
});
