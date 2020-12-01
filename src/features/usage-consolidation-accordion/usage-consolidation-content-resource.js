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

const UsageConsolidationContentResource = props => (
  <SummaryTable
    id="resourceUsageConsolidationSummary"
    entityType={entityTypes.TITLE}
    customProperties={{
      columnMapping: { cost: 'ui-eholdings.usageConsolidation.summary.resourceCost' },
    }}
    {...props}
  />
);

UsageConsolidationContentResource.propTypes = propTypes;

export default UsageConsolidationContentResource;
