import React from 'react';
import PropTypes from 'prop-types';

import SummaryTable from './summary-table';
import {
  costPerUse as costPerUseShape,
  entityTypes,
} from '../../constants';

const propTypes = {
  costPerUseData: costPerUseShape.CostPerUseReduxStateShape.isRequired,
  year: PropTypes.string.isRequired,
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

  return (
    <SummaryTable
      id="packageUsageConsolidationSummary"
      entityType={entityTypes.PACKAGE}
      customProperties={customProperties}
      noCostPerUseAvailable={noCostPerUseAvailable}
      {...props}
    />
  );
};

UsageConsolidationContentPackage.propTypes = propTypes;

export default UsageConsolidationContentPackage;
