import React from 'react';
import PropTypes from 'prop-types';

import {
  MultiColumnList,
} from '@folio/stripes/components';

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

const UsageConsolidationContentPackage = props => {
  const {
    cost,
    costPerUse,
    usage,
  } = props.costPerUseData.data[costPerUseTypes.PACKAGE_COST_PER_USE]?.attributes?.analysis;

  const noCostPerUseAvailable = !cost && !costPerUse && !usage;

  const customProperties = {
    columnMapping: { cost: 'ui-eholdings.usageConsolidation.summary.packageCost' },
  };

  return (
    <>
      <SummaryTable
        id="packageUsageConsolidationSummary"
        entityType={entityTypes.PACKAGE}
        customProperties={customProperties}
        noCostPerUseAvailable={noCostPerUseAvailable}
        costPerUseType={costPerUseTypes.PACKAGE_COST_PER_USE}
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
