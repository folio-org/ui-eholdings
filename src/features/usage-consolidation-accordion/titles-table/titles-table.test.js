import {
  cleanup,
  fireEvent,
  render,
} from '@testing-library/react';
import Harness from '../../../../test/jest/helpers/harness';

import TitlesTable from './titles-table';

const mockFetchPage = jest.fn();
const mockOnSortTitles = jest.fn();

const defaultResource = {
  resourceId: 'test-resourceId',
  attributes: {
    publicationType: 'test-publication-type',
    name: 'test-name',
    percent: 10,
    cost: 100,
    usage: 10,
    costPerUse: 10,
  },
};

const getData = (resourceCount = 1, totalResults = 1, resource = defaultResource) => ({
  packageTitleCostPerUse: {
    attributes: {
      resources: new Array(resourceCount).fill(resource),
      meta: { totalResults },
      parameters: {
        currency: 'USD',
        startMonth: '01/01/2020',
      },
      analysis: [{
        cost: 100,
        costPerUse: 1,
        usage: 1,
      }],
    },
    id: 'id',
    type: 'type',
  },
});

const costPerUseData = {
  data: getData(),
  errors: [],
  isFailed: false,
  isLoaded: true,
  isLoading: false,
  isPackageTitlesFailed: false,
  isPackageTitlesLoaded: true,
  isPackageTitlesLoading: false,
};

const renderTitlesTable = (props = {}) => render(
  <Harness>
    <TitlesTable
      costPerUseData={costPerUseData}
      fetchPage={mockFetchPage}
      onSortTitles={mockOnSortTitles}
      {...props}
    />
  </Harness>
);

describe('Given TitlesTable', () => {
  beforeEach(() => {
    cleanup();
  });

  describe('when package titles for cost per use was not loaded', () => {
    it('should not render table', () => {
      const { queryByText } = renderTitlesTable({
        costPerUseData: {
          ...costPerUseData,
          data: {},
          isPackageTitlesLoaded: false,
          isPackageTitlesFailed: true,
        },
      });

      expect(queryByText('ui-eholdings.usageConsolidation.titles.title')).toBeNull();
      expect(queryByText('ui-eholdings.usageConsolidation.titles.type')).toBeNull();
      expect(queryByText('ui-eholdings.usageConsolidation.titles.percentOfUsage')).toBeNull();
      expect(queryByText('ui-eholdings.usageConsolidation.summary.costPerUse')).toBeNull();
      expect(queryByText('ui-eholdings.usageConsolidation.titles.cost')).toBeNull();
      expect(queryByText('ui-eholdings.usageConsolidation.summary.title.usage')).toBeNull();
    });

    it('should show toast error message', () => {
      const { getByText } = renderTitlesTable({
        costPerUseData: {
          ...costPerUseData,
          isPackageTitlesFailed: true,
          errors: ['error'],
        },
      });

      expect(getByText('ui-eholdings.usageConsolidation.titles.loadingFailed')).toBeDefined();
    });
  });

  describe('when data is loading', () => {
    it('should show loading message', () => {
      const { getByText } = renderTitlesTable({
        costPerUseData: {
          ...costPerUseData,
          isPackageTitlesLoaded: false,
          isPackageTitlesLoading: true,
          data: {},
        },
      });

      expect(getByText('ui-eholdings.usageConsolidation.titles.loading')).toBeDefined();
    });
  });

  describe('when table is hidden', () => {
    it('should not render table', () => {
      const { queryByText } = renderTitlesTable({
        costPerUseData: {
          ...costPerUseData,
          data: {},
        },
      });

      expect(queryByText('ui-eholdings.usageConsolidation.titles.title')).toBeNull();
      expect(queryByText('ui-eholdings.usageConsolidation.titles.type')).toBeNull();
      expect(queryByText('ui-eholdings.usageConsolidation.titles.percentOfUsage')).toBeNull();
      expect(queryByText('ui-eholdings.usageConsolidation.summary.costPerUse')).toBeNull();
      expect(queryByText('ui-eholdings.usageConsolidation.titles.cost')).toBeNull();
      expect(queryByText('ui-eholdings.usageConsolidation.summary.title.usage')).toBeNull();
    });
  });

  describe('when data was loaded successfully', () => {
    it('should render table', () => {
      const { getByText } = renderTitlesTable();

      expect(getByText('ui-eholdings.usageConsolidation.titles.title')).toBeDefined();
      expect(getByText('ui-eholdings.usageConsolidation.titles.type')).toBeDefined();
      expect(getByText('ui-eholdings.usageConsolidation.titles.percentOfUsage')).toBeDefined();
      expect(getByText('ui-eholdings.usageConsolidation.summary.costPerUse')).toBeDefined();
      expect(getByText('ui-eholdings.usageConsolidation.titles.cost')).toBeDefined();
      expect(getByText('ui-eholdings.usageConsolidation.summary.title.usage')).toBeDefined();
    });

    describe('and when click on column header', () => {
      it('should handle onSortTitles', () => {
        const { getByText } = renderTitlesTable();

        fireEvent.click(getByText('ui-eholdings.usageConsolidation.titles.title'));

        expect(mockOnSortTitles).toHaveBeenCalled();
      });
    });

    describe('when percent is 10', () => {
      it('should show "10 %"', () => {
        const { getByText } = renderTitlesTable();

        expect(getByText('10 %')).toBeDefined();
      });
    });

    describe('when percent is 0.5', () => {
      it('should show "< 1 %"', () => {
        const { getByText } = renderTitlesTable(renderTitlesTable({
          costPerUseData: {
            ...costPerUseData,
            data: getData(1, 1, {
              ...defaultResource,
              attributes: {
                ...defaultResource.attributes,
                percent: 0.5,
              },
            }),
          },
        }));

        expect(getByText('< 1 %')).toBeDefined();
      });
    });

    describe('when percent is 0', () => {
      it('should show NoValue component', () => {
        const { getByText } = renderTitlesTable(renderTitlesTable({
          costPerUseData: {
            ...costPerUseData,
            data: getData(1, 1, {
              ...defaultResource,
              attributes: {
                ...defaultResource.attributes,
                percent: 0,
              },
            }),
          },
        }));

        expect(getByText('NoValue')).toBeDefined();
      });
    });

    describe('when total results more then page size', () => {
      describe('and click on Next button', () => {
        it('should handle fetchPage', () => {
          const { getByText } = renderTitlesTable({
            costPerUseData: {
              ...costPerUseData,
              data: getData(100, 120),
            },
          });

          fireEvent.click(getByText('stripes-components.next'));

          expect(mockFetchPage).toHaveBeenCalled();
        });

        describe('and click on Previous button', () => {
          it('should handle fetchPage', () => {
            const { getByText } = renderTitlesTable({
              costPerUseData: {
                ...costPerUseData,
                data: getData(100, 120),
              },
            });

            fireEvent.click(getByText('stripes-components.previous'));

            expect(mockFetchPage).toHaveBeenCalled();
          });
        });
      });
    });
  });
});
