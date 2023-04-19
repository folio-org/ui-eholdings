import { render, fireEvent } from '@testing-library/react';
import PackagesFilterAccordion from './packages-filter-accordion';

const mockOnUpdate = jest.fn();

const getComponent = (props = {}) => (
  <PackagesFilterAccordion
    activeFilters={{ packageIds: undefined }}
    dataOptions={[]}
    disabled={false}
    isLoading={false}
    onUpdate={() => {}}
    {...props}
  />
);

const renderComponent = (props = {}) => render(getComponent(props));

describe('Given PackagesFilterAccordion', () => {
  describe('when selected some items', () => {
    it('should show clear filters button when packageIds is string', () => {
      const { container } = renderComponent({
        searchFilter: {
          'packageIds': 'opt1,opt2',
        },
      });

      expect(container.querySelector('[icon=times-circle-solid]')).toBeDefined();
    });

    it('should show clear filters button when packageIds is array', () => {
      const { container } = renderComponent({
        searchFilter: {
          'packageIds': ['opt1', 'opt2'],
        },
      });

      expect(container.querySelector('[icon=times-circle-solid]')).toBeDefined();
    });
  });

  describe('when packages data is loading', () => {
    it('should disable the filter', () => {
      const { container } = renderComponent({
        isLoading: true,
        disabled: false,
      });

      expect(container.querySelector('#packagesFilterSelect-input')).toBeDisabled();
    });
  });

  describe('when selecting an option', () => {
    it('should call onUpdate with the correct arguments', () => {
      const dataOptions = [{
        value: '4591',
        label: 'option1',
        totalRecords: 100,
      }];

      const { getByText } = renderComponent({
        dataOptions,
        onUpdate: mockOnUpdate,
      });

      fireEvent.click(getByText('option1 (100)'));

      expect(mockOnUpdate).toHaveBeenCalledWith({ packageIds: ['4591'] });
    });
  });
});
