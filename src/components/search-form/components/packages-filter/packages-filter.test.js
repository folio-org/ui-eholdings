import { render } from '@testing-library/react';
import PackagesFilter from './packages-filter';
import PackagesFilterAccordion from '../packages-filter-accordion';

jest.mock('../packages-filter-accordion', () => jest.fn(() => <div>PackagesFilterAccordion</div>));

const titlesFacets = {
  packages: [{
    id: '4591',
    name: 'name1',
    count: 100,
  }, {
    id: '5478',
    name: 'name2',
    count: 200,
  }],
};

const activeFilters = { packageIds: ['5478', '4591'] };

const packagesFilterMap = {
  4591: { id: '4591', name: 'name1', count: 100 },
  5478: { id: '5478', name: 'name2', count: 200 },
};

const getComponent = (props = {}) => (
  <PackagesFilter
    activeFilters={{ packageIds: '' }}
    disabled={false}
    params={{ q: 'book' }}
    titlesFacets={{}}
    packagesFilterMap={{}}
    results={{}}
    onUpdate={() => {}}
    {...props}
  />
);

const renderComponent = (props = {}) => render(getComponent(props));

describe('Given PackagesFilter', () => {
  describe('when there is no query', () => {
    it('should not display the filter', () => {
      const { container } = renderComponent({
        params: { q: 'book' },
        activeFilters: { packageIds: '' },
        results: { length: 0, isLoading: false },
      });

      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('when there are no results and no Packages filter options are selected', () => {
    it('should not display the filter', () => {
      const { container } = renderComponent({
        params: { q: '' },
      });

      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('when it is first results loading', () => {
    it('should display spinner', () => {
      const { getByTestId } = renderComponent({
        params: { q: 'book' },
        activeFilters: { packageIds: '' },
        results: { length: 0, isLoading: true },
      });

      expect(getByTestId('spinner-ellipsis')).toBeDefined();
    });
  });

  describe('when the user returns to the Titles tab from Packages/Providers or from the result view', () => {
    it('should display spinner', () => {
      const { getByTestId } = renderComponent({
        params: { q: 'book' },
        titlesFacets,
        activeFilters: { packageIds: '5478' },
      });

      expect(getByTestId('spinner-ellipsis')).toBeDefined();
    });
  });

  it('should pass dataOptions with missing option', () => {
    const props = {
      titlesFacets,
      activeFilters,
      packagesFilterMap,
    };

    const newTitlesFacets = {
      packages: [{ id: '5478', name: 'name2', count: 200 }],
    };

    const expectedProps = {
      dataOptions: [{
        value: '5478',
        label: 'name2',
        totalRecords: 200,
      }, {
        value: '4591',
        label: 'name1',
        totalRecords: 0,
      }],
    };

    const { rerender } = renderComponent(props);

    rerender(getComponent({
      ...props,
      titlesFacets: newTitlesFacets,
    }));

    expect(PackagesFilterAccordion).toHaveBeenLastCalledWith(expect.objectContaining(expectedProps), {});
  });
});
