import { render } from '@testing-library/react';
import noop from 'lodash/noop';

import AccessTypesFilterAccordion from './access-types-filter-accordion';

const accessTypesStoreData = {
  isDeleted: false,
  isLoading: false,
  items: {
    data: [{
      attributes: {
        description: 'description',
        name: 'name',
      },
      id: 'id1',
      type: 'accessType',
    }],
  },
};

const AccordionHeader = () => <span>Accordion Header</span>;

const renderAccessTypesFilter = (props = {}) => render(
  <AccessTypesFilterAccordion
    accessTypesStoreData={accessTypesStoreData}
    searchByAccessTypesEnabled
    onStandaloneFilterChange={noop}
    onStandaloneFilterToggle={noop}
    isOpen
    header={AccordionHeader}
    dataOptions={[{
      label: 'opt1',
      value: 'opt1',
    }, {
      label: 'opt2',
      value: 'opt1',
    }]}
    handleStandaloneFilterChange={noop}
    onToggle={noop}
    {...props}
  />
);

describe('Given AccessTypesFilterAccordion', () => {
  describe('when selected some items', () => {
    it('should show clear filters button when access-type is string', () => {
      const { container } = renderAccessTypesFilter({
        isOpen: false,
        searchFilter: {
          'access-type': 'opt1,opt2',
        },
      });

      expect(container.querySelector('[icon=times-circle-solid]')).toBeDefined();
    });

    it('should show clear filters button when access-type is array', () => {
      const { container } = renderAccessTypesFilter({
        isOpen: false,
        searchFilter: {
          'access-type': ['opt1', 'opt2'],
        },
      });

      expect(container.querySelector('[icon=times-circle-solid]')).toBeDefined();
    });
  });

  describe('when access types data is loading', () => {
    it('should show spinner', () => {
      const { container } = renderAccessTypesFilter({
        accessTypesStoreData: {
          ...accessTypesStoreData,
          isLoading: true,
        },
      });

      expect(container.querySelector('.icon-spinner-ellipsis')).toBeDefined();
    });
  });
});
