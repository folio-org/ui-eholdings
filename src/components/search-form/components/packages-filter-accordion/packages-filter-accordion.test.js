import { render } from '@testing-library/react';
import PackagesFilterAccordion from './packages-filter-accordion';

const getComponent = (props = {}) => (
  <PackagesFilterAccordion
    activeFilters={{ packageIds: '' }}
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

  describe('when packages data is loading and it is not disabled', () => {
    it('should show spinner and accordion', () => {
      const { getByTestId, container } = renderComponent({
        isLoading: true,
        disabled: false,
      });

      expect(getByTestId('spinner-ellipsis')).toBeDefined();
      expect(container.querySelector('#packagesFilter')).toBeDefined();
    });
  });
});
