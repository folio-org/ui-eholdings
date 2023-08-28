import { render } from '@folio/jest-config-stripes/testing-library/react';
import PackagesFilter from './packages-filter';
import PackagesFilterAccordion from '../packages-filter-accordion';

jest.mock('../packages-filter-accordion', () => jest.fn(() => <div>PackagesFilterAccordion</div>));

const titlesFacets = {
  packages: [{
    id: 4591,
    name: 'name1',
    count: 100,
  }, {
    id: 5478,
    name: 'name2',
    count: 200,
  }],
};

const getComponent = (props = {}) => (
  <PackagesFilter
    activeFilters={{ packageIds: '' }}
    disabled={false}
    params={{ q: 'book' }}
    titlesFacets={{}}
    prevDataOfOptedPackage={{}}
    packagesFacetCollection={{}}
    results={{}}
    onUpdate={() => {}}
    {...props}
  />
);

const renderComponent = (props = {}) => render(getComponent(props));

describe('Given PackagesFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
      const props = {
        params: { q: 'book' },
        titlesFacets,
        activeFilters: { packageIds: '5478' },
      };
      const { getByTestId } = renderComponent(props);

      expect(getByTestId('spinner-ellipsis')).toBeDefined();
    });
  });

  it('should pass dataOptions', () => {
    const props = {
      titlesFacets,
      activeFilters: { packageIds: '5478' },
      prevDataOfOptedPackage: {
        id: '5478',
        name: 'name2',
        count: 200,
      },
    };

    const { rerender } = renderComponent(props);

    rerender(getComponent({
      ...props,
      titlesFacets: {},
    }));

    const expectedProps = {
      dataOptions: [{
        label: 'name2',
        value: '5478',
        totalRecords: 0,
      }],
    };

    expect(PackagesFilterAccordion).toHaveBeenLastCalledWith(expect.objectContaining(expectedProps), {});
  });

  it('should pass dataOptions with missing option', () => {
    const props = {
      titlesFacets,
      activeFilters: { packageIds: '5478' },
    };

    const { rerender } = renderComponent(props);

    rerender(getComponent({
      ...props,
      titlesFacets: {
        packages: [
          ...titlesFacets.packages,
          {
            id: 7777,
            name: 'name3',
            count: 300,
          },
        ],
      },
    }));

    const expectedProps = {
      dataOptions: [{
        value: '4591',
        label: 'name1',
        totalRecords: 100,
      }, {
        value: '5478',
        label: 'name2',
        totalRecords: 200,
      }, {
        value: '7777',
        label: 'name3',
        totalRecords: 300,
      }],
    };

    expect(PackagesFilterAccordion).toHaveBeenLastCalledWith(expect.objectContaining(expectedProps), {});
  });
});
