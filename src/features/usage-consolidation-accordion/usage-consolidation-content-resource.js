import React from 'react';
import PropTypes from 'prop-types';

import SummaryTable from './summary-table';
import FullTextRequestUsageTable from './full-text-request-usage-table';
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

  return (
    <>
      <SummaryTable
        id="resourceUsageConsolidationSummary"
        entityType={entityTypes.RESOURCE}
        customProperties={customProperties}
        noCostPerUseAvailable={noCostPerUseAvailable}
        costPerUseData={costPerUseData}
        year={year}
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
