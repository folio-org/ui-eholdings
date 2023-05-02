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
    it('should show clear filters button', () => {
      const { container } = renderComponent({
        searchFilter: {
          packageIds: '3453',
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

      expect(container.querySelector('#packagesFilterSelect')).toBeDisabled();
    });
  });

  describe('when selecting an option', () => {
    it('should call onUpdate with the correct arguments', () => {
      const dataOptions = [{
        value: '4591',
        label: 'option1',
        totalRecords: 100,
      }];

      const activeFilters = {
        selected: 'true',
        sort: 'name',
        type: 'book',
      };

      const { getByText } = renderComponent({
        dataOptions,
        onUpdate: mockOnUpdate,
        activeFilters,
      });

      fireEvent.click(getByText('option1 (100)'));

      expect(mockOnUpdate).toHaveBeenCalledWith({
        ...activeFilters,
        packageIds: '4591',
      });
    });
  });

  describe('when a user enters a character that needs to be escaped in the regexp', () => {
    it('should be treated', () => {
      const dataOptions = [{
        value: '4591',
        label: '[option1',
        totalRecords: 100,
      }, {
        value: '8347',
        label: 'option2',
        totalRecords: 200,
      }];

      const { container } = renderComponent({ dataOptions });

      const input = container.querySelector('input[type="text"]');
      fireEvent.change(input, { target: { value: '[' } });

      expect(container.querySelector('[data-test-highlighter-mark]')).toHaveTextContent('[');
    });
  });
});
