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

const UsageConsolidationContentPackage = props => (
  <SummaryTable
    id="packageUsageConsolidationSummary"
    entityType={entityTypes.PACKAGE}
    customProperties={{
      columnMapping: { cost: 'ui-eholdings.usageConsolidation.summary.packageCost' },
    }}
    {...props}
  />
);

UsageConsolidationContentPackage.propTypes = propTypes;

export default UsageConsolidationContentPackage;
