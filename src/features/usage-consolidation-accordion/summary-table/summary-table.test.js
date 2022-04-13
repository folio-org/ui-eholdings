import { render } from '@testing-library/react';

import {
  entityTypes,
  costPerUseTypes,
} from '../../../constants';

import Harness from '../../../../test/jest/helpers/harness';

import SummaryTable from './summary-table';

const costPerUseData = {
  data: {
    [costPerUseTypes.TITLE_COST_PER_USE]: {
      attributes: {
        analysis: {
          cost: 'test-cost',
          costPerUse: 'test-costPerUse',
          usage: 'test-usage',
        },
        parameters: {
          currency: '',
          startMonth: '',
        },
      },
      attributes: {
        analysis: {
          cost: 'test-cost',
          costPerUse: 'test-costPerUse',
          usage: 'test-usage',
        },
        parameters: {
          currency: '',
          startMonth: '',
        },
      },
    },
  },
  errors: [],
  isFailed: false,
  isLoaded: true,
  isLoading: false,
};

const customProperties = {};

const renderSummaryTable = (props = {}) => render(
  <Harness>
    <SummaryTable
      costPerUseData={costPerUseData}
      costPerUseType={costPerUseTypes.TITLE_COST_PER_USE}
      customProperties={customProperties}
      entityType={entityTypes.TITLE}
      id="titleUsageConsolidationSummary"
      noCostPerUseAvailable={false}
      {...props}
    />
  </Harness>
);

describe('Given SummaryTable', () => {
  it('should display default summary table columns', () => {
    const { getByText } = renderSummaryTable();

    expect(getByText('cost')).toBeDefined();
    expect(getByText('ui-eholdings.usageConsolidation.summary.totalUsage')).toBeDefined();
    expect(getByText('ui-eholdings.usageConsolidation.summary.costPerUse')).toBeDefined();
  });

  describe('when entity type is title', () => {
    it('should display Holdings Summary label', () => {
      const { getByText } = renderSummaryTable();

      expect(getByText('ui-eholdings.usageConsolidation.holdingsSummary')).toBeDefined();
    });
  });

  describe('when entity type is not title', () => {
    it('should not display Holdings Summary label', () => {
      const { queryByText } = renderSummaryTable({
        entityType: entityTypes.RESOURCE,
      });

      expect(queryByText('ui-eholdings.usageConsolidation.holdingsSummary')).toBeNull();
    });
  });

  describe('when noCostPerUseAvailable is true', () => {
    it('should not display summary table', () => {
      const { queryByText } = renderSummaryTable({
        noCostPerUseAvailable: true,
      });

      expect(queryByText('ui-eholdings.usageConsolidation.holdingsSummary')).toBeNull();
      expect(queryByText('cost')).toBeNull();
      expect(queryByText('ui-eholdings.usageConsolidation.summary.totalUsage')).toBeNull();
      expect(queryByText('ui-eholdings.usageConsolidation.summary.costPerUse')).toBeNull();
    });
  });
});
