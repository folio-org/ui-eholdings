import { render, act } from '@testing-library/react';
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
      const { getByTestId } = renderComponent({
        params: { q: 'book' },
        titlesFacets,
        activeFilters: { packageIds: '5478' },
      });

      expect(getByTestId('spinner-ellipsis')).toBeDefined();
    });
  });

  describe('when changing any filter other then `Packages` or search terms', () => {
    it('should update dataOptions', () => {
      const props = {
        params: { q: 'book' },
        titlesFacets,
        activeFilters: { packageIds: '' },
        results: { length: 44 },
      };

      const { rerender } = renderComponent(props);

      rerender(getComponent({
        ...props,
        titlesFacets: {
          packages: [{ id: 5478, name: 'name2', count: 200 }],
        },
      }));

      const expectedProps = {
        dataOptions: [{
          value: '5478',
          label: 'name2',
          totalRecords: 200,
        }],
      };

      expect(PackagesFilterAccordion).toHaveBeenLastCalledWith(expect.objectContaining(expectedProps), {});
    });
  });

  describe('when we change the `Packages` filter for the first time', () => {
    it('should not change dataOptions', () => {
      const props = {
        params: { q: 'book' },
        titlesFacets,
        activeFilters: { packageIds: '' },
        prevDataOfOptedPackage: {},
      };

      const { rerender } = renderComponent(props);

      rerender(getComponent({
        ...props,
        activeFilters: { packageIds: '4591' },
        titlesFacets: {
          packages: [{ id: 5478, name: 'name2', count: 200 }],
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
        }],
      };

      expect(PackagesFilterAccordion).toHaveBeenCalledWith(expect.objectContaining(expectedProps), {});
    });
  });

  describe('when we change the `Packages` filter for the not first time', () => {
    it('should not change dataOptions', () => {
      const props = {
        params: { q: 'book' },
        titlesFacets,
        activeFilters: { packageIds: '5478' },
        prevDataOfOptedPackage: {},
      };

      const { rerender } = renderComponent(props);

      rerender(getComponent({
        ...props,
        activeFilters: { packageIds: '4591' },
        titlesFacets: {
          packages: [{ id: 4591, name: 'name1', count: 100 }],
        },
      }));

      act(() => { PackagesFilterAccordion.mock.calls[0][0].onUpdate(); });

      rerender(getComponent({
        ...props,
        activeFilters: { packageIds: '5478' },
        titlesFacets: {
          packages: [{ id: 5478, name: 'name2', count: 200 }],
        },
      }));

      const expectedProps = {
        dataOptions: [{
          value: '4591',
          label: 'name1',
          totalRecords: 100,
        }],
      };

      expect(PackagesFilterAccordion).toHaveBeenLastCalledWith(expect.objectContaining(expectedProps), {});
    });
  });

  it('should pass dataOptions with missing option', () => {
    const props = {
      params: { q: 'book' },
      titlesFacets,
      activeFilters: { packageIds: '5478' },
      prevDataOfOptedPackage: {},
    };

    const { rerender } = renderComponent(props);

    rerender(getComponent({
      ...props,
      activeFilters: { packageIds: '5478' },
      titlesFacets: {
        packages: [{ id: 4591, name: 'name1', count: 100 }],
      },
      prevDataOfOptedPackage: { id: '4591', name: 'name1', count: 100 },
    }));

    act(() => { PackagesFilterAccordion.mock.calls[0][0].onUpdate(); });

    rerender(getComponent({
      ...props,
      activeFilters: { packageIds: '5478' },
      titlesFacets: {},
      prevDataOfOptedPackage: { id: '4591', name: 'name1', count: 100 },
    }));

    const expectedProps = {
      dataOptions: [{
        label: 'name1',
        totalRecords: 0,
        value: '4591',
      }],
    };

    expect(PackagesFilterAccordion).toHaveBeenLastCalledWith(expect.objectContaining(expectedProps), {});
  });
});
