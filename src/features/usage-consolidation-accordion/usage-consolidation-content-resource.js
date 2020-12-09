import React from 'react';
import PropTypes from 'prop-types';

import SummaryTable from './summary-table';
import {
  costPerUse as costPerUseShape,
  entityTypes,
  costPerUseTypes,
} from '../../constants';

const propTypes = {
  costPerUseData: costPerUseShape.CostPerUseReduxStateShape.isRequired,
  year: PropTypes.string.isRequired,
};

const UsageConsolidationContentResource = props => {
  const data = props.costPerUseData.data[costPerUseTypes.RESOURCE_COST_PER_USE];

  if (!data) {
    return null;
  }

  const {
    cost,
    costPerUse,
    usage,
  } = data.attributes?.analysis;

  const noCostPerUseAvailable = !cost && !costPerUse && !usage;

  const customProperties = {
    columnMapping: { cost: 'ui-eholdings.usageConsolidation.summary.resourceCost' },
  };

  return (
    <SummaryTable
      id="resourceUsageConsolidationSummary"
      entityType={entityTypes.RESOURCE}
      customProperties={customProperties}
      noCostPerUseAvailable={noCostPerUseAvailable}
      costPerUseType={costPerUseTypes.PACKAGE_COST_PER_USE}
      {...props}
    />
  );
};

UsageConsolidationContentResource.propTypes = propTypes;

export default UsageConsolidationContentResource;
