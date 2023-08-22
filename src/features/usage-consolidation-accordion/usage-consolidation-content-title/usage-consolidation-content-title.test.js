import { render } from '@folio/jest-config-stripes/testing-library/react';

import Harness from '../../../../test/jest/helpers/harness';

import UsageConsolidationContentTitle from './usage-consolidation-content-title';

import { costPerUseTypes } from '../../../constants';

const mockProps = {
  costPerUseData: {
    data: {
      [costPerUseTypes.TITLE_COST_PER_USE]: {
        attributes: {
          analysis: {
            holdingsSummary: [
              {
                cost: 0,
                costPerUse: 0,
                coverages: [
                  {
                    beginCoverage: '2021-01-01',
                    endCoverage: '2021-01-31',
                  }
                ],
                embargoPeriod: {
                  embargoUnit: 'embargo-unit',
                  embargoValue: 'embargo-value',
                },
                packageName: 'package-name',
                packageId: 'mackage-id',
                resourceId: 'resource-id',
                usage: 0,
              }
            ],
          },
          usage: {
            platforms: [],
            totals: {},
          },
        },
        id: 'id',
        type: 'type',
      },
    },
    errors: [],
    isFailed: false,
    isLoaded: true,
    isLoading: false,
    isPackageTitlesFailed: false,
    isPackageTitlesLoaded: true,
    isPackageTitlesLoading: false,
  },
  platformType: 'platform-type',
  startMonth: 'January',
  year: 0,
};

const renderUsageConsolidationContentTitle = (props = {}) => render(
  <Harness>
    <UsageConsolidationContentTitle
      {...mockProps}
      {...props}
    />
  </Harness>
);

describe('Given UsageConsolidationContentTitle', () => {
  it('should render UsageConsolidationContentTitle', () => {
    const { getByText } = renderUsageConsolidationContentTitle();

    expect(getByText('ui-eholdings.usageConsolidation.holdingsSummary')).toBeInTheDocument();
    expect(getByText('ui-eholdings.usageConsolidation.summary.packageName')).toBeInTheDocument();
    expect(getByText('ui-eholdings.usageConsolidation.summary.coverage')).toBeInTheDocument();
    expect(getByText('ui-eholdings.usageConsolidation.summary.titleCost')).toBeInTheDocument();
    expect(getByText('ui-eholdings.usageConsolidation.fullTextRequestUsageTable')).toBeInTheDocument();
    expect(getByText('ui-eholdings.usageConsolidation.fullTextRequestUsageTable.header.platform')).toBeInTheDocument();
    expect(getByText('ui-eholdings.usageConsolidation.fullTextRequestUsageTable.header.dec')).toBeInTheDocument();
    expect(getByText('ui-eholdings.usageConsolidation.fullTextRequestUsageTable.header.total')).toBeInTheDocument();
    expect(getByText('ui-eholdings.usageConsolidation.fullTextRequestUsageTable.header.publisher')).toBeInTheDocument();
  });

  it('should render packageName table column link', () => {
    const { getByText } = renderUsageConsolidationContentTitle();

    expect(getByText('package-name').closest('a')).toHaveAttribute('href', '/eholdings/resources/resource-id');
  });

  it('should render visible columns', () => {
    const { queryByText } = renderUsageConsolidationContentTitle();

    expect(queryByText('ui-eholdings.usageConsolidation.summary.packageName')).toBeInTheDocument();
    expect(queryByText('ui-eholdings.usageConsolidation.summary.coverage')).toBeInTheDocument();
    expect(queryByText('ui-eholdings.usageConsolidation.summary.titleCost')).toBeInTheDocument();
  });

  describe('when there is no holdings summary', () => {
    it('should not render holdings summary', () => {
      const { queryByText } = renderUsageConsolidationContentTitle({
        costPerUseData: {
          ...mockProps.costPerUseData,
          data: {
            [costPerUseTypes.TITLE_COST_PER_USE]: {
              ...mockProps.costPerUseData.data[costPerUseTypes.TITLE_COST_PER_USE],
              attributes: {
                ...mockProps.costPerUseData.data[costPerUseTypes.TITLE_COST_PER_USE].attributes,
                analysis: undefined
              },
            },
          },
        },
      });

      expect(queryByText('ui-eholdings.usageConsolidation.holdingsSummary')).not.toBeInTheDocument();
    });
  });

  describe('when there is no rowData coverages', () => {
    it('should render NoValue component instead of list', () => {
      const { queryByText } = renderUsageConsolidationContentTitle({
        costPerUseData: {
          ...mockProps.costPerUseData,
          data: {
            [costPerUseTypes.TITLE_COST_PER_USE]: {
              ...mockProps.costPerUseData.data[costPerUseTypes.TITLE_COST_PER_USE],
              attributes: {
                ...mockProps.costPerUseData.data[costPerUseTypes.TITLE_COST_PER_USE].attributes,
                analysis: {
                  holdingsSummary: [
                    {
                      cost: 0,
                      costPerUse: 0,
                      coverages: [],
                      embargoPeriod: {
                        embargoUnit: 'embargo-unit',
                        embargoValue: 'embargo-value',
                      },
                      packageName: 'package-name',
                      packageId: 'mackage-id',
                      resourceId: 'resource-id',
                      usage: 0,
                    },
                  ],
                },
              },
            },
          },
        },
      });

      expect(queryByText('ui-eholdings.usageConsolidation.summary.embargo')).not.toBeInTheDocument();
      expect(queryByText('ui-eholdings.resource.embargoUnit.embargo-unit')).not.toBeInTheDocument();
    });
  });

  describe('when there is no title-cost-per-use data property in props', () => {
    it('should render null', () => {
      const { container } = renderUsageConsolidationContentTitle({
        costPerUseData: {
          ...mockProps.costPerUseData,
          data: {
            [costPerUseTypes.TITLE_COST_PER_USE]: null,
          },
        },
      });

      expect(container.children.length).toBe(0);
    });
  });

  describe('when it is failed', () => {
    it('should show an error message', () => {
      const { getByText } = renderUsageConsolidationContentTitle({
        costPerUseData: {
          ...mockProps.costPerUseData,
          isFailed: true,
        },
      });

      expect(getByText('ui-eholdings.usageConsolidation.fullTextRequestUsageTable.noResponse')).toBeInTheDocument();
    });
  });

  describe('when no cost-per-use available and platforms data is empty', () => {
    it('should render NoCostPerUseAvailable', () => {
      const { getByText } = renderUsageConsolidationContentTitle({
        costPerUseData: {
          ...mockProps.costPerUseData,
          data: {
            [costPerUseTypes.TITLE_COST_PER_USE]: {
              ...mockProps.costPerUseData.data[costPerUseTypes.TITLE_COST_PER_USE],
              attributes: {
                ...mockProps.costPerUseData.data[costPerUseTypes.TITLE_COST_PER_USE].attributes,
                analysis: null,
              },
            }
          }
        },
      });

      expect(getByText('ui-eholdings.usageConsolidation.summary.title.noData')).toBeInTheDocument();
    });
  });
});
