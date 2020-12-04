import React from 'react';
import PropTypes from 'prop-types';

import {
  MultiColumnList,
} from '@folio/stripes/components';

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
  const customProperties = {
    columnMapping: { cost: 'ui-eholdings.usageConsolidation.summary.packageCost' },
  };

  return (
    <>
      <SummaryTable
        id="packageUsageConsolidationSummary"
        entityType={entityTypes.PACKAGE}
        customProperties={customProperties}
        {...props}
      />
      <MultiColumnList
        id="packageUsageConsolidationTitles"
        contentData={[]}
        formatter={{}}
        visibleColumns={[]}
        columnMapping={{}}
        columnWidths={{}}
      />
    </>
  );
};

UsageConsolidationContentPackage.propTypes = propTypes;

export default UsageConsolidationContentPackage;
