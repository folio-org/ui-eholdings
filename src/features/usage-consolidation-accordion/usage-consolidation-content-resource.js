import React from 'react';
import PropTypes from 'prop-types';

import FullTextRequestUsageTable from './full-text-request-usage-table';
import SummaryTable from './summary-table';
import NoCostPerUseAvailable from './no-cost-per-use-available';
import {
  costPerUse as costPerUseShape,
  entityTypes,
} from '../../constants';

const propTypes = {
  costPerUseData: costPerUseShape.CostPerUseReduxStateShape.isRequired,
  platformType: PropTypes.string.isRequired,
  startMonth: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
};

const UsageConsolidationContentResource = ({
  costPerUseData,
  platformType,
  startMonth,
  year,
}) => {
  const {
    cost,
    costPerUse,
    usage,
  } = costPerUseData.data?.attributes?.analysis;

  const noCostPerUseAvailable = !cost && !costPerUse && !usage;

  const customProperties = {
    columnMapping: { cost: 'ui-eholdings.usageConsolidation.summary.resourceCost' },
  };

  return noCostPerUseAvailable
    ? (
      <NoCostPerUseAvailable
        entityType={entityTypes.RESOURCE}
        year={year} 
      />
    )
    : (
      <>
        <SummaryTable
          id="resourceUsageConsolidationSummary"
          customProperties={customProperties}
          costPerUseData={costPerUseData}
        />
        <FullTextRequestUsageTable
          costPerUseData={costPerUseData}
          platformType={platformType}
          startMonth={startMonth}
        />
      </>
    );
};

UsageConsolidationContentResource.propTypes = propTypes;

export default UsageConsolidationContentResource;
