import React from 'react';
import PropTypes from 'prop-types';

import NoCostPerUseAvailable from './no-cost-per-use-available';
import SummaryTable from './summary-table';
import {
  costPerUse as costPerUseShape,
  entityTypes,
} from '../../constants';

const propTypes = {
  costPerUseData: costPerUseShape.CostPerUseReduxStateShape.isRequired,
  year: PropTypes.number.isRequired,
};

const UsageConsolidationContentPackage = ({
  costPerUseData,
  year,
}) => {
  const {
    cost,
    costPerUse,
    usage,
  } = costPerUseData.data?.attributes?.analysis;

  const noCostPerUseAvailable = !cost && !costPerUse && !usage;

  const customProperties = {
    columnMapping: { cost: 'ui-eholdings.usageConsolidation.summary.packageCost' },
  };

  return noCostPerUseAvailable
    ? (
      <NoCostPerUseAvailable
        entityType={entityTypes.PACKAGE}
        year={year}
      />
    )
    : (
      <SummaryTable
        id="packageUsageConsolidationSummary"
        costPerUseData={costPerUseData}
        customProperties={customProperties}
      />
    );
};

UsageConsolidationContentPackage.propTypes = propTypes;

export default UsageConsolidationContentPackage;
