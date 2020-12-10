import React from 'react';
import PropTypes from 'prop-types';

import noCostPerUseAvailable from './no-cost-per-use-available';
import SummaryTable from './summary-table';
import {
  costPerUse as costPerUseShape,
  entityTypes,
} from '../../constants';
import NoCostPerUseAvailable from './no-cost-per-use-available';

const propTypes = {
  costPerUseData: costPerUseShape.CostPerUseReduxStateShape.isRequired,
  year: PropTypes.number.isRequired,
};

const UsageConsolidationContentPackage = props => {
  const {
    cost,
    costPerUse,
    usage,
  } = props.costPerUseData.data?.attributes?.analysis;

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
      noCostPerUseAvailable={noCostPerUseAvailable}
    />
  );
};

UsageConsolidationContentPackage.propTypes = propTypes;

export default UsageConsolidationContentPackage;
