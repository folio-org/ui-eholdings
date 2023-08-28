import { render } from '@folio/jest-config-stripes/testing-library/react';

import Harness from '../../../../test/jest/helpers/harness';

import UsageConsolidationContentResource from './usage-consolidation-content-resource';
import { costPerUseTypes } from '../../../constants';

const costPerUseData = {
  data: {
    [costPerUseTypes.RESOURCE_COST_PER_USE]: {
      attributes: {
        analysis: {
          cost: 1,
          costPerUse: 1,
          usage: 1,
        },
        parameters: {
          currency: '',
          startMonth: '',
        },
        usage: {
          platforms: [
            {
              counts: [3, 6, 16],
              isPublisherPlatform: true,
              name: 'name',
              total: 17,
            },
          ],
          totals: {},
        },
      },
    },
  },
  isFailed: false,
  isLoaded: true,
  isLoading: false,
};

const renderUsageConsolidationContentResource = (props = {}) => render(
  <Harness>
    <UsageConsolidationContentResource
      costPerUseData={costPerUseData}
      {...props}
    />
  </Harness>
);

describe('Given UsageConsolidationContentResource', () => {
  it('should not render DOMelement when costPerUseData.data.resourceCostPerUse is null', () => {
    const newCostPerUseData = {
      ...costPerUseData,
      data: {
        ...costPerUseData.data,
        [costPerUseTypes.RESOURCE_COST_PER_USE]: null,
      },
    };

    const { container } = renderUsageConsolidationContentResource({
      costPerUseData: newCostPerUseData,
    });

    expect(container).toBeEmptyDOMElement;
  });

  it('should render a div with message when isFailed of costPerUseData is true', () => {
    const newCostPerUseData = {
      ...costPerUseData,
      isFailed: true,
    };
    const { getByText } = renderUsageConsolidationContentResource({
      costPerUseData: newCostPerUseData
    });

    expect(getByText('ui-eholdings.usageConsolidation.fullTextRequestUsageTable.noResponse')).toBeDefined();
  });

  it('should render NoCostPerUseAvailable when noCostPerUseAvailable and isPlatformsDataEmpty are true', () => {
    const newCostPerUseData = {
      ...costPerUseData,
      data: {
        ...costPerUseData.data,
        [costPerUseTypes.RESOURCE_COST_PER_USE]: {
          ...costPerUseData.data[costPerUseTypes.RESOURCE_COST_PER_USE],
          attributes: {
            analysis: {
              cost: 0,
              costPerUse: 0,
              usage: 0,
            },
            usage: {
              platforms: [],
              totals: {},
            },
          },
        },
      }
    };

    const { getByText } = renderUsageConsolidationContentResource({
      costPerUseData: newCostPerUseData
    });
    expect(getByText('ui-eholdings.usageConsolidation.summary.resource.noData')).toBeDefined();
  });

  it('should render Summary Table and FullTextRequestUsageTable when costPerUseData hold appropriate values', () => {
    const { getByText } = renderUsageConsolidationContentResource();
    // SummaryTable
    expect(getByText('ui-eholdings.usageConsolidation.summary.costPerUse')).toBeDefined();
    // FullTextRequestUsageTable
    expect(getByText('ui-eholdings.usageConsolidation.fullTextRequestUsageTable')).toBeDefined();
  });
});
